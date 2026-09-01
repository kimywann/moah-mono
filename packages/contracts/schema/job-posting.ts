import {
  JOB_POSTING_DEADLINE_TYPES,
  JOB_POSTING_POSITIONS,
} from "@moah/shared/constants/job-posting";
import { z } from "zod";

interface IRestrictedJobPostingPlatform {
  hostname: string;
  label: string;
}

const RESTRICTED_JOB_POSTING_PLATFORMS: IRestrictedJobPostingPlatform[] = [
  {
    hostname: "saramin.co.kr",
    label: "사람인",
  },
  {
    hostname: "jobkorea.co.kr",
    label: "잡코리아",
  },
  {
    hostname: "jobplanet.co.kr",
    label: "잡플래닛",
  },
  {
    hostname: "zighang.com",
    label: "직행",
  },
  {
    hostname: "rocketpunch.com",
    label: "로켓펀치",
  },
  {
    hostname: "work24.go.kr",
    label: "고용24",
  },
  {
    hostname: "wanted.co.kr",
    label: "원티드",
  },
];

const URL_PROTOCOL_PATTERN = /^[a-zA-Z][a-zA-Z\d+.-]*:\/\//;

const normalizeJobPostingURL = (url: string) => {
  const trimmedURL = url.trim();

  return URL_PROTOCOL_PATTERN.test(trimmedURL)
    ? trimmedURL
    : `https://${trimmedURL}`;
};

const findRestrictedJobPostingPlatform = (url: string) => {
  const hostname = new URL(url).hostname.toLowerCase();

  return RESTRICTED_JOB_POSTING_PLATFORMS.find(
    (platform) =>
      hostname === platform.hostname ||
      hostname.endsWith(`.${platform.hostname}`),
  );
};

export const jobPostingURLSchema = z
  .string()
  .trim()
  .transform(normalizeJobPostingURL)
  .pipe(z.url())
  .superRefine((url, context) => {
    const restrictedPlatform = findRestrictedJobPostingPlatform(url);

    if (restrictedPlatform) {
      context.addIssue({
        code: "custom",
        message: `${restrictedPlatform.label} 공고는 자동 추출을 지원하지 않습니다.`,
      });
    }
  });

export const jobPostingExtractionRequestSchema = z.object({
  url: jobPostingURLSchema,
});

export const jobPostingExtractionResponseSchema = z.object({
  companyName: z.string().nullable(),
  title: z.string().nullable(),
  position: z.enum(JOB_POSTING_POSITIONS).nullable(),
  minYears: z.number().int().min(0).nullable(),
  maxYears: z.number().int().min(0).nullable(),
  location: z.string().nullable(),
  deadline: z.iso.date().nullable(),
  deadlineType: z.enum(JOB_POSTING_DEADLINE_TYPES),
  hiringProcess: z.array(z.string().trim()),
  techStacks: z.array(z.string().trim()),
});

export const jobPostingFormSchema = jobPostingExtractionResponseSchema.extend({
  url: jobPostingURLSchema,
});

export type TJobPostingExtraction = z.infer<
  typeof jobPostingExtractionResponseSchema
>;
export type TJobPostingForm = z.infer<typeof jobPostingFormSchema>;
export type TJobPostingPosition = (typeof JOB_POSTING_POSITIONS)[number];
export type TJobPostingDeadlineType =
  (typeof JOB_POSTING_DEADLINE_TYPES)[number];
