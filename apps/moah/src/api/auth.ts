import type { IApiResponse } from "@moah/shared/type/api";
import { apiFetcher } from "@moah/shared/utils/api-fetcher";
import type { User } from "@/shared/type/user";

export const loginWithGoogle = async (
  credential: string,
): Promise<IApiResponse<User>> => {
  return apiFetcher<User>("/auth/google", {
    method: "POST",
    body: JSON.stringify({
      credential,
    }),
  });
};

export const getCurrentMe = async (): Promise<IApiResponse<User>> => {
  return apiFetcher<User>("/auth/me");
};

export const logout = async (): Promise<IApiResponse<void>> => {
  return apiFetcher("/auth/logout", {
    method: "POST",
  });
};
