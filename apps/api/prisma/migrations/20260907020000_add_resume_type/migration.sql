-- CreateEnum
CREATE TYPE "ResumeType" AS ENUM ('PORTFOLIO', 'RESUME', 'OTHER');

-- AlterTable
ALTER TABLE "resumes" ADD COLUMN "resumeType" "ResumeType" NOT NULL DEFAULT 'OTHER';
