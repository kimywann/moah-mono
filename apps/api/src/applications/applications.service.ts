import type { TApplicationUpdate } from "@moah/contracts/schema/application";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

const APPLICATION_LIST_SELECT = {
  id: true,
  stage: true,
  url: true,
  platform: true,
  companyName: true,
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
