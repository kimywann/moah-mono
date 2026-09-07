import type { TResumeFileFormat } from "@moah/contracts/schema/resume";

export interface ILinkedApplication {
  id: string;
  companyName: string | null;
  title: string | null;
}

export interface IResume {
  id: string;
  name: string;
  fileFormat: TResumeFileFormat;
  linkedApplications: ILinkedApplication[];
  createdAt: string;
}
