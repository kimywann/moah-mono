import type {
  TApplicationListQuery,
  TApplicationUpdate,
} from "@moah/contracts/schema/application";
import type { TJobPostingForm } from "@moah/contracts/schema/job-posting";
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CORE_ACTIVITY_EVENT } from "../analytics/analytics.constants";
import { AnalyticsService } from "../analytics/analytics.service";
import { type JobPostingPlatform, Prisma } from "../generated/prisma/client";
import { PrismaService } from "../prisma/prisma.service";

const DEFAULT_PAGE_SIZE = 10;

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
  attachments: {
    orderBy: { createdAt: "asc" },
    select: {
      resume: {
        select: {
          id: true,
          name: true,
          resumeType: true,
        },
      },
    },
  },
} as const;

const APPLICATION_SELECT = {
  ...APPLICATION_LIST_SELECT,
  hiringProcess: true,
  techStacks: true,
} as const;

const toApplicationResponse = <
  TApplication extends {
    attachments: { resume: { id: string; name: string; resumeType: string } }[];
  },
>(
  application: TApplication,
) => {
  const { attachments, ...applicationData } = application;

  return {
    ...applicationData,
    attachments: attachments.map(({ resume }) => resume),
  };
};

@Injectable()
export class ApplicationsService {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService,
    @Inject(AnalyticsService)
    private readonly analyticsService: AnalyticsService,
  ) {}

  async findAllByUserId(userId: string, query: TApplicationListQuery) {
    const { page, sort, status } = query;
    const where: Prisma.ApplicationWhereInput = {
      userId,
      ...(status ? { stage: status } : {}),
    };
    const orderBy: Prisma.ApplicationOrderByWithRelationInput = sort
      ? {
          deadline: {
            sort: sort === "ASC" ? "asc" : "desc",
            nulls: "last",
          },
        }
      : { createdAt: "desc" };

    const [applications, totalCount, stageGroups] =
      await this.prismaService.$transaction([
        this.prismaService.application.findMany({
          where,
          orderBy,
          skip: (page - 1) * DEFAULT_PAGE_SIZE,
          take: DEFAULT_PAGE_SIZE,
          select: APPLICATION_LIST_SELECT,
        }),
        this.prismaService.application.count({ where }),
        this.prismaService.application.groupBy({
          by: "stage",
          where: { userId },
          orderBy: { stage: "asc" },
          _count: { _all: true },
        }),
      ]);

    const stageCounts = {
      READY: 0,
      APPLIED: 0,
      INTERVIEW: 0,
      PASSED: 0,
      REJECTED: 0,
    };

    for (const stageGroup of stageGroups) {
      const count = stageGroup._count;

      stageCounts[stageGroup.stage] =
        typeof count === "object" && count !== null ? (count._all ?? 0) : 0;
    }

    return {
      items: applications.map(toApplicationResponse),
      stageCounts,
      pagination: {
        page,
        pageSize: DEFAULT_PAGE_SIZE,
        totalCount,
        totalPages: Math.ceil(totalCount / DEFAULT_PAGE_SIZE),
      },
    };
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

    return toApplicationResponse(application);
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
      const application = await this.prismaService.application.create({
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

      this.analyticsService.trackCoreActivity({
        userId,
        eventName: CORE_ACTIVITY_EVENT.JOB_POSTING_SAVED,
        properties: { platform },
      });

      return application;
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
      select: { id: true, stage: true },
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

    const updatedApplication = await this.prismaService.application.update({
      where: { id: applicationId },
      data,
      select: APPLICATION_SELECT,
    });

    const isStageChanged =
      updateData.stage !== undefined && updateData.stage !== application.stage;
    const isRecordUpdated = Object.keys(updateData).some(
      (field) => field !== "stage",
    );

    if (isStageChanged) {
      this.analyticsService.trackCoreActivity({
        userId,
        eventName: CORE_ACTIVITY_EVENT.APPLICATION_STAGE_CHANGED,
        properties: {
          from_stage: application.stage,
          to_stage: updateData.stage ?? application.stage,
        },
      });
    }

    if (isRecordUpdated) {
      this.analyticsService.trackCoreActivity({
        userId,
        eventName: CORE_ACTIVITY_EVENT.APPLICATION_RECORD_UPDATED,
      });
    }

    return toApplicationResponse(updatedApplication);
  }

  async updateAttachments(
    userId: string,
    applicationId: string,
    resumeIds: string[],
  ) {
    const uniqueResumeIds = [...new Set(resumeIds)];
    const [application, resumeCount] = await Promise.all([
      this.prismaService.application.findFirst({
        where: {
          id: applicationId,
          userId,
        },
        select: { id: true },
      }),
      this.prismaService.resume.count({
        where: {
          id: { in: uniqueResumeIds },
          userId,
          status: "READY",
        },
      }),
    ]);

    if (!application) {
      throw new NotFoundException("지원 정보를 찾을 수 없습니다.");
    }

    if (resumeCount !== uniqueResumeIds.length) {
      throw new BadRequestException("연결할 파일을 확인해 주세요.");
    }

    await this.prismaService.$transaction(async (transaction) => {
      await transaction.applicationAttachment.deleteMany({
        where: { applicationId },
      });

      if (uniqueResumeIds.length === 0) {
        return;
      }

      await transaction.applicationAttachment.createMany({
        data: uniqueResumeIds.map((resumeId) => ({
          applicationId,
          resumeId,
        })),
      });
    });

    this.analyticsService.trackCoreActivity({
      userId,
      eventName: CORE_ACTIVITY_EVENT.APPLICATION_RECORD_UPDATED,
    });

    return { resumeIds: uniqueResumeIds };
  }
}
