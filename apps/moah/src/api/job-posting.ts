import type { TJobPostingExtraction } from "@moah/contracts/schema/job-posting";
import type { IApiResponse } from "@moah/shared/type/api";
import { apiFetcher } from "@moah/shared/utils/api-fetcher";
import type { IJobPostingExtractionUsage } from "@/shared/type/job-posting";

export const extractJobPosting = async (
  url: string,
): Promise<IApiResponse<TJobPostingExtraction>> => {
  return apiFetcher<TJobPostingExtraction>("/job-postings/extract", {
    method: "POST",
    body: JSON.stringify({ url }),
  });
};

export const getJobPostingExtractionUsage = async (): Promise<
  IApiResponse<IJobPostingExtractionUsage>
> => {
  return apiFetcher<IJobPostingExtractionUsage>(
    "/job-postings/extractions/usage",
  );
};
