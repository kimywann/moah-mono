import { resumeUploadRequestSchema } from "@moah/contracts/schema/resume";
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Param,
  Post,
} from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { ResumeService } from "./resume.service";

@Controller("resumes")
export class ResumeController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
    @Inject(ResumeService)
    private readonly resumeService: ResumeService,
  ) {}

  @Get()
  async findAll(@Headers("cookie") cookieHeader?: string) {
    const user = await this.authService.getCurrentUser(
      this.getSessionToken(cookieHeader),
    );

    return {
      success: true,
      data: await this.resumeService.findAllByUserId(user.id),
    };
  }

  @Post("upload-url")
  async createUploadUrl(
    @Body() body: unknown,
    @Headers("cookie") cookieHeader?: string,
  ) {
    const request = resumeUploadRequestSchema.safeParse(body);

    if (!request.success) {
      throw new BadRequestException("업로드할 이력서 정보를 확인해 주세요.");
    }

    const user = await this.authService.getCurrentUser(
      this.getSessionToken(cookieHeader),
    );

    return {
      success: true,
      data: await this.resumeService.createUploadUrl(user.id, request.data),
    };
  }

  @Post(":resumeId/complete")
  async completeUpload(
    @Param("resumeId") resumeId: string,
    @Headers("cookie") cookieHeader?: string,
  ) {
    const user = await this.authService.getCurrentUser(
      this.getSessionToken(cookieHeader),
    );

    return {
      success: true,
      data: await this.resumeService.completeUpload(user.id, resumeId),
    };
  }

  private getSessionToken(cookieHeader?: string) {
    const sessionCookie = cookieHeader
      ?.split(";")
      .find((cookie) => cookie.trim().startsWith("session="));

    return sessionCookie?.trim().slice("session=".length);
  }
}
