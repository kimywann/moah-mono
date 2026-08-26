import { jobPostingExtractionRequestSchema } from "@moah/contracts/schema/job-posting";
import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
} from "@nestjs/common";
import { JobPostingService } from "./jobPosting.service";

@Controller("job-postings")
export class JobPostingController {
  constructor(
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
}
