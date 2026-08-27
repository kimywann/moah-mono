export type TApplicationStage =
  | "READY"
  | "APPLIED"
  | "INTERVIEW"
  | "PASSED"
  | "REJECTED";

export type TJobPostingPlatform =
  | "SARAMIN"
  | "JOB_KOREA"
  | "JOB_PLANET"
  | "ZIGHANG"
  | "ROCKET_PUNCH"
  | "WORK24"
  | "WANTED"
  | "OTHER";

export type TJobPostingDeadlineType =
  | "DATE"
  | "ROLLING"
  | "UNTIL_FILLED"
  | "UNKNOWN";

export interface IApplication {
  deadline: string | null;
  deadlineType: TJobPostingDeadlineType;
  id: string;
  jobPostingId: string;
  companyName: string | null;
  location: string | null;
  minYears: number | null;
  maxYears: number | null;
  platform: TJobPostingPlatform;
  position: string | null;
  stage: TApplicationStage;
  url: string;
}
