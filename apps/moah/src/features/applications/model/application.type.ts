import type { TResumeType } from "@moah/contracts/schema/resume";
import type { APPLICATION_STAGES } from "@moah/shared/constants/application";
import type {
  JOB_POSTING_DEADLINE_TYPES,
  JOB_POSTING_PLATFORMS,
} from "@moah/shared/constants/job-posting";

export type TApplicationStage = (typeof APPLICATION_STAGES)[number];

export type TJobPostingPlatform = (typeof JOB_POSTING_PLATFORMS)[number];

export type TJobPostingDeadlineType =
  (typeof JOB_POSTING_DEADLINE_TYPES)[number];

export interface IApplicationAttachment {
  id: string;
  name: string;
  resumeType: TResumeType;
}

export interface IApplicationList {
  attachments: IApplicationAttachment[];
  deadline: string | null;
  deadlineType: TJobPostingDeadlineType;
  id: string;
  companyName: string | null;
  title: string | null;
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

export interface ICreateApplicationResponse {
  id: string;
  stage: TApplicationStage;
}

export interface IDeleteApplicationsResponse {
  deletedCount: number;
}

export interface IApplicationAttachmentsUpdateResponse {
  resumeIds: string[];
}

export interface IApplicationCareer {
  minYears: number | null;
  maxYears: number | null;
}

export interface IApplicationDeadline {
  deadline: string | null;
  deadlineType: TJobPostingDeadlineType;
}

export type TApplicationStageBadgeVariant =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

export interface IApplicationStageDisplay {
  label: string;
  variant: TApplicationStageBadgeVariant;
}
