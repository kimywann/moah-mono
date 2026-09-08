import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ResumeController } from "./resume.controller";
import { ResumeS3Service } from "./resume.s3.service";
import { ResumeService } from "./resume.service";

@Module({
  imports: [AuthModule],
  controllers: [ResumeController],
  providers: [ResumeService, ResumeS3Service],
})
export class ResumeModule {}
