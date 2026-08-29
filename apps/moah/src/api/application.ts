import type { TApplicationUpdate } from "@moah/contracts/schema/application";
import type { IApiResponse } from "@moah/shared/type/api";
import { apiFetcher } from "@moah/shared/utils/api-fetcher";
import type { IApplication, IApplicationList } from "@/shared/type/application";

export const getApplicationList = async (): Promise<
  IApiResponse<IApplicationList[]>
> => {
  return apiFetcher<IApplicationList[]>("/applications");
};

export const updateApplication = async (
  id: string,
  updateData: TApplicationUpdate,
): Promise<IApiResponse<IApplication>> => {
  return apiFetcher<IApplication>(`/applications/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updateData),
  });
};
