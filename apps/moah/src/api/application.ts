import type { IApiResponse } from "@moah/shared/type/api";
import { apiFetcher } from "@moah/shared/utils/api-fetcher";
import type { IApplicationList } from "@/shared/type/application";

export const getApplicationList = async (): Promise<
  IApiResponse<IApplicationList[]>
> => {
  return apiFetcher<IApplicationList[]>("/applications");
};
