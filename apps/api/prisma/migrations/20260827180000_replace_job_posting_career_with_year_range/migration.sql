ALTER TABLE "job_postings"
ADD COLUMN "minYears" INTEGER,
ADD COLUMN "maxYears" INTEGER;

ALTER TABLE "job_postings"
DROP COLUMN "career";
