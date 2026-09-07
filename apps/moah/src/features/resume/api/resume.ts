import type { TResumeType } from "@moah/contracts/schema/resume";
import type { IApiResponse } from "@moah/shared/type/api";
import { apiFetcher } from "@moah/shared/utils/api-fetcher";
import type {
  IResume,
  IResumeCompleteResponse,
  IResumeUploadUrlResponse,
} from "@/features/resume/model/resume.type";

export const getResumeList = async (): Promise<IApiResponse<IResume[]>> => {
  return apiFetcher<IResume[]>("/resumes");
};

export const createResumeUploadUrl = async (
  file: File,
  resumeType: TResumeType,
): Promise<IApiResponse<IResumeUploadUrlResponse>> => {
  return apiFetcher<IResumeUploadUrlResponse>("/resumes/upload-url", {
    method: "POST",
    body: JSON.stringify({
      contentType: file.type,
      fileName: file.name,
      fileSize: file.size,
      resumeType,
    }),
  });
};

export const uploadResumeToS3 = async (uploadUrl: string, file: File) => {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error("S3 파일 업로드에 실패했습니다.");
  }
};

export const completeResumeUpload = async (
  resumeId: string,
): Promise<IApiResponse<IResumeCompleteResponse>> => {
  return apiFetcher<IResumeCompleteResponse>(`/resumes/${resumeId}/complete`, {
    method: "POST",
  });
};
