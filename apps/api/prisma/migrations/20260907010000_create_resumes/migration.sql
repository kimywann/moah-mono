-- CreateEnum
CREATE TYPE "ResumeFileFormat" AS ENUM ('PDF', 'DOCX');

-- CreateEnum
CREATE TYPE "ResumeStatus" AS ENUM ('PENDING', 'READY');

-- CreateTable
CREATE TABLE "resumes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fileFormat" "ResumeFileFormat" NOT NULL,
    "contentType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "s3Key" TEXT NOT NULL,
    "status" "ResumeStatus" NOT NULL DEFAULT 'PENDING',
    "uploadUrlExpiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "resumes_s3Key_key" ON "resumes"("s3Key");

-- CreateIndex
CREATE INDEX "resumes_userId_status_idx" ON "resumes"("userId", "status");

-- CreateIndex
CREATE INDEX "resumes_userId_createdAt_idx" ON "resumes"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
