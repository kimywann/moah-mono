import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ApplicationsService {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService,
  ) {}

  async findAllByUserId(userId: string) {
    const applications = await this.prismaService.application.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        jobPostingId: true,
        stage: true,
        jobPosting: {
          select: {
            companyName: true,
            position: true,
            career: true,
            location: true,
            deadline: true,
            deadlineType: true,
            platform: true,
            url: true,
          },
        },
      },
    });

    return applications.map(({ jobPosting, ...application }) => ({
      ...application,
      ...jobPosting,
    }));
  }
}
