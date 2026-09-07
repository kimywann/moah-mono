import type { TApplicationUpdate } from "@moah/contracts/schema/application";
import {
  jobPostingFormSchema,
  type TJobPostingForm,
} from "@moah/contracts/schema/job-posting";
import type {
  IApplicationEditForm,
  TApplicationRegisterForm,
} from "@/features/applications/model/application.form";
import type { IApplication } from "@/features/applications/model/application.type";

const splitCommaSeparatedValues = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const toCreateApplicationPayload = (
  form: TApplicationRegisterForm,
): TJobPostingForm =>
  jobPostingFormSchema.parse({
    companyName: form.companyName.trim() || null,
    deadline: form.deadline || null,
    deadlineType: form.deadlineType,
    hiringProcess: splitCommaSeparatedValues(form.hiringProcess),
    location: form.location.trim() || null,
    maxYears: form.maxYears.trim() ? Number(form.maxYears) : null,
    minYears: form.minYears.trim() ? Number(form.minYears) : null,
    position: form.position || null,
    techStacks: splitCommaSeparatedValues(form.techStacks),
    title: form.title.trim() || null,
    url: form.url.trim(),
  });

export const toApplicationEditForm = (
  application: IApplication,
): IApplicationEditForm => ({
  companyName: application.companyName ?? "",
  deadline: application.deadline?.slice(0, 10) ?? "",
  deadlineType: application.deadlineType,
  hiringProcess: application.hiringProcess.join(", "),
  location: application.location ?? "",
  maxYears: application.maxYears?.toString() ?? "",
  minYears: application.minYears?.toString() ?? "",
  position: (application.position as IApplicationEditForm["position"]) ?? "",
  stage: application.stage,
  techStacks: application.techStacks.join(", "),
});

export const toUpdateApplicationPayload = (
  form: IApplicationEditForm,
): TApplicationUpdate => ({
  companyName: form.companyName.trim() || null,
  deadline: form.deadlineType === "DATE" ? form.deadline || null : null,
  deadlineType: form.deadlineType,
  hiringProcess: splitCommaSeparatedValues(form.hiringProcess),
  location: form.location.trim() || null,
  maxYears: form.maxYears.trim() ? Number(form.maxYears) : null,
  minYears: form.minYears.trim() ? Number(form.minYears) : null,
  position: form.position || null,
  stage: form.stage,
  techStacks: splitCommaSeparatedValues(form.techStacks),
});
