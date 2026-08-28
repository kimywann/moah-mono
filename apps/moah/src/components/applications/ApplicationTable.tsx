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
import { useState } from "react";
import { PLATFORM_LABEL } from "@/shared/constants/platform";
import type {
  IApplicationList,
  TApplicationStage,
  TJobPostingPlatform,
} from "@/shared/type/application";
import { getCareerLabel, getDeadlineLabel } from "@/shared/utils/format";

type TBadgeVariant =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

interface IApplicationTableProps {
  applications: IApplicationList[];
  onSortingChange: OnChangeFn<SortingState>;
  sorting: SortingState;
}

const STAGE_DISPLAY = {
  READY: {
    label: "지원 준비 중",
    variant: "neutral",
  },
  APPLIED: {
    label: "지원 완료",
    variant: "info",
  },
  INTERVIEW: {
    label: "면접",
    variant: "warning",
  },
  PASSED: {
    label: "합격",
    variant: "success",
  },
  REJECTED: {
    label: "불합격",
    variant: "danger",
  },
} satisfies Record<
  TApplicationStage,
  { label: string; variant: TBadgeVariant }
>;

const APPLICATION_STAGE_OPTIONS: IMHDropdownOption<TApplicationStage>[] = [
  { label: STAGE_DISPLAY.READY.label, value: "READY" },
  { label: STAGE_DISPLAY.APPLIED.label, value: "APPLIED" },
  { label: STAGE_DISPLAY.INTERVIEW.label, value: "INTERVIEW" },
  { label: STAGE_DISPLAY.PASSED.label, value: "PASSED" },
  { label: STAGE_DISPLAY.REJECTED.label, value: "REJECTED" },
];

interface IApplicationStageDropdownProps {
  stage: TApplicationStage;
}

const ApplicationStageDropdown = ({
  stage: initialStage,
}: IApplicationStageDropdownProps) => {
  const [stage, setStage] = useState(initialStage);
  const stageDisplay = STAGE_DISPLAY[stage];

  return (
    <MHDropdown
      onChange={setStage}
      options={APPLICATION_STAGE_OPTIONS}
      trigger={(isOpen) => (
        <button
          aria-label="지원 단계 변경"
          className="cursor-pointer rounded-tiny focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
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

const columns: ColumnDef<IApplicationList>[] = [
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
    accessorKey: "location",
    enableSorting: false,
    header: "지역",
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
    cell: ({ getValue }) => (
      <ApplicationStageDropdown stage={getValue<TApplicationStage>()} />
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
    cell: () => (
      <MHButton variant="secondary" size="xSmall" className="medium!">
        자세히
      </MHButton>
    ),
  },
];

const ApplicationTable = (props: IApplicationTableProps) => {
  return (
    <MHTable
      caption="지원 현황"
      columns={columns}
      data={props.applications}
      getRowId={(application) => application.id}
      onSortingChange={props.onSortingChange}
      sorting={props.sorting}
    />
  );
};

export default ApplicationTable;
