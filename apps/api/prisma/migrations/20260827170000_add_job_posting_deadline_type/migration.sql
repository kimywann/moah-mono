CREATE TYPE "JobPostingDeadlineType" AS ENUM (
  'DATE',
  'ROLLING',
  'UNTIL_FILLED',
  'UNKNOWN'
);

ALTER TABLE "job_postings"
ADD COLUMN "deadlineType" "JobPostingDeadlineType" NOT NULL DEFAULT 'UNKNOWN';
