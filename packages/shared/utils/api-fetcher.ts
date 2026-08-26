import { API_BASE_URL } from "../config/config";
import type { IApiResponse } from "../type/api";
import { createQueryString } from "./url";

export interface IFetchOptions extends RequestInit {
  searchParams?: Record<string, string | number | undefined>;
}

export const apiFetcher = async <T = undefined>(
  url: string,
  options?: IFetchOptions,
): Promise<IApiResponse<T>> => {
  const { searchParams, ...restOptions } = options || {};
  const queryString = searchParams ? createQueryString(searchParams) : "";
  const fullUrl = `${API_BASE_URL}${url}${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(fullUrl, {
    ...restOptions,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  return await response.json();
};
