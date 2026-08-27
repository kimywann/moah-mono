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
      },
    });

    return applications;
  }
}
