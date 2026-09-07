import { toast } from "@moah/ui/components/MHToaster";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteApplications,
  getApplicationList,
  updateApplication,
  updateApplicationAttachments,
} from "@/features/applications/api/application";
import type {
  IApplication,
  IApplicationAttachmentsUpdateResponse,
  IApplicationList,
  IDeleteApplicationsResponse,
  TApplicationStage,
} from "@/features/applications/model/application.type";

interface IApplicationStageUpdate {
  id: string;
  stage: TApplicationStage;
}

interface IApplicationStageUpdateContext {
  previousApplications: IApplicationList[] | undefined;
}

interface IApplicationAttachmentsUpdateInput {
  id: string;
  resumeIds: string[];
}

export const useApplications = () => {
  const queryClient = useQueryClient();
  const applicationsQuery = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const response = await getApplicationList();

      if (!response.success || !response.data) {
        throw new Error("지원 현황 목록을 불러오지 못했습니다.");
      }

      return response.data;
    },
    staleTime: Infinity,
  });

  const updateApplicationMutation = useMutation<
    IApplication,
    Error,
    IApplicationStageUpdate,
    IApplicationStageUpdateContext
  >({
    mutationFn: async ({ id, stage }: IApplicationStageUpdate) => {
      const response = await updateApplication(id, { stage });

      if (!response.success || !response.data) {
        throw new Error("지원 단계 수정에 실패했습니다.");
      }

      return response.data;
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["applications"], context?.previousApplications);
      toast.error("지원 단계를 수정하지 못했습니다. 다시 시도해 주세요.");
    },
    onMutate: async ({ id, stage }) => {
      await queryClient.cancelQueries({
        queryKey: ["applications"],
      });

      const previousApplications = queryClient.getQueryData<IApplicationList[]>(
        ["applications"],
      );

      queryClient.setQueryData<IApplicationList[]>(
        ["applications"],
        (applications) =>
          applications?.map((application) =>
            application.id === id ? { ...application, stage } : application,
          ),
      );

      return { previousApplications };
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: ["applications"],
      });
    },
  });

  const deleteApplicationsMutation = useMutation<
    IDeleteApplicationsResponse,
    Error,
    string[]
  >({
    mutationFn: async (applicationIds) => {
      const response = await deleteApplications(applicationIds);

      if (!response.success || !response.data) {
        throw new Error("지원 공고 삭제에 실패했습니다.");
      }

      return response.data;
    },
    onError: () => {
      toast.error("지원 공고를 삭제하지 못했습니다.");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["applications"],
      });
      toast.success("지원 공고를 삭제했어요.");
    },
  });

  const updateApplicationAttachmentsMutation = useMutation<
    IApplicationAttachmentsUpdateResponse,
    Error,
    IApplicationAttachmentsUpdateInput
  >({
    mutationFn: async ({ id, resumeIds }) => {
      const response = await updateApplicationAttachments(id, { resumeIds });

      if (!response.success || !response.data) {
        throw new Error("파일 연결에 실패했습니다.");
      }

      return response.data;
    },
    onError: () => {
      toast.error("첨부 파일 설정을 저장하지 못했습니다.");
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["applications"] }),
        queryClient.invalidateQueries({ queryKey: ["resumes"] }),
      ]);
      toast.success("첨부 파일 설정을 저장했어요.");
    },
  });

  return {
    applicationsQuery,
    deleteApplicationsMutation,
    updateApplicationAttachmentsMutation,
    updateApplicationMutation,
  };
};
