import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApplicationList, updateApplication } from "@/api/application";
import Applications from "@/components/applications/Applications";
import type {
  IApplication,
  IApplicationList,
  TApplicationStage,
} from "@/shared/type/application";

interface IApplicationStageUpdate {
  id: string;
  stage: TApplicationStage;
}

interface IApplicationStageUpdateContext {
  previousApplications: IApplicationList[] | undefined;
}

const ApplicationsPage = () => {
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
      window.alert("지원 단계를 수정하지 못했습니다. 다시 시도해 주세요.");
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

  if (applicationsQuery.isPending) {
    return (
      <p className="p-6 text-muted-foreground">
        지원 현황 목록을 불러오는 중...
      </p>
    );
  }

  if (applicationsQuery.isError) {
    return (
      <p className="p-6 text-danger" role="alert">
        지원 현황 목록을 불러오지 못했습니다.
      </p>
    );
  }

  return (
    <Applications
      applications={applicationsQuery.data}
      isStageUpdate={updateApplicationMutation.isPending}
      onStageChange={(id, stage) =>
        updateApplicationMutation.mutate({ id, stage })
      }
    />
  );
};

export default ApplicationsPage;
