import type { JobPostingPlatform } from "../../generated/prisma/client";

const JOB_POSTING_PLATFORM_HOSTNAMES: ReadonlyArray<{
  hostname: string;
  platform: JobPostingPlatform;
}> = [
  { hostname: "saramin.co.kr", platform: "SARAMIN" },
  { hostname: "jobkorea.co.kr", platform: "JOB_KOREA" },
  { hostname: "jobplanet.co.kr", platform: "JOB_PLANET" },
  { hostname: "zighang.com", platform: "ZIGHANG" },
  { hostname: "rocketpunch.com", platform: "ROCKET_PUNCH" },
  { hostname: "work24.go.kr", platform: "WORK24" },
  { hostname: "wanted.co.kr", platform: "WANTED" },
];

export const getJobPostingPlatform = (url: string): JobPostingPlatform => {
  const hostname = new URL(url).hostname.toLowerCase();
  const platform = JOB_POSTING_PLATFORM_HOSTNAMES.find(
    (item) =>
      hostname === item.hostname || hostname.endsWith(`.${item.hostname}`),
  );

  return platform?.platform ?? "OTHER";
};
