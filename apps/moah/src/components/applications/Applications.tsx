import MHPagination from "@moah/ui/components/MHPagination";
import type { SortingState } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import ApplicationDetailModal from "@/components/applications/ApplicationDetailModal";
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
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    string | null
  >(null);
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

  return (
    <section className="w-full">
      <div className="mb-6">
        <HeroBanner
          backgroundImage={hero}
          description="지원 현황과 전형 일정을 한눈에 관리해 보세요."
          title="지원 현황 목록"
        />
      </div>

      <div className="mb-3 flex justify-end">
        <p className="medium display14 text-muted-foreground">
          총 {props.applications.length}건
        </p>
      </div>

      <div className="min-h-82">
        <ApplicationTable
          applications={currentApplications}
          isStageUpdate={props.isStageUpdate}
          onDetailClick={setSelectedApplicationId}
          onStageChange={props.onStageChange}
          onSortingChange={setSorting}
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
    </section>
  );
};

export default Applications;
