export type TEnv = "local";

export const SERVER_LIST: Record<TEnv, string> = {
  local: "http://localhost:3001",
};

export const ENV: TEnv = "local";

export const API_BASE_URL = SERVER_LIST[ENV];
