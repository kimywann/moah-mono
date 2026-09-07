import type {
  TResumeFileFormat,
  TResumeUploadRequest,
} from "@moah/contracts/schema/resume";
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  PayloadTooLargeException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ResumeS3Service } from "./resume.s3.service";

const MAX_RESUME_COUNT = 50; // 사용자별 최대 이력서 개수
const MAX_RESUME_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 파일당 최대 10MB
const MAX_TOTAL_RESUME_SIZE_BYTES = 500 * 1024 * 1024; // 사용자별 전체 최대 500MB
const MAX_ACTIVE_UPLOADS = 1; // 동시에 업로드 가능한 파일 수
const UPLOAD_URL_EXPIRES_IN_SECONDS = 60 * 10; // 업로드 URL 유효 시간 10분
const PENDING_RESUME_RETENTION_MS = UPLOAD_URL_EXPIRES_IN_SECONDS * 1000; // PENDING 보관 시간

const RESUME_CONTENT_TYPES: Record<TResumeFileFormat, string> = {
  DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  PDF: "application/pdf",
};

@Injectable()
export class ResumeService {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService,
    @Inject(ResumeS3Service) private readonly resumeS3Service: ResumeS3Service,
  ) {}

  async createUploadUrl(userId: string, request: TResumeUploadRequest) {
    const fileFormat = this.getFileFormat(request);

    if (request.fileSize > MAX_RESUME_FILE_SIZE_BYTES) {
      throw new PayloadTooLargeException(
        "이력서 파일은 10MB 이하만 업로드할 수 있습니다.",
      );
    }

    await this.removeExpiredPendingResumes(userId);

    const [pendingCount, resumeCount, totalSize] = await Promise.all([
      this.prismaService.resume.count({
        where: {
          userId,
          status: "PENDING",
        },
      }),
      this.prismaService.resume.count({
        where: {
          userId,
          status: {
            in: ["PENDING", "READY"],
          },
        },
      }),
      this.prismaService.resume.aggregate({
        _sum: { fileSize: true },
        where: {
          userId,
          status: {
            in: ["PENDING", "READY"],
          },
        },
      }),
    ]);

    if (pendingCount >= MAX_ACTIVE_UPLOADS) {
      throw new ConflictException("이미 업로드 중인 이력서가 있습니다.");
    }

    if (resumeCount >= MAX_RESUME_COUNT) {
      throw new ConflictException("이력서는 최대 50개까지 보유할 수 있습니다.");
    }

    const currentTotalSize = totalSize._sum.fileSize ?? 0;

    if (currentTotalSize + request.fileSize > MAX_TOTAL_RESUME_SIZE_BYTES) {
      throw new PayloadTooLargeException(
        "이력서 전체 용량은 500MB를 초과할 수 없습니다.",
      );
    }

    const uploadUrlExpiresAt = new Date(
      Date.now() + PENDING_RESUME_RETENTION_MS,
    );
    const { key, uploadUrl, expiresIn } =
      await this.resumeS3Service.createUploadUrl(
        userId,
        fileFormat,
        request.contentType,
      );
    const resume = await this.prismaService.resume.create({
      data: {
        userId,
        name: request.fileName,
        fileFormat,
        resumeType: request.resumeType,
        contentType: request.contentType,
        fileSize: request.fileSize,
        s3Key: key,
        status: "PENDING",
        uploadUrlExpiresAt,
      },
      select: { id: true },
    });

    return {
      resumeId: resume.id,
      uploadUrl,
      expiresIn,
    };
  }

  async findAllByUserId(userId: string) {
    const resumes = await this.prismaService.resume.findMany({
      where: {
        userId,
        status: "READY",
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        fileFormat: true,
        resumeType: true,
        createdAt: true,
      },
    });

    return resumes.map((resume) => ({
      ...resume,
      linkedApplications: [],
    }));
  }

  async completeUpload(userId: string, resumeId: string) {
    const resume = await this.prismaService.resume.findFirst({
      where: {
        id: resumeId,
        userId,
      },
      select: {
        id: true,
        status: true,
        s3Key: true,
        fileSize: true,
        contentType: true,
      },
    });

    if (!resume) {
      throw new NotFoundException("이력서를 찾을 수 없습니다.");
    }

    if (resume.status === "READY") {
      return {
        resumeId: resume.id,
        status: resume.status,
      };
    }

    const metadata = await this.resumeS3Service.getObjectMetadata(resume.s3Key);

    if (!metadata) {
      throw new ConflictException("S3 파일 업로드가 완료되지 않았습니다.");
    }

    if (
      metadata.contentLength !== resume.fileSize ||
      metadata.contentType !== resume.contentType
    ) {
      throw new BadRequestException("업로드된 파일 정보를 확인할 수 없습니다.");
    }

    const updatedResume = await this.prismaService.resume.update({
      where: { id: resume.id },
      data: { status: "READY" },
      select: {
        id: true,
        status: true,
      },
    });

    return {
      resumeId: updatedResume.id,
      status: updatedResume.status,
    };
  }

  async createPreviewUrl(userId: string, resumeId: string) {
    const resume = await this.prismaService.resume.findFirst({
      where: {
        id: resumeId,
        status: "READY",
        userId,
      },
      select: {
        contentType: true,
        fileFormat: true,
        s3Key: true,
      },
    });

    if (!resume) {
      throw new NotFoundException("미리보기할 이력서를 찾을 수 없습니다.");
    }

    if (resume.fileFormat !== "PDF") {
      throw new BadRequestException("PDF 파일만 미리볼 수 있습니다.");
    }

    return this.resumeS3Service.createPreviewUrl(
      resume.s3Key,
      resume.contentType,
    );
  }

  async deleteResume(userId: string, resumeId: string) {
    const resume = await this.prismaService.resume.findFirst({
      where: {
        id: resumeId,
        userId,
      },
      select: {
        id: true,
        s3Key: true,
      },
    });

    if (!resume) {
      throw new NotFoundException("삭제할 이력서를 찾을 수 없습니다.");
    }

    await this.resumeS3Service.deleteObject(resume.s3Key);
    await this.prismaService.resume.delete({
      where: { id: resume.id },
    });

    return { resumeId: resume.id };
  }

  private getFileFormat(request: TResumeUploadRequest): TResumeFileFormat {
    const lowerCaseFileName = request.fileName.toLowerCase();
    const fileFormat = lowerCaseFileName.endsWith(".pdf")
      ? "PDF"
      : lowerCaseFileName.endsWith(".docx")
        ? "DOCX"
        : undefined;

    if (
      !fileFormat ||
      RESUME_CONTENT_TYPES[fileFormat] !== request.contentType
    ) {
      throw new BadRequestException(
        "PDF 또는 DOCX 파일만 업로드할 수 있습니다.",
      );
    }

    return fileFormat;
  }

  private async removeExpiredPendingResumes(userId: string) {
    const expiredResumes = await this.prismaService.resume.findMany({
      where: {
        userId,
        status: "PENDING",
        uploadUrlExpiresAt: { lte: new Date() },
      },
      select: {
        id: true,
        s3Key: true,
      },
    });

    if (expiredResumes.length === 0) {
      return;
    }

    await Promise.all(
      expiredResumes.map(({ s3Key }) =>
        this.resumeS3Service.deleteObject(s3Key),
      ),
    );
    await this.prismaService.resume.deleteMany({
      where: {
        id: { in: expiredResumes.map(({ id }) => id) },
      },
    });
  }
}
