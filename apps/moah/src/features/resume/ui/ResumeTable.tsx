import type { TResumeType } from "@moah/contracts/schema/resume";
import { formatDateTime } from "@moah/shared/utils/format";
import MHBadge from "@moah/ui/components/MHBadge";
import MHIcon from "@moah/ui/components/MHIcon";
import MHTable from "@moah/ui/components/MHTable";
import type {
  ColumnDef,
  OnChangeFn,
  SortingState,
} from "@tanstack/react-table";
import { RESUME_TYPE_LABEL } from "@/features/resume/model/resume.constant";
import type { IResume } from "@/features/resume/model/resume.type";

interface IResumeTableProps {
  onSelectAll: (ids: string[], isSelected: boolean) => void;
  onSelectChange: (id: string, isSelected: boolean) => void;
  onSortingChange: OnChangeFn<SortingState>;
  resumes: IResume[];
  selectedIds: Set<string>;
  sorting: SortingState;
}

const RESUME_COLUMNS: ColumnDef<IResume>[] = [
  {
    accessorKey: "name",
    enableSorting: false,
    header: "파일명",
    size: 300,
    cell: ({ getValue }) => (
      <div className="flex min-w-0 items-center gap-3">
        <MHIcon className="text-muted-foreground" icon="fileText" size={20} />
        <span className="regular block truncate">{getValue<string>()}</span>
      </div>
    ),
  },
  {
    accessorKey: "fileFormat",
    enableSorting: false,
    header: "파일 형식",
    size: 120,
    cell: ({ getValue }) => {
      return (
        <span className="regular text-muted-foreground">
          {getValue<string>()}
        </span>
      );
    },
  },
  {
    accessorKey: "resumeType",
    enableSorting: false,
    header: "파일 형식",
    size: 120,
    cell: ({ getValue }) => {
      const resumeType = getValue<TResumeType>();

      return (
        <MHBadge className="regular" size="md">
          {RESUME_TYPE_LABEL[resumeType]}
        </MHBadge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    enableSorting: false,
    header: "업로드 날짜",
    size: 160,
    cell: ({ getValue }) => (
      <span className="regular text-muted-foreground">
        {formatDateTime(getValue<string>())}
      </span>
    ),
  },
  {
    accessorKey: "linkedApplications",
    enableSorting: false,
    header: "연결된 지원 공고",
    size: 320,
    cell: ({ getValue }) => {
      const linkedApplications =
        getValue<IResume["linkedApplications"]>() ?? [];
      const linkedApplicationLabels = linkedApplications.map(
        ({ companyName, title }) =>
          [companyName, title].filter(Boolean).join(" · ") || "공고 정보 없음",
      );
      const linkedApplicationLabel = linkedApplicationLabels.join(", ");

      return (
        <span
          className={
            linkedApplications.length > 0
              ? "regular block truncate"
              : "regular text-muted-foreground"
          }
        >
          {linkedApplicationLabel || "연결된 공고 없음"}
        </span>
      );
    },
  },
];

const ResumeTable = ({
  onSelectAll,
  onSelectChange,
  onSortingChange,
  resumes,
  selectedIds,
  sorting,
}: IResumeTableProps) => {
  return (
    <MHTable
      caption="이력서 목록"
      columns={RESUME_COLUMNS}
      data={resumes}
      emptyMessage="등록된 이력서가 없어요. 첫 이력서를 업로드해 보세요!"
      getRowId={(resume) => resume.id}
      onSortingChange={onSortingChange}
      rowSelection={{
        onRowSelectionChange: onSelectChange,
        onSelectAllChange: onSelectAll,
        selectedRowIds: selectedIds,
      }}
      sorting={sorting}
    />
  );
};

export default ResumeTable;
