import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { JobPostingModule } from "./jobPosting/jobPosting.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), JobPostingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
