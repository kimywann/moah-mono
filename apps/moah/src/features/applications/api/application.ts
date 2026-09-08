import type {
  TApplicationAttachmentsUpdate,
  TApplicationUpdate,
} from "@moah/contracts/schema/application";
import type { TJobPostingForm } from "@moah/contracts/schema/job-posting";
import type { IApiResponse } from "@moah/shared/type/api";
import type { IListSearchParams } from "@moah/shared/type/url";
import { apiFetcher } from "@moah/shared/utils/api-fetcher";
import type {
  IApplication,
  IApplicationAttachmentsUpdateResponse,
  IApplicationListResponse,
  ICreateApplicationResponse,
  IDeleteApplicationsResponse,
  TApplicationStage,
} from "@/features/applications/model/application.type";

export const getApplicationList = async (
  params: IListSearchParams<TApplicationStage> = {},
): Promise<IApiResponse<IApplicationListResponse>> => {
  return apiFetcher<IApplicationListResponse>("/applications", {
    searchParams: {
      keyword: params.keyword,
      page: params.page,
      sort: params.sort,
      status: params.status,
    },
  });
};

export const getApplication = async (
  applicationId: string,
): Promise<IApiResponse<IApplication>> => {
  return apiFetcher<IApplication>(`/applications/${applicationId}`);
};

export const createApplication = async (
  applicationData: TJobPostingForm,
): Promise<IApiResponse<ICreateApplicationResponse>> => {
  return apiFetcher<ICreateApplicationResponse>("/applications", {
    method: "POST",
    body: JSON.stringify(applicationData),
  });
};

export const deleteApplications = async (
  applicationIds: string[],
): Promise<IApiResponse<IDeleteApplicationsResponse>> => {
  return apiFetcher<IDeleteApplicationsResponse>("/applications", {
    method: "DELETE",
    body: JSON.stringify({ ids: applicationIds }),
  });
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

export const updateApplicationAttachments = async (
  id: string,
  updateData: TApplicationAttachmentsUpdate,
): Promise<IApiResponse<IApplicationAttachmentsUpdateResponse>> => {
  return apiFetcher<IApplicationAttachmentsUpdateResponse>(
    `/applications/${id}/attachments`,
    {
      method: "PUT",
      body: JSON.stringify(updateData),
    },
  );
};
