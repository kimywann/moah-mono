import { APPLICATION_STAGES } from "@moah/shared/constants/application";
import MHBadge from "@moah/ui/components/MHBadge";
import MHButton from "@moah/ui/components/MHButton";
import type { IMHDropdownOption } from "@moah/ui/components/MHDropdown";
import MHDropdown from "@moah/ui/components/MHDropdown";
import MHIcon from "@moah/ui/components/MHIcon";
import MHTable from "@moah/ui/components/MHTable";
import MHTooltip from "@moah/ui/components/MHTooltip";
import type {
  ColumnDef,
  OnChangeFn,
  SortingState,
} from "@tanstack/react-table";
import {
  getCareerLabel,
  getDeadlineLabel,
} from "@/features/applications/lib/format";
import { APPLICATION_STAGE_DISPLAY } from "@/features/applications/model/application.constant";
import type {
  IApplicationList,
  TApplicationStage,
} from "@/features/applications/model/application.type";

interface IApplicationTableProps {
  applications: IApplicationList[];
  onAttachmentClick: (id: string) => void;
  isStageUpdate: boolean;
  onDetailClick: (id: string) => void;
  onSelectAll: (ids: string[], isSelected: boolean) => void;
  onSelectChange: (id: string, isSelected: boolean) => void;
  onStageChange: (id: string, stage: TApplicationStage) => void;
  selectedIds: Set<string>;
  onSortingChange: OnChangeFn<SortingState>;
  sorting: SortingState;
}

const APPLICATION_STAGE_OPTIONS: IMHDropdownOption<TApplicationStage>[] =
  APPLICATION_STAGES.map((stage) => ({
    label: APPLICATION_STAGE_DISPLAY[stage].label,
    value: stage,
  }));

interface IApplicationStageDropdownProps {
  isUpdate: boolean;
  onChange: (stage: TApplicationStage) => void;
  stage: TApplicationStage;
}

const ApplicationStageDropdown = ({
  isUpdate,
  onChange,
  stage,
}: IApplicationStageDropdownProps) => {
  const stageDisplay = APPLICATION_STAGE_DISPLAY[stage];

  return (
    <MHDropdown
      onChange={onChange}
      options={APPLICATION_STAGE_OPTIONS}
      trigger={(isOpen) => (
        <button
          aria-label="지원 단계 변경"
          className="cursor-pointer rounded-tiny focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isUpdate}
          type="button"
        >
          <MHBadge
            className="regular"
            icon={
              <MHIcon
                className={isOpen ? "rotate-180" : ""}
                icon="chevronDown"
                size={14}
              />
            }
            size="md"
            variant={stageDisplay.variant}
          >
            {stageDisplay.label}
          </MHBadge>
        </button>
      )}
      value={stage}
    />
  );
};

const createColumns = (
  isStageUpdate: boolean,
  onAttachmentClick: (id: string) => void,
  onDetailClick: (id: string) => void,
  onStageChange: (id: string, stage: TApplicationStage) => void,
): ColumnDef<IApplicationList>[] => [
  {
    accessorKey: "companyName",
    enableSorting: false,
    header: "기업",
    size: 80,
    cell: ({ getValue }) => (
      <span className="regular">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "position",
    enableSorting: false,
    header: "포지션",
    size: 100,
    cell: ({ getValue }) => (
      <span className="regular">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "minYears",
    enableSorting: false,
    header: "경력",
    size: 120,
    cell: ({ row }) => getCareerLabel(row.original),
  },
  {
    accessorKey: "title",
    enableSorting: false,
    header: "공고명",
    size: 260,
    cell: ({ getValue }) => (
      <span className="regular block truncate">
        {getValue<string | null>() ?? "제목 미정"}
      </span>
    ),
  },
  {
    accessorKey: "stage",
    enableSorting: false,
    header: "지원 단계",
    size: 128,
    cell: ({ getValue, row }) => (
      <ApplicationStageDropdown
        isUpdate={isStageUpdate}
        onChange={(stage) => onStageChange(row.original.id, stage)}
        stage={getValue<TApplicationStage>()}
      />
    ),
  },
  {
    accessorKey: "deadline",
    enableSorting: true,
    header: "마감일",
    size: 120,
    cell: ({ row }) => getDeadlineLabel(row.original),
  },
  {
    accessorKey: "attachments",
    enableSorting: false,
    header: "첨부 파일",
    size: 280,
    cell: ({ row }) => {
      const [firstAttachment] = row.original.attachments;
      const additionalAttachmentCount = row.original.attachments.length - 1;
      const attachmentTooltip = row.original.attachments
        .map(({ name }) => name)
        .join("\n");

      return (
        <div className="inline-flex max-w-full items-center gap-2">
          {firstAttachment ? (
            <span
              className="regular max-w-[180px] truncate"
              title={firstAttachment.name}
            >
              {firstAttachment.name}
            </span>
          ) : (
            <span className="regular text-muted-foreground">
              첨부된 파일 없음
            </span>
          )}
          {firstAttachment && additionalAttachmentCount > 0 && (
            <MHTooltip content={attachmentTooltip}>
              <span className="regular shrink-0 text-muted-foreground">
                +{additionalAttachmentCount}
              </span>
            </MHTooltip>
          )}
          <MHButton
            className="medium! size-8 shrink-0 p-0"
            onClick={() => onAttachmentClick(row.original.id)}
            size="xSmall"
            variant="secondary"
          >
            <MHIcon icon="upload" size={16} />
            <span className="sr-only">
              {firstAttachment ? "첨부 파일 편집" : "파일 첨부"}
            </span>
          </MHButton>
        </div>
      );
    },
  },
  {
    accessorKey: "detail",
    enableSorting: false,
    header: "",
    size: 88,
    cell: ({ row }) => (
      <MHButton
        className="medium!"
        onClick={() => onDetailClick(row.original.id)}
        size="xSmall"
        variant="secondary"
      >
        자세히
      </MHButton>
    ),
  },
];

const ApplicationTable = (props: IApplicationTableProps) => {
  return (
    <MHTable
      caption="지원 현황"
      columns={createColumns(
        props.isStageUpdate,
        props.onAttachmentClick,
        props.onDetailClick,
        props.onStageChange,
      )}
      data={props.applications}
      getRowId={(application) => application.id}
      onSortingChange={props.onSortingChange}
      rowSelection={{
        onRowSelectionChange: props.onSelectChange,
        onSelectAllChange: props.onSelectAll,
        selectedRowIds: props.selectedIds,
      }}
      sorting={props.sorting}
    />
  );
};

export default ApplicationTable;
