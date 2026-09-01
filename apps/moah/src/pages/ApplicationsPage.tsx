import MHIcon from "@moah/ui/components/MHIcon";
import { toast } from "@moah/ui/components/MHToaster";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteApplications,
  getApplicationList,
  updateApplication,
} from "@/api/application";
import Applications from "@/components/applications/Applications";
import type {
  IApplication,
  IApplicationList,
  IDeleteApplicationsResponse,
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
  return (
    <>
      <meta content="noindex" name="robots" />
      <ApplicationsPageContent />
    </>
  );
};

const ApplicationsPageContent = () => {
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

  if (applicationsQuery.isPending) {
    return (
      <output
        aria-label="지원 현황 목록을 불러오는 중"
        className="flex min-h-82 items-center justify-center"
      >
        <MHIcon className="animate-spin text-primary" icon="loaderCircle" />
      </output>
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
      isDeleting={deleteApplicationsMutation.isPending}
      isStageUpdate={updateApplicationMutation.isPending}
      onDelete={async (applicationIds) => {
        await deleteApplicationsMutation.mutateAsync(applicationIds);
      }}
      onStageChange={(id, stage) =>
        updateApplicationMutation.mutate({ id, stage })
      }
    />
  );
};

export default ApplicationsPage;
