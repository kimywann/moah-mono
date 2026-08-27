import { z } from "zod";

export const jobPostingExtractionRequestSchema = z.object({
  url: z.url(),
});

export const jobPostingExtractionResponseSchema = z.object({
  companyName: z.string().nullable(),
  position: z.string().nullable(),
  career: z.string().nullable(),
  location: z.string().nullable(),
  deadline: z.iso.date().nullable(),
  hiringProcess: z.array(z.string()),
  techStacks: z.array(z.string()),
});

export const jobPostingFormSchema = jobPostingExtractionResponseSchema.extend({
  url: z.url(),
});

export type TJobPostingExtraction = z.infer<
  typeof jobPostingExtractionResponseSchema
>;
export type TJobPostingForm = z.infer<typeof jobPostingFormSchema>;
