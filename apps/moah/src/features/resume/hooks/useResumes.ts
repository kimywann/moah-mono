import type { TResumeType } from "@moah/contracts/schema/resume";
import { toast } from "@moah/ui/components/MHToaster";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  completeResumeUpload,
  createResumeUploadUrl,
  deleteResume,
  getResumeList,
  uploadResumeToS3,
} from "@/features/resume/api/resume";
import type { IResumeDeleteResponse } from "@/features/resume/model/resume.type";

interface IResumeUploadInput {
  file: File;
  resumeType: TResumeType;
}

export const useResumes = () => {
  const queryClient = useQueryClient();
  const resumesQuery = useQuery({
    queryKey: ["resumes"],
    queryFn: async () => {
      const response = await getResumeList();

      if (!response.success || !response.data) {
        throw new Error("이력서 목록을 불러오지 못했습니다.");
      }

      return response.data;
    },
    staleTime: Infinity,
  });

  const uploadResumeMutation = useMutation({
    mutationFn: async ({ file, resumeType }: IResumeUploadInput) => {
      const uploadUrlResponse = await createResumeUploadUrl(file, resumeType);

      if (!uploadUrlResponse.success || !uploadUrlResponse.data) {
        throw new Error("이력서 업로드 URL을 발급받지 못했습니다.");
      }

      await uploadResumeToS3(uploadUrlResponse.data.uploadUrl, file);

      const completeResponse = await completeResumeUpload(
        uploadUrlResponse.data.resumeId,
      );

      if (!completeResponse.success || !completeResponse.data) {
        throw new Error("이력서 업로드 완료 처리에 실패했습니다.");
      }
    },
    onError: () => {
      toast.error("이력서를 업로드하지 못했습니다.");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast.success("이력서를 업로드했어요.");
    },
  });

  const deleteResumeMutation = useMutation<
    IResumeDeleteResponse,
    Error,
    string
  >({
    mutationFn: async (resumeId) => {
      const response = await deleteResume(resumeId);

      if (!response.success || !response.data) {
        throw new Error("이력서 삭제에 실패했습니다.");
      }

      return response.data;
    },
    onError: () => {
      toast.error("이력서를 삭제하지 못했습니다.");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast.success("이력서를 삭제했어요.");
    },
  });

  return {
    deleteResumeMutation,
    resumesQuery,
    uploadResumeMutation,
  };
};
