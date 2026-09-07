import type { TResumeType } from "@moah/contracts/schema/resume";
import { formatDateTime } from "@moah/shared/utils/format";
import MHBadge from "@moah/ui/components/MHBadge";
import MHIcon from "@moah/ui/components/MHIcon";
import MHTable from "@moah/ui/components/MHTable";
import MHTooltip from "@moah/ui/components/MHTooltip";
import type {
  ColumnDef,
  OnChangeFn,
  SortingState,
} from "@tanstack/react-table";
import { RESUME_TYPE_LABEL } from "@/features/resume/model/resume.constant";
import type { IResume } from "@/features/resume/model/resume.type";

interface IResumeTableProps {
  isDeleting: boolean;
  onDeleteClick: (resume: IResume) => void;
  onPreviewClick: (resume: IResume) => void;
  onSortingChange: OnChangeFn<SortingState>;
  resumes: IResume[];
  sorting: SortingState;
}

const createResumeColumns = (
  isDeleting: boolean,
  onDeleteClick: (resume: IResume) => void,
  onPreviewClick: (resume: IResume) => void,
): ColumnDef<IResume>[] => [
  {
    accessorKey: "name",
    enableSorting: false,
    header: "파일명",
    size: 300,
    cell: ({ row }) => (
      <button
        className="flex min-w-0 cursor-pointer items-center gap-3 rounded-tiny text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
        onClick={() => onPreviewClick(row.original)}
        type="button"
      >
        <MHIcon className="text-muted-foreground" icon="fileText" size={20} />
        <span className="regular block truncate">{row.original.name}</span>
      </button>
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
          [companyName, title].filter(Boolean).join(" | ") || "공고 정보 없음",
      );
      const [firstLinkedApplicationLabel] = linkedApplicationLabels;
      const additionalLinkedApplicationCount =
        linkedApplicationLabels.length - 1;
      const linkedApplicationTooltip = linkedApplicationLabels.join("\n");
      const linkedApplicationContent = (
        <div
          className={
            linkedApplications.length > 0
              ? "flex min-w-0 items-center gap-1"
              : "regular text-muted-foreground"
          }
        >
          {firstLinkedApplicationLabel ? (
            <span className="regular min-w-0 truncate">
              {firstLinkedApplicationLabel}
            </span>
          ) : (
            "연결된 공고 없음"
          )}
          {additionalLinkedApplicationCount > 0 && (
            <span className="regular shrink-0 text-muted-foreground">
              +{additionalLinkedApplicationCount}
            </span>
          )}
        </div>
      );

      return linkedApplicationTooltip ? (
        <MHTooltip content={linkedApplicationTooltip}>
          {linkedApplicationContent}
        </MHTooltip>
      ) : (
        linkedApplicationContent
      );
    },
  },
  {
    id: "actions",
    enableSorting: false,
    header: "",
    size: 64,
    cell: ({ row }) => (
      <button
        aria-label={`${row.original.name} 삭제`}
        className="flex size-8 cursor-pointer items-center justify-center rounded-small text-danger hover:bg-tintRed disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isDeleting}
        onClick={() => onDeleteClick(row.original)}
        type="button"
      >
        <MHIcon icon="trash2" size={18} />
      </button>
    ),
  },
];

const ResumeTable = ({
  isDeleting,
  onDeleteClick,
  onPreviewClick,
  onSortingChange,
  resumes,
  sorting,
}: IResumeTableProps) => {
  return (
    <MHTable
      caption="이력서 목록"
      columns={createResumeColumns(isDeleting, onDeleteClick, onPreviewClick)}
      data={resumes}
      emptyMessage="등록된 이력서가 없어요. 첫 이력서를 업로드해 보세요!"
      getRowId={(resume) => resume.id}
      onSortingChange={onSortingChange}
      sorting={sorting}
    />
  );
};

export default ResumeTable;
