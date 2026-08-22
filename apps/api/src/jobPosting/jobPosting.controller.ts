import { Body, Controller, Post } from "@nestjs/common";
import type { JobPostingService } from "./jobPosting.service";

@Controller("job-postings")
export class JobPostingController {
  constructor(private readonly jobPostingService: JobPostingService) {}

  @Post("extract")
  async extract(@Body() body: unknown) {
    return this.jobPostingService.extract(body);
  }
}
