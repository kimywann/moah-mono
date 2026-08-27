-- CreateEnum
CREATE TYPE "ApplicationStage" AS ENUM ('READY', 'APPLIED', 'INTERVIEW', 'PASSED', 'REJECTED');

-- CreateEnum
CREATE TYPE "JobPostingPlatform" AS ENUM ('SARAMIN', 'JOB_KOREA', 'JOB_PLANET', 'ZIGHANG', 'ROCKET_PUNCH', 'WORK24', 'OTHER');

-- CreateTable
CREATE TABLE "job_postings" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "platform" "JobPostingPlatform" NOT NULL DEFAULT 'OTHER',
    "companyName" TEXT,
    "position" TEXT,
    "career" TEXT,
    "location" TEXT,
    "deadline" DATE,
    "hiringProcess" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "techStacks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "extractedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_postings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobPostingId" TEXT NOT NULL,
    "stage" "ApplicationStage" NOT NULL DEFAULT 'READY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "job_postings_url_key" ON "job_postings"("url");

-- CreateIndex
CREATE UNIQUE INDEX "applications_userId_jobPostingId_key" ON "applications"("userId", "jobPostingId");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_jobPostingId_fkey" FOREIGN KEY ("jobPostingId") REFERENCES "job_postings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
