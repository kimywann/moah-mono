import type { TJobPostingForm } from "@moah/contracts/schema/job-posting";
import type { IApiResponse } from "@moah/shared/type/api";
import { apiFetcher } from "@moah/shared/utils/api-fetcher";
import type {
  IJobPostingList,
  ISaveJobPostingResponse,
} from "@/shared/type/job-posting";

export const saveJobPosting = async (
  extractPost: TJobPostingForm,
): Promise<IApiResponse<ISaveJobPostingResponse>> => {
  return apiFetcher<ISaveJobPostingResponse>("/job-postings", {
    method: "POST",
    body: JSON.stringify(extractPost),
  });
};

export const getJobPostingList = async (): Promise<
  IApiResponse<IJobPostingList[]>
> => {
  return apiFetcher<IJobPostingList[]>("/job-postings");
};
