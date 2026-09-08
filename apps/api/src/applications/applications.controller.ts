import {
  applicationAttachmentsUpdateSchema,
  applicationListQuerySchema,
  applicationUpdateSchema,
} from "@moah/contracts/schema/application";
import { jobPostingFormSchema } from "@moah/contracts/schema/job-posting";
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { getJobPostingPlatform } from "../common/utils/utils";
import { ApplicationsService } from "./applications.service";

@Controller("applications")
export class ApplicationsController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(ApplicationsService)
    private readonly applicationsService: ApplicationsService,
  ) {}

  @Get()
  async findAll(
    @Query() query: unknown,
    @Headers("cookie") cookieHeader?: string,
  ) {
    const request = applicationListQuerySchema.safeParse(query);

    if (!request.success) {
      throw new BadRequestException("지원 목록 조회 조건을 확인해 주세요.");
    }

    const user = await this.authService.getCurrentUser(
      this.getSessionToken(cookieHeader),
    );

    return {
      success: true,
      data: await this.applicationsService.findAllByUserId(
        user.id,
        request.data,
      ),
    };
  }

  @Get(":id")
  async findOne(
    @Param("id") applicationId: string,
    @Headers("cookie") cookieHeader?: string,
  ) {
    const user = await this.authService.getCurrentUser(
      this.getSessionToken(cookieHeader),
    );

    return {
      success: true,
      data: await this.applicationsService.findOneByUserId(
        user.id,
        applicationId,
      ),
    };
  }

  @Post()
  async create(
    @Body() body: unknown,
    @Headers("cookie") cookieHeader?: string,
  ) {
    const request = jobPostingFormSchema.safeParse(body);

    if (!request.success) {
      throw new BadRequestException("등록할 지원 정보를 확인해 주세요.");
    }

    const user = await this.authService.getCurrentUser(
      this.getSessionToken(cookieHeader),
    );
    const application = await this.applicationsService.create(
      user.id,
      request.data,
      request.data.url ? getJobPostingPlatform(request.data.url) : "OTHER",
    );

    return {
      success: true,
      data: application,
    };
  }

  @Delete()
  async remove(
    @Body("ids") applicationIds: string[],
    @Headers("cookie") cookieHeader?: string,
  ) {
    if (
      !Array.isArray(applicationIds) ||
      applicationIds.length === 0 ||
      applicationIds.some((applicationId) => typeof applicationId !== "string")
    ) {
      throw new BadRequestException("삭제할 지원 정보를 확인해 주세요.");
    }

    const user = await this.authService.getCurrentUser(
      this.getSessionToken(cookieHeader),
    );
    const result = await this.applicationsService.removeMany(
      user.id,
      applicationIds,
    );

    return {
      success: true,
      data: result,
    };
  }

  @Patch(":id")
  async update(
    @Param("id") applicationId: string,
    @Body() body: unknown,
    @Headers("cookie") cookieHeader?: string,
  ) {
    const request = applicationUpdateSchema.safeParse(body);

    if (!request.success) {
      throw new BadRequestException("수정할 지원 정보를 확인해 주세요.");
    }

    const user = await this.authService.getCurrentUser(
      this.getSessionToken(cookieHeader),
    );
    const application = await this.applicationsService.update(
      user.id,
      applicationId,
      request.data,
    );

    return {
      success: true,
      data: application,
    };
  }

  @Put(":id/attachments")
  async updateAttachments(
    @Param("id") applicationId: string,
    @Body() body: unknown,
    @Headers("cookie") cookieHeader?: string,
  ) {
    const request = applicationAttachmentsUpdateSchema.safeParse(body);

    if (!request.success) {
      throw new BadRequestException("연결할 파일을 확인해 주세요.");
    }

    const user = await this.authService.getCurrentUser(
      this.getSessionToken(cookieHeader),
    );

    return {
      success: true,
      data: await this.applicationsService.updateAttachments(
        user.id,
        applicationId,
        request.data.resumeIds,
      ),
    };
  }

  private getSessionToken(cookieHeader?: string) {
    const sessionCookie = cookieHeader
      ?.split(";")
      .find((cookie) => cookie.trim().startsWith("session="));

    return sessionCookie?.trim().slice("session=".length);
  }
}
