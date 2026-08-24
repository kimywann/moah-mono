import { jobPostingExtractionRequestSchema } from "@moah/contracts/schema/jobPosting";
import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import type { JobPostingService } from "./jobPosting.service";

@Controller("job-postings")
export class JobPostingController {
  constructor(private readonly jobPostingService: JobPostingService) {}

  @Post("extract")
  async extract(@Body() body: unknown) {
    const parsedRequest = jobPostingExtractionRequestSchema.safeParse(body);

    if (!parsedRequest.success) {
      throw new BadRequestException("채용 공고 원문을 확인해 주세요.");
    }

    if (parsedRequest.data.inputMethod !== "content") {
      throw new BadRequestException("현재 원문 입력만 지원합니다.");
    }

    return this.jobPostingService.extract(parsedRequest.data.content);
  }
}
