import { applicationUpdateSchema } from "@moah/contracts/schema/application";
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
} from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { ApplicationsService } from "./applications.service";

@Controller("applications")
export class ApplicationsController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(ApplicationsService)
    private readonly applicationsService: ApplicationsService,
  ) {}

  @Get()
  async findAll(@Headers("cookie") cookieHeader?: string) {
    const user = await this.authService.getCurrentUser(
      this.getSessionToken(cookieHeader),
    );

    return {
      success: true,
      data: await this.applicationsService.findAllByUserId(user.id),
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

  private getSessionToken(cookieHeader?: string) {
    const sessionCookie = cookieHeader
      ?.split(";")
      .find((cookie) => cookie.trim().startsWith("session="));

    return sessionCookie?.trim().slice("session=".length);
  }
}
