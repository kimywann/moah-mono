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
  Inject,
  Post,
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
  async extract(@Body() body: unknown) {
    const parsedRequest = jobPostingExtractionRequestSchema.safeParse(body);

    if (!parsedRequest.success) {
      throw new BadRequestException("채용 공고 URL을 확인해 주세요.");
    }

    return this.jobPostingService.extract(parsedRequest.data.url);
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
