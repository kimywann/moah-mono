import type { IApiResponse } from "@moah/shared/type/api";
import { apiFetcher } from "@moah/shared/utils/api-fetcher";
import type { IApplication } from "@/shared/type/application";

export const getApplicationList = async (): Promise<
  IApiResponse<IApplication[]>
> => {
  return apiFetcher<IApplication[]>("/applications");
};
