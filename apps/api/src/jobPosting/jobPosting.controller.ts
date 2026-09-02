import {
  jobPostingExtractionRequestSchema,
  jobPostingFormSchema,
} from "@moah/contracts/schema/job-posting";
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  ServiceUnavailableException,
} from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { JobPostingService } from "./jobPosting.service";

@Controller("job-postings")
export class JobPostingController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(JobPostingService)
    private readonly jobPostingService: JobPostingService,
  ) {}

  @Post("extract")
  async extract(
    @Body() body: unknown,
    @Headers("cookie") cookieHeader?: string,
  ) {
    const parsedRequest = jobPostingExtractionRequestSchema.safeParse(body);

    if (!parsedRequest.success) {
      throw new BadRequestException("채용 공고 URL을 확인해 주세요.");
    }

    const user = await this.authService.getCurrentUser(
      this.getSessionToken(cookieHeader),
    );

    try {
      return {
        success: true,
        data: await this.jobPostingService.extract(
          user.id,
          parsedRequest.data.url,
        ),
      };
    } catch (error) {
      if (error instanceof ServiceUnavailableException) {
        return {
          success: false,
          error: {
            code: "GEMINI_QUOTA_EXHAUSTED",
            message: "오늘 AI 분석 요청 한도를 모두 사용했습니다.",
          },
        };
      }

      if (
        error instanceof HttpException &&
        error.getStatus() === HttpStatus.TOO_MANY_REQUESTS
      ) {
        return {
          success: false,
          error: {
            code: "DAILY_EXTRACTION_LIMIT_EXCEEDED",
            message: "오늘 URL 분석 5회를 모두 사용했어요.",
          },
        };
      }

      throw error;
    }
  }

  @Post()
  async save(@Body() body: unknown, @Headers("cookie") cookieHeader?: string) {
    const request = jobPostingFormSchema.safeParse(body);

    if (!request.success) {
      throw new BadRequestException("저장할 채용 공고 정보를 확인해 주세요.");
    }

    const user = await this.authService.getCurrentUser(
      this.getSessionToken(cookieHeader),
    );
    const application = await this.jobPostingService.save(
      user.id,
      request.data,
    );

    return {
      success: true,
      data: application,
    };
  }

  @Get("extractions/usage")
  async getExtractionUsage(@Headers("cookie") cookieHeader?: string) {
    const user = await this.authService.getCurrentUser(
      this.getSessionToken(cookieHeader),
    );

    return {
      success: true,
      data: await this.jobPostingService.getExtractionUsage(user.id),
    };
  }

  @Get()
  async findAll() {
    return {
      success: true,
      data: await this.jobPostingService.findAll(),
    };
  }

  private getSessionToken(cookieHeader?: string) {
    const sessionCookie = cookieHeader
      ?.split(";")
      .find((cookie) => cookie.trim().startsWith("session="));

    return sessionCookie?.trim().slice("session=".length);
  }
}
