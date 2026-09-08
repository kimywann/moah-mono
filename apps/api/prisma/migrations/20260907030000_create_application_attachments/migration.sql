-- CreateTable
CREATE TABLE "application_attachments" (
    "applicationId" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_attachments_pkey" PRIMARY KEY ("applicationId", "resumeId")
);

-- CreateIndex
CREATE INDEX "application_attachments_resumeId_idx" ON "application_attachments"("resumeId");

-- AddForeignKey
ALTER TABLE "application_attachments" ADD CONSTRAINT "application_attachments_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_attachments" ADD CONSTRAINT "application_attachments_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
