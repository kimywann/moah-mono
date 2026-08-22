import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobPostingModule } from './jobPosting/jobPosting.module';

@Module({
  imports: [JobPostingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
