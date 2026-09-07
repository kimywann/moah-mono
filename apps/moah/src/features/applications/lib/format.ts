import dayjs from "dayjs";
import type {
  IApplicationCareer,
  IApplicationDeadline,
} from "../model/application.type";

export const getCareerLabel = ({
  minYears,
  maxYears,
}: IApplicationCareer): string => {
  if (minYears === null && maxYears === null) {
    return "경력 조건 미정";
  }

  if (minYears === 0 && maxYears === 0) {
    return "신입";
  }

  if (minYears === 0 && maxYears === null) {
    return "경력 무관";
  }

  if (maxYears === null) {
    return `경력 ${minYears}년 이상`;
  }

  return minYears === maxYears
    ? `경력 ${minYears}년`
    : `경력 ${minYears}~${maxYears}년`;
};

export const getDeadlineLabel = ({
  deadline,
  deadlineType,
}: IApplicationDeadline): string => {
  if (deadlineType === "ROLLING") {
    return "상시 채용";
  }

  if (deadlineType === "UNTIL_FILLED") {
    return "채용 시 마감";
  }

  if (deadlineType === "UNKNOWN") {
    return "마감 정보 없음";
  }

  return deadline ? dayjs(deadline).format("YYYY-MM-DD") : "마감 정보 없음";
};
