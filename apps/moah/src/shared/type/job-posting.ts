import type { TApplicationStage } from "./application";

export interface ISaveJobPostingResponse {
  id: string;
  jobPostingId: string;
  stage: TApplicationStage;
}
