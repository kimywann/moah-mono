import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AnalyticsModule } from "./analytics/analytics.module";
import { ApplicationsModule } from "./applications/applications.module";
import { AuthModule } from "./auth/auth.module";
import { HealthModule } from "./health/health.module";
import { JobPostingModule } from "./jobPosting/jobPosting.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ResumeModule } from "./resume/resume.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AnalyticsModule,
    PrismaModule,
    ApplicationsModule,
    AuthModule,
    JobPostingModule,
    HealthModule,
    ResumeModule,
  ],
})
export class AppModule {}
