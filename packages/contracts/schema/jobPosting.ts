import { z } from "zod";

export const jobPostingExtractionRequestSchema = z.object({
  content: z.string().trim().min(1).max(5000),
});

export const jobPostingExtractionSchema = z.object({
  companyName: z.string().nullable(),
  position: z.string().nullable(),
  career: z.string().nullable(),
  location: z.string().nullable(),
  deadline: z.iso.date().nullable(),
  hiringProcess: z.array(z.string()),
  techStacks: z.array(z.string()),
});

export const jobPostingFormSchema = jobPostingExtractionSchema.extend({
  url: z.union([z.url(), z.literal("")]),
});

export type TJobPostingExtraction = z.infer<typeof jobPostingExtractionSchema>;
export type TJobPostingForm = z.infer<typeof jobPostingFormSchema>;
