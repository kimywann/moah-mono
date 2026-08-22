import { Injectable, NotImplementedException } from "@nestjs/common";

@Injectable()
export class JobPostingService {
  async extract(_body: unknown): Promise<never> {
    throw new NotImplementedException("채용 공고 추출 기능을 준비 중입니다.");
  }
}
