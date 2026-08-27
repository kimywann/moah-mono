ALTER TABLE "applications"
ADD COLUMN "hiringProcess" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "techStacks" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

UPDATE "applications" AS "application"
SET
  "hiringProcess" = "jobPosting"."hiringProcess",
  "techStacks" = "jobPosting"."techStacks"
FROM "job_postings" AS "jobPosting"
WHERE "application"."jobPostingId" = "jobPosting"."id";

ALTER TABLE "job_postings"
DROP COLUMN "hiringProcess",
DROP COLUMN "techStacks";
