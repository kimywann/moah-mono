import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ApplicationsModule } from "./applications/applications.module";
import { AuthModule } from "./auth/auth.module";
import { HealthModule } from "./health/health.module";
import { JobPostingModule } from "./jobPosting/jobPosting.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ApplicationsModule,
    AuthModule,
    JobPostingModule,
    HealthModule,
  ],
})
export class AppModule {}
