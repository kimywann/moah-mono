import { APPLICATION_STAGES } from "@moah/shared/constants/application";
import {
  JOB_POSTING_DEADLINE_TYPES,
  JOB_POSTING_POSITIONS,
} from "@moah/shared/constants/job-posting";
import { z } from "zod";

export const applicationUpdateSchema = z
  .object({
    stage: z.enum(APPLICATION_STAGES).optional(),
    companyName: z.string().trim().nullable().optional(),
    position: z.enum(JOB_POSTING_POSITIONS).nullable().optional(),
    minYears: z.number().int().min(0).nullable().optional(),
    maxYears: z.number().int().min(0).nullable().optional(),
    location: z.string().trim().nullable().optional(),
    deadline: z.iso.date().nullable().optional(),
    deadlineType: z.enum(JOB_POSTING_DEADLINE_TYPES).optional(),
    hiringProcess: z.array(z.string().trim()).optional(),
    techStacks: z.array(z.string().trim()).optional(),
  })
  .strict()
  .refine((application) => Object.keys(application).length > 0, {
    message: "수정할 항목을 하나 이상 입력해 주세요.",
  });

export type TApplicationUpdate = z.infer<typeof applicationUpdateSchema>;
