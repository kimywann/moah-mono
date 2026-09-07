import type {
  TResumeFileFormat,
  TResumeType,
} from "@moah/contracts/schema/resume";

export interface ILinkedApplication {
  id: string;
  companyName: string | null;
  title: string | null;
}

export interface IResume {
  id: string;
  name: string;
  fileFormat: TResumeFileFormat;
  resumeType: TResumeType;
  linkedApplications: ILinkedApplication[];
  createdAt: string;
}

export interface IResumeUploadUrlResponse {
  resumeId: string;
  uploadUrl: string;
  expiresIn: number;
}

export interface IResumeCompleteResponse {
  resumeId: string;
  status: "READY";
}

export interface IResumePreviewUrlResponse {
  previewUrl: string;
  expiresIn: number;
}

export interface IResumeDeleteResponse {
  resumeId: string;
}
