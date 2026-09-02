import type {
  TJobPostingDeadlineType,
  TJobPostingPosition,
} from "@moah/contracts/schema/job-posting";
import type { TApplicationStage, TJobPostingPlatform } from "./application";

export interface IJobPostingList {
  id: string;
  url: string;
  platform: TJobPostingPlatform;
  companyName: string | null;
  title: string | null;
  position: TJobPostingPosition | null;
  minYears: number | null;
  maxYears: number | null;
  location: string | null;
  deadline: string | null;
  deadlineType: TJobPostingDeadlineType;
}

export interface ISaveJobPostingResponse {
  id: string;
  jobPostingId: string;
  stage: TApplicationStage;
}

export interface IJobPostingExtractionUsage {
  limit: number;
  remainingCount: number;
}
