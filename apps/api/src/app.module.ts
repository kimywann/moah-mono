import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { JobPostingModule } from "./jobPosting/jobPosting.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    JobPostingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
