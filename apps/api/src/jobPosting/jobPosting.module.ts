import { Module } from "@nestjs/common";
import { ApplicationsModule } from "../applications/applications.module";
import { AuthModule } from "../auth/auth.module";
import { JobPostingController } from "./jobPosting.controller";
import { JobPostingService } from "./jobPosting.service";

@Module({
  imports: [ApplicationsModule, AuthModule],
  controllers: [JobPostingController],
  providers: [JobPostingService],
})
export class JobPostingModule {}
