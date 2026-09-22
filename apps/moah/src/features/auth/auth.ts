import type { IApiResponse } from "@moah/shared/type/api";
import { apiFetcher } from "@moah/shared/utils/api-fetcher";
import type { User } from "@/shared/type/user";

export const getCurrentMe = async (): Promise<IApiResponse<User>> => {
  return apiFetcher<User>("/auth/me");
};

export const logout = async (): Promise<IApiResponse<void>> => {
  return apiFetcher("/auth/logout", {
    method: "POST",
  });
};

export const withdraw = async (): Promise<IApiResponse<void>> => {
  return apiFetcher("/auth/me", {
    method: "DELETE",
  });
};
