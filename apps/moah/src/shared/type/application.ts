import type { APPLICATION_STAGES } from "@moah/shared/constants/application";
import type {
  JOB_POSTING_DEADLINE_TYPES,
  JOB_POSTING_PLATFORMS,
} from "@moah/shared/constants/job-posting";

export type TApplicationStage = (typeof APPLICATION_STAGES)[number];

export type TJobPostingPlatform = (typeof JOB_POSTING_PLATFORMS)[number];

export type TJobPostingDeadlineType =
  (typeof JOB_POSTING_DEADLINE_TYPES)[number];

export interface IApplicationList {
  deadline: string | null;
  deadlineType: TJobPostingDeadlineType;
  id: string;
  companyName: string | null;
  location: string | null;
  minYears: number | null;
  maxYears: number | null;
  platform: TJobPostingPlatform;
  position: string | null;
  stage: TApplicationStage;
  url: string;
}

export interface IApplication extends IApplicationList {
  hiringProcess: string[];
  techStacks: string[];
}
