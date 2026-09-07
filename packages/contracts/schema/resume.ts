import { z } from "zod";

export const RESUME_FILE_FORMATS = ["PDF", "DOCX"] as const;

export const resumeFileFormat = z.enum(RESUME_FILE_FORMATS);

export const linkedApplicationSchema = z.object({
  id: z.uuid(),
  companyName: z.string().nullable(),
  title: z.string().nullable(),
});

export const resumeSchema = z.object({
  id: z.uuid(),
  name: z.string().trim().min(1),
  fileFormat: resumeFileFormat,
  linkedApplications: z.array(linkedApplicationSchema),
  createdAt: z.iso.datetime(),
});

export const resumeUploadMetadataSchema = z.object({
  applicationIds: z.array(z.uuid()).default([]),
});

export type TResumeFileFormat = z.infer<typeof resumeFileFormat>;
export type TLinkedApplication = z.infer<typeof linkedApplicationSchema>;
export type TResume = z.infer<typeof resumeSchema>;
export type TResumeUploadMetadata = z.infer<typeof resumeUploadMetadataSchema>;
