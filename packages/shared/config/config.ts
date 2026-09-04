export type TEnv = "local" | "opt";

export const ENV: TEnv = import.meta.env.DEV ? "local" : "opt";

export const SERVER_LIST: Record<TEnv, string> = {
  local: "http://localhost:3001",
  opt: "https://api.moah.io.kr",
};

export const API_BASE_URL = SERVER_LIST[ENV];
