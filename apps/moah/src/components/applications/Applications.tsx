import MHButton from "@moah/ui/components/MHButton";
import MHPagination from "@moah/ui/components/MHPagination";
import type { SortingState } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import ApplicationDetailModal from "@/components/applications/ApplicationDetailModal";
import ApplicationRegisterModal from "@/components/applications/ApplicationRegisterModal";
import ApplicationStageBadge from "@/components/applications/ApplicationStageBadge";
import ApplicationTable from "@/components/applications/ApplicationTable";
import HeroBanner from "@/components/layout/HeroBanner";
import hero from "@/shared/assets/applications-hero.png";
import type {
  IApplicationList,
  TApplicationStage,
} from "@/shared/type/application";

interface IApplicationsProps {
  applications: IApplicationList[];
  isStageUpdate: boolean;
  onStageChange: (id: string, stage: TApplicationStage) => void;
}

const APPLICATIONS_PAGE_SIZE = 10;

const Applications = (props: IApplicationsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    string | null
  >(null);
  const [selectedApplicationIds, setSelectedApplicationIds] = useState<
    Set<string>
  >(new Set());
  const [sorting, setSorting] = useState<SortingState>([]);
  const totalPages = Math.ceil(
    props.applications.length / APPLICATIONS_PAGE_SIZE,
  );
  const startIndex = (currentPage - 1) * APPLICATIONS_PAGE_SIZE;
  const currentApplications = props.applications.slice(
    startIndex,
    startIndex + APPLICATIONS_PAGE_SIZE,
  );

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSelectChange = (id: string, isSelected: boolean) => {
    setSelectedApplicationIds((previous) => {
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
    setSelectedApplicationIds((previous) => {
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
        <ApplicationStageBadge applications={props.applications} />
        <div className="flex shrink-0 gap-2">
          <MHButton
            onClick={() => setIsRegistrationModalOpen(true)}
            variant="secondary"
          >
            등록하기
          </MHButton>
          <MHButton variant="danger">삭제하기</MHButton>
        </div>
      </div>

      <div className="min-h-82">
        <ApplicationTable
          applications={currentApplications}
          isStageUpdate={props.isStageUpdate}
          onDetailClick={setSelectedApplicationId}
          onSelectAll={handleSelectAll}
          onSelectChange={handleSelectChange}
          onStageChange={props.onStageChange}
          onSortingChange={setSorting}
          selectedApplicationIds={selectedApplicationIds}
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

      {selectedApplicationId && (
        <ApplicationDetailModal
          applicationId={selectedApplicationId}
          onClose={() => setSelectedApplicationId(null)}
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

export default Applications;
