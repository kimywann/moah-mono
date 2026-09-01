import type { TApplicationStage } from "@/shared/type/application";

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

export const STAGE_DISPLAY: Record<
  TApplicationStage,
  IApplicationStageDisplay
> = {
  READY: {
    label: "지원 준비 중",
    variant: "neutral",
  },
  APPLIED: {
    label: "지원 완료",
    variant: "info",
  },
  INTERVIEW: {
    label: "면접",
    variant: "warning",
  },
  PASSED: {
    label: "합격",
    variant: "success",
  },
  REJECTED: {
    label: "불합격",
    variant: "danger",
  },
};
