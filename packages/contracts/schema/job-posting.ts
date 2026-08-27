import { z } from "zod";

interface IRestrictedJobPostingPlatform {
  hostname: string;
  label: string;
}

const RESTRICTED_JOB_POSTING_PLATFORMS: IRestrictedJobPostingPlatform[] = [
  {
    hostname: "wanted.co.kr",
    label: "원티드",
  },
];

export const JOB_POSTING_POSITIONS = [
  "프론트엔드",
  "백엔드",
  "풀스택",
  "모바일",
  "데이터",
  "AI",
  "DevOps",
  "QA",
  "보안",
  "게임",
  "임베디드",
  "영업",
  "디자인",
  "마케팅",
  "PM/PO",
  "기획",
  "기타",
] as const;

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
  career: z.string().nullable(),
  location: z.string().nullable(),
  deadline: z.iso.date().nullable(),
});

export const jobPostingFormSchema = jobPostingExtractionResponseSchema.extend({
  url: jobPostingURLSchema,
});

export type TJobPostingExtraction = z.infer<
  typeof jobPostingExtractionResponseSchema
>;
export type TJobPostingForm = z.infer<typeof jobPostingFormSchema>;
export type TJobPostingPosition = (typeof JOB_POSTING_POSITIONS)[number];
