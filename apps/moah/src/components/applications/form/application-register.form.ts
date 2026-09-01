import type { TJobPostingDeadlineType } from "@moah/contracts/schema/job-posting";
import {
  jobPostingFormSchema,
  type TJobPostingForm,
} from "@moah/contracts/schema/job-posting";
import type { TApplicationRegisterForm } from "@/components/applications/form/application-register.schema";

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

export const DEADLINE_TYPE_LABEL: Record<TJobPostingDeadlineType, string> = {
  DATE: "날짜 지정",
  ROLLING: "상시 채용",
  UNTIL_FILLED: "채용 시 마감",
  UNKNOWN: "마감 정보 없음",
};

const splitValues = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const toNullableNumber = (value: string) =>
  value.trim() ? Number(value) : null;

export const toJobPostingForm = (
  form: TApplicationRegisterForm,
): TJobPostingForm =>
  jobPostingFormSchema.parse({
    companyName: form.companyName.trim() || null,
    deadline: form.deadline || null,
    deadlineType: form.deadlineType,
    hiringProcess: splitValues(form.hiringProcess),
    location: form.location.trim() || null,
    maxYears: toNullableNumber(form.maxYears),
    minYears: toNullableNumber(form.minYears),
    position: form.position || null,
    techStacks: splitValues(form.techStacks),
    title: form.title.trim() || null,
    url: form.url.trim(),
  });
