import type { IListSearchParams, TSortOrder } from "@moah/shared/type/url";
import MHButton from "@moah/ui/components/MHButton";
import MHIcon from "@moah/ui/components/MHIcon";
import MHModal from "@moah/ui/components/MHModal";
import MHPagination from "@moah/ui/components/MHPagination";
import type { OnChangeFn, SortingState } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useApplications } from "@/features/applications/hooks/useApplications";
import type { TApplicationStage } from "@/features/applications/model/application.type";
import ApplicationCardList from "@/features/applications/ui/card/ApplicationCardList";
import ApplicationAttachmentModal from "@/features/applications/ui/modal/ApplicationAttachmentModal";
import ApplicationDetailModal from "@/features/applications/ui/modal/ApplicationDetailModal";
import ApplicationRegisterModal from "@/features/applications/ui/modal/ApplicationRegisterModal";
import ApplicationStageBadge from "@/features/applications/ui/table/ApplicationStageBadge";
import ApplicationTable from "@/features/applications/ui/table/ApplicationTable";
import hero from "@/shared/assets/applications-hero.png";
import HeroBanner from "@/shared/components/layout/HeroBanner";

interface IApplicationsViewProps {
  listParams: IListSearchParams<TApplicationStage>;
  onListParamsChange: (
    params: Partial<IListSearchParams<TApplicationStage>>,
  ) => void;
}

const ApplicationsView = ({
  listParams,
  onListParamsChange,
}: IApplicationsViewProps) => {
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [attachmentApplicationId, setAttachmentApplicationId] = useState<
    string | null
  >(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const {
    applicationsQuery,
    deleteApplicationsMutation,
    updateApplicationAttachmentsMutation,
    updateApplicationMutation,
  } = useApplications(listParams);
  const applications = applicationsQuery.data?.items ?? [];
  const currentPage = applicationsQuery.data?.pagination.page ?? 1;
  const totalPages = applicationsQuery.data?.pagination.totalPages ?? 0;
  const sorting: SortingState = listParams.sort
    ? [
        {
          id: "deadline",
          desc: listParams.sort === "DESC",
        },
      ]
    : [];
  const attachmentApplication = applications.find(
    ({ id }) => id === attachmentApplicationId,
  );

  useEffect(() => {
    const lastPage = Math.max(totalPages, 1);

    if (currentPage > lastPage) {
      onListParamsChange({
        page: String(lastPage),
      });
    }
  }, [currentPage, onListParamsChange, totalPages]);

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const nextSorting =
      typeof updater === "function" ? updater(sorting) : updater;
    const [nextSort] = nextSorting;
    let sort: TSortOrder | undefined;

    if (nextSort?.id === "deadline") {
      sort = nextSort.desc ? "DESC" : "ASC";
    }

    onListParamsChange({
      page: "1",
      sort,
    });
  };

  const handleStageFilterChange = (status: TApplicationStage | undefined) => {
    onListParamsChange({
      page: "1",
      status,
    });
  };

  const handleSelectChange = (id: string, isSelected: boolean) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);

      if (isSelected) {
        next.add(id);
      } else {
        next.delete(id);
      }

      return next;
    });
  };

  const handleSelectAll = (ids: string[], isSelected: boolean) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);

      for (const id of ids) {
        if (isSelected) {
          next.add(id);
        } else {
          next.delete(id);
        }
      }

      return next;
    });
  };

  const handleDeleteClick = async (ids = [...selectedIds]) => {
    const result = await MHModal<"cancel" | "delete">({
      name: "지원 공고 삭제",
      title: "지원 공고를 삭제할까요?",
      description: "삭제한 정보는 되돌릴 수 없습니다.",
      width: "!w-[412px]",
      buttons: [
        {
          label: "삭제하기",
          value: "delete",
          variant: "danger",
        },
        {
          label: "돌아가기",
          value: "cancel",
          variant: "secondary",
        },
      ],
    });

    if (result === "delete") {
      try {
        await deleteApplicationsMutation.mutateAsync(ids);
        setSelectedIds((previous) => {
          const next = new Set(previous);

          for (const id of ids) {
            next.delete(id);
          }

          return next;
        });
      } catch {
        return;
      }
    }
  };

  const handleAttachmentSave = async (resumeIds: string[]) => {
    if (!attachmentApplicationId) {
      return;
    }

    try {
      await updateApplicationAttachmentsMutation.mutateAsync({
        id: attachmentApplicationId,
        resumeIds,
      });
      setAttachmentApplicationId(null);
    } catch {
      return;
    }
  };

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
    <section className="w-full">
      <div className="mb-6">
        <HeroBanner
          backgroundImage={hero}
          description="지원 현황과 전형 일정을 한눈에 관리해 보세요."
          title="지원 현황 목록"
        />
      </div>

      <div className="mb-4 flex desk:flex-row flex-col desk:items-center desk:justify-between gap-3">
        <div className="flex desk:hidden justify-end">
          <MHButton
            onClick={() => setIsRegistrationModalOpen(true)}
            size="small"
            variant="secondary"
          >
            + 등록하기
          </MHButton>
        </div>
        <div className="-mx-4 tab:-mx-6 desk:mx-0 overflow-x-auto desk:px-0 px-4 tab:px-6">
          <ApplicationStageBadge
            onStageChange={handleStageFilterChange}
            selectedStage={listParams.status}
            stageCounts={applicationsQuery.data.stageCounts}
          />
        </div>
        <div className="desk:flex hidden justify-end gap-2">
          <MHButton
            onClick={() => setIsRegistrationModalOpen(true)}
            variant="secondary"
          >
            + 등록하기
          </MHButton>
          <MHButton
            disabled={
              selectedIds.size === 0 || deleteApplicationsMutation.isPending
            }
            onClick={() => void handleDeleteClick()}
            variant="danger"
          >
            삭제하기
          </MHButton>
        </div>
      </div>

      <div className="desk:hidden min-h-82">
        <ApplicationCardList
          applications={applications}
          isDeleting={deleteApplicationsMutation.isPending}
          isStageUpdate={updateApplicationMutation.isPending}
          onAttachmentClick={setAttachmentApplicationId}
          onDelete={(id) => void handleDeleteClick([id])}
          onDetailClick={setDetailId}
          onStageChange={(id, stage) =>
            updateApplicationMutation.mutate({ id, stage })
          }
        />
      </div>

      <div className="desk:block hidden min-h-82">
        <ApplicationTable
          applications={applications}
          isStageUpdate={updateApplicationMutation.isPending}
          onAttachmentClick={setAttachmentApplicationId}
          onDetailClick={setDetailId}
          onSelectAll={handleSelectAll}
          onSelectChange={handleSelectChange}
          onStageChange={(id, stage) =>
            updateApplicationMutation.mutate({ id, stage })
          }
          onSortingChange={handleSortingChange}
          selectedIds={selectedIds}
          sorting={sorting}
        />
      </div>

      <div className="mt-6">
        <MHPagination
          currentPage={currentPage}
          onPageChange={(page) => onListParamsChange({ page: String(page) })}
          totalPages={totalPages}
        />
      </div>

      {detailId && (
        <ApplicationDetailModal
          applicationId={detailId}
          onClose={() => setDetailId(null)}
        />
      )}

      {attachmentApplication && (
        <ApplicationAttachmentModal
          application={attachmentApplication}
          isSaving={updateApplicationAttachmentsMutation.isPending}
          onClose={() => setAttachmentApplicationId(null)}
          onSave={(resumeIds) => void handleAttachmentSave(resumeIds)}
        />
      )}

      {isRegistrationModalOpen && (
        <ApplicationRegisterModal
          onClose={() => setIsRegistrationModalOpen(false)}
        />
      )}
    </section>
  );
};

export default ApplicationsView;
