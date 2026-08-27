import MHBadge from "@moah/ui/components/MHBadge";
import MHButton from "@moah/ui/components/MHButton";
import MHTable from "@moah/ui/components/MHTable";
import type {
  ColumnDef,
  OnChangeFn,
  SortingState,
} from "@tanstack/react-table";
import { PLATFORM_LABEL } from "@/shared/constants/platform";
import type {
  IApplicationList,
  TApplicationStage,
  TJobPostingPlatform,
} from "@/shared/type/application";
import { getCareerLabel, getDeadlineLabel } from "@/shared/utils/format";

type TBadgeVariant = "neutral" | "primary" | "success" | "danger" | "info";

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
    variant: "primary",
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
    cell: ({ getValue }) => {
      const stage = STAGE_DISPLAY[getValue<TApplicationStage>()];

      return (
        <MHBadge size="md" variant={stage.variant} className="regular">
          {stage.label}
        </MHBadge>
      );
    },
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
