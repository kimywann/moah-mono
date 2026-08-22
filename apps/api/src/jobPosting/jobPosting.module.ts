import { Module } from "@nestjs/common";
import { JobPostingController } from "./jobPosting.controller";
import { JobPostingService } from "./jobPosting.service";

@Module({
  controllers: [JobPostingController],
  providers: [JobPostingService],
})
export class JobPostingModule {}
