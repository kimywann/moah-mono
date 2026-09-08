export const CORE_ACTIVITY_EVENT = {
  // 채용 공고 추출 성공
  JOB_POSTING_EXTRACTED: "Job Posting Extracted",
  // 채용 공고 저장 성공
  JOB_POSTING_SAVED: "Job Posting Saved",
  // 지원 단계 변경 성공
  APPLICATION_STAGE_CHANGED: "Application Stage Changed",
  // 지원 기록 수정 성공
  APPLICATION_RECORD_UPDATED: "Application Record Updated",
  // 이력서 업로드 완료
  RESUME_UPLOADED: "Resume Uploaded",
} as const;

export type TCoreActivityEvent =
  (typeof CORE_ACTIVITY_EVENT)[keyof typeof CORE_ACTIVITY_EVENT];
