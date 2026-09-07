import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { JobPostingController } from "./jobPosting.controller";
import { JobPostingService } from "./jobPosting.service";

@Module({
  imports: [AuthModule],
  controllers: [JobPostingController],
  providers: [JobPostingService],
})
export class JobPostingModule {}
