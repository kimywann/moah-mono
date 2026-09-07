import type { TApplicationUpdate } from "@moah/contracts/schema/application";
import { jobPostingURLSchema } from "@moah/contracts/schema/job-posting";
import {
  JOB_POSTING_DEADLINE_TYPES,
  JOB_POSTING_POSITIONS,
} from "@moah/shared/constants/job-posting";
import { z } from "zod";
import type {
  TApplicationStage,
  TJobPostingDeadlineType,
} from "@/features/applications/model/application.type";

const optionalYearsSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || /^\d+$/.test(value),
    "경력은 0 이상의 정수로 입력해 주세요.",
  );

export const applicationRegisterFormSchema = z.object({
  companyName: z.string().trim().min(1, "기업명을 입력해 주세요."),
  deadline: z.string(),
  deadlineType: z.enum(JOB_POSTING_DEADLINE_TYPES),
  hiringProcess: z.string(),
  location: z.string(),
  maxYears: optionalYearsSchema,
  minYears: optionalYearsSchema,
  position: z
    .union([z.enum(JOB_POSTING_POSITIONS), z.literal("")])
    .refine((value) => Boolean(value), "포지션을 선택해 주세요."),
  techStacks: z.string(),
  title: z.string(),
  url: z
    .string()
    .trim()
    .min(1, "채용 공고 URL을 입력해 주세요.")
    .pipe(jobPostingURLSchema),
});

export type TApplicationRegisterForm = z.infer<
  typeof applicationRegisterFormSchema
>;

export const INITIAL_APPLICATION_REGISTER_FORM: TApplicationRegisterForm = {
  companyName: "",
  deadline: "",
  deadlineType: "UNKNOWN",
  hiringProcess: "",
  location: "",
  maxYears: "",
  minYears: "",
  position: "",
  techStacks: "",
  title: "",
  url: "",
};

export interface IApplicationEditForm {
  companyName: string;
  deadline: string;
  deadlineType: TJobPostingDeadlineType;
  hiringProcess: string;
  location: string;
  maxYears: string;
  minYears: string;
  position: NonNullable<TApplicationUpdate["position"]> | "";
  stage: TApplicationStage;
  techStacks: string;
}
