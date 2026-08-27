ALTER TABLE "applications"
ADD COLUMN "url" TEXT,
ADD COLUMN "platform" "JobPostingPlatform" NOT NULL DEFAULT 'OTHER',
ADD COLUMN "companyName" TEXT,
ADD COLUMN "position" TEXT,
ADD COLUMN "minYears" INTEGER,
ADD COLUMN "maxYears" INTEGER,
ADD COLUMN "location" TEXT,
ADD COLUMN "deadline" DATE,
ADD COLUMN "deadlineType" "JobPostingDeadlineType" NOT NULL DEFAULT 'UNKNOWN',
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "applications" AS "application"
SET
  "url" = "jobPosting"."url",
  "platform" = "jobPosting"."platform",
  "companyName" = "jobPosting"."companyName",
  "position" = "jobPosting"."position",
  "minYears" = "jobPosting"."minYears",
  "maxYears" = "jobPosting"."maxYears",
  "location" = "jobPosting"."location",
  "deadline" = "jobPosting"."deadline",
  "deadlineType" = "jobPosting"."deadlineType"
FROM "job_postings" AS "jobPosting"
WHERE "application"."jobPostingId" = "jobPosting"."id";

ALTER TABLE "applications"
ALTER COLUMN "url" SET NOT NULL;

ALTER TABLE "applications"
DROP CONSTRAINT "applications_jobPostingId_fkey";

DROP INDEX IF EXISTS "applications_userId_jobPostingId_key";

ALTER TABLE "applications"
DROP COLUMN "jobPostingId";

CREATE UNIQUE INDEX "applications_userId_url_key"
ON "applications"("userId", "url");
