CREATE TABLE "job_posting_extractions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_posting_extractions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "job_posting_extractions_userId_createdAt_idx"
ON "job_posting_extractions"("userId", "createdAt");

ALTER TABLE "job_posting_extractions"
ADD CONSTRAINT "job_posting_extractions_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
