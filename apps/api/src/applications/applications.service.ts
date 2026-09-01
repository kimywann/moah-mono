import type { TApplicationUpdate } from "@moah/contracts/schema/application";
import type { TJobPostingForm } from "@moah/contracts/schema/job-posting";
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { type JobPostingPlatform, Prisma } from "../generated/prisma/client";
import { PrismaService } from "../prisma/prisma.service";

const APPLICATION_LIST_SELECT = {
  id: true,
  stage: true,
  url: true,
  platform: true,
  companyName: true,
  title: true,
  position: true,
  minYears: true,
  maxYears: true,
  location: true,
  deadline: true,
  deadlineType: true,
} as const;

const APPLICATION_SELECT = {
  ...APPLICATION_LIST_SELECT,
  hiringProcess: true,
  techStacks: true,
} as const;

@Injectable()
export class ApplicationsService {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService,
  ) {}

  async findAllByUserId(userId: string) {
    const applications = await this.prismaService.application.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: APPLICATION_LIST_SELECT,
    });

    return applications;
  }

  async findOneByUserId(userId: string, applicationId: string) {
    const application = await this.prismaService.application.findFirst({
      where: {
        id: applicationId,
        userId,
      },
      select: APPLICATION_SELECT,
    });

    if (!application) {
      throw new NotFoundException("지원 정보를 찾을 수 없습니다.");
    }

    return application;
  }

  async create(
    userId: string,
    applicationData: TJobPostingForm,
    platform: JobPostingPlatform,
  ) {
    const deadline = applicationData.deadline
      ? new Date(`${applicationData.deadline}T00:00:00.000Z`)
      : null;

    try {
      return await this.prismaService.application.create({
        data: {
          userId,
          stage: "READY",
          url: applicationData.url,
          platform,
          companyName: applicationData.companyName,
          title: applicationData.title,
          position: applicationData.position,
          minYears: applicationData.minYears,
          maxYears: applicationData.maxYears,
          location: applicationData.location,
          deadline,
          deadlineType: applicationData.deadlineType,
          hiringProcess: applicationData.hiringProcess,
          techStacks: applicationData.techStacks,
        },
        select: {
          id: true,
          stage: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("이미 지원 목록에 저장된 채용 공고입니다.");
      }

      throw error;
    }
  }

  async removeMany(userId: string, applicationIds: string[]) {
    const result = await this.prismaService.application.deleteMany({
      where: {
        id: { in: applicationIds },
        userId,
      },
    });

    return { deletedCount: result.count };
  }

  async update(
    userId: string,
    applicationId: string,
    updateData: TApplicationUpdate,
  ) {
    const application = await this.prismaService.application.findFirst({
      where: {
        id: applicationId,
        userId,
      },
      select: { id: true },
    });

    if (!application) {
      throw new NotFoundException("지원 정보를 찾을 수 없습니다.");
    }

    const { deadline, ...updateFields } = updateData;
    const data = {
      ...updateFields,
      ...(deadline === undefined
        ? {}
        : {
            deadline: deadline ? new Date(`${deadline}T00:00:00.000Z`) : null,
          }),
    };

    return this.prismaService.application.update({
      where: { id: applicationId },
      data,
      select: APPLICATION_SELECT,
    });
  }
}
