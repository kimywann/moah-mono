import { APPLICATION_STAGES } from "@moah/shared/constants/application";
import MHBadge from "@moah/ui/components/MHBadge";
import MHButton from "@moah/ui/components/MHButton";
import type { IMHDropdownOption } from "@moah/ui/components/MHDropdown";
import MHDropdown from "@moah/ui/components/MHDropdown";
import MHIcon from "@moah/ui/components/MHIcon";
import MHTable from "@moah/ui/components/MHTable";
import type {
  ColumnDef,
  OnChangeFn,
  SortingState,
} from "@tanstack/react-table";
import { STAGE_DISPLAY } from "@/shared/constants/application-stage";
import { PLATFORM_LABEL } from "@/shared/constants/platform";
import type {
  IApplicationList,
  TApplicationStage,
  TJobPostingPlatform,
} from "@/shared/type/application";
import { getCareerLabel, getDeadlineLabel } from "@/shared/utils/format";

interface IApplicationTableProps {
  applications: IApplicationList[];
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
    label: STAGE_DISPLAY[stage].label,
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
  const stageDisplay = STAGE_DISPLAY[stage];

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
  onDetailClick: (id: string) => void,
  onStageChange: (id: string, stage: TApplicationStage) => void,
): ColumnDef<IApplicationList>[] => [
  {
    accessorKey: "companyName",
    enableSorting: false,
    header: "기업",
    cell: ({ getValue }) => (
      <span className="regular">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "position",
    enableSorting: false,
    header: "포지션",
    cell: ({ getValue }) => (
      <span className="regular">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "minYears",
    enableSorting: false,
    header: "경력",
    cell: ({ row }) => getCareerLabel(row.original),
  },
  {
    accessorKey: "title",
    enableSorting: false,
    header: "공고명",
    cell: ({ getValue }) => (
      <span className="regular">
        {getValue<string | null>() ?? "제목 미정"}
      </span>
    ),
  },
  {
    accessorKey: "platform",
    enableSorting: false,
    header: "플랫폼",
    cell: ({ getValue }) => (
      <span className="regular">
        {PLATFORM_LABEL[getValue<TJobPostingPlatform>()]}
      </span>
    ),
  },
  {
    accessorKey: "stage",
    enableSorting: false,
    header: "지원 단계",
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
    cell: ({ row }) => getDeadlineLabel(row.original),
  },
  {
    accessorKey: "detail",
    enableSorting: false,
    header: "",
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
