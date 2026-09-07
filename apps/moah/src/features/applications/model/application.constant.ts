import type {
  IApplicationStageDisplay,
  TApplicationStage,
  TJobPostingDeadlineType,
  TJobPostingPlatform,
} from "@/features/applications/model/application.type";

export const APPLICATION_STAGE_DISPLAY: Record<
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

export const DEADLINE_TYPE_LABEL: Record<TJobPostingDeadlineType, string> = {
  DATE: "날짜 지정",
  ROLLING: "상시 채용",
  UNTIL_FILLED: "채용 시 마감",
  UNKNOWN: "마감 정보 없음",
};

export const PLATFORM_LABEL: Record<TJobPostingPlatform, string> = {
  SARAMIN: "사람인",
  JOB_KOREA: "잡코리아",
  JOB_PLANET: "잡플래닛",
  ZIGHANG: "직행",
  ROCKET_PUNCH: "로켓펀치",
  WORK24: "고용24",
  WANTED: "원티드",
  OTHER: "채용 사이트",
};
