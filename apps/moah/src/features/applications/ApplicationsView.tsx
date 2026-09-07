import MHButton from "@moah/ui/components/MHButton";
import MHIcon from "@moah/ui/components/MHIcon";
import MHModal from "@moah/ui/components/MHModal";
import MHPagination from "@moah/ui/components/MHPagination";
import type { SortingState } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useApplications } from "@/features/applications/hooks/useApplications";
import ApplicationAttachmentModal from "@/features/applications/ui/modal/ApplicationAttachmentModal";
import ApplicationDetailModal from "@/features/applications/ui/modal/ApplicationDetailModal";
import ApplicationRegisterModal from "@/features/applications/ui/modal/ApplicationRegisterModal";
import ApplicationStageBadge from "@/features/applications/ui/table/ApplicationStageBadge";
import ApplicationTable from "@/features/applications/ui/table/ApplicationTable";
import hero from "@/shared/assets/applications-hero.png";
import HeroBanner from "@/shared/components/layout/HeroBanner";

const APPLICATIONS_PAGE_SIZE = 10;

const ApplicationsView = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [attachmentApplicationId, setAttachmentApplicationId] = useState<
    string | null
  >(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sorting, setSorting] = useState<SortingState>([]);

  const {
    applicationsQuery,
    deleteApplicationsMutation,
    updateApplicationAttachmentsMutation,
    updateApplicationMutation,
  } = useApplications();
  const applications = applicationsQuery.data ?? [];
  const attachmentApplication = applications.find(
    ({ id }) => id === attachmentApplicationId,
  );

  const totalPages = Math.ceil(applications.length / APPLICATIONS_PAGE_SIZE);
  const startIndex = (currentPage - 1) * APPLICATIONS_PAGE_SIZE;
  const currentApplications = applications.slice(
    startIndex,
    startIndex + APPLICATIONS_PAGE_SIZE,
  );

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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

  const handleDeleteClick = async () => {
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
        await deleteApplicationsMutation.mutateAsync([...selectedIds]);
        setSelectedIds(new Set());
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

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <ApplicationStageBadge applications={applications} />
        <div className="flex shrink-0 gap-2">
          <MHButton
            onClick={() => setIsRegistrationModalOpen(true)}
            variant="secondary"
          >
            등록하기
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

      <div className="min-h-82">
        <ApplicationTable
          applications={currentApplications}
          isStageUpdate={updateApplicationMutation.isPending}
          onAttachmentClick={setAttachmentApplicationId}
          onDetailClick={setDetailId}
          onSelectAll={handleSelectAll}
          onSelectChange={handleSelectChange}
          onStageChange={(id, stage) =>
            updateApplicationMutation.mutate({ id, stage })
          }
          onSortingChange={setSorting}
          selectedIds={selectedIds}
          sorting={sorting}
        />
      </div>

      <div className="mt-6">
        <MHPagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
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
