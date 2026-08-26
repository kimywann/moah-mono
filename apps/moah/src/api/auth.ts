import { apiFetcher } from "@moah/shared/utils/api-fetcher";
import type { User } from "@/shared/type/user";

export const loginWithGoogle = async (credential: string): Promise<User> => {
  return apiFetcher<User>("/auth/google", {
    method: "POST",
    body: JSON.stringify({
      credential,
    }),
  });
};

export const getCurrentMe = async (): Promise<User> => {
  return apiFetcher<User>("/auth/me");
};
