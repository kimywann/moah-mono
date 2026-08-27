import MHBadge from "@moah/ui/components/MHBadge";
import MHButton from "@moah/ui/components/MHButton";
import MHTable from "@moah/ui/components/MHTable";
import type {
  ColumnDef,
  OnChangeFn,
  SortingState,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import type {
  IApplication,
  TApplicationStage,
} from "@/shared/type/application";

type TBadgeVariant = "neutral" | "primary" | "success" | "danger" | "info";

interface IApplicationTableProps {
  applications: IApplication[];
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

const columns: ColumnDef<IApplication>[] = [
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
    cell: ({ row }) => {
      const { minYears, maxYears } = row.original;

      if (minYears === null && maxYears === null) {
        return "경력 조건 미정";
      }

      if (minYears === 0 && maxYears === 0) {
        return "신입";
      }

      if (minYears === 0 && maxYears === null) {
        return "경력 무관";
      }

      if (maxYears === null) {
        return `경력 ${minYears}년 이상`;
      }

      return minYears === maxYears
        ? `경력 ${minYears}년`
        : `경력 ${minYears}~${maxYears}년`;
    },
  },
  {
    accessorKey: "location",
    enableSorting: false,
    header: "지역",
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
    cell: ({ getValue, row }) => {
      const deadline = getValue<string | null>();
      const deadlineType = row.original.deadlineType;

      if (deadlineType === "ROLLING") {
        return "상시 채용";
      }

      if (deadlineType === "UNTIL_FILLED") {
        return "채용 시 마감";
      }

      if (deadlineType === "UNKNOWN") {
        return "마감 정보 없음";
      }

      return deadline ? dayjs(deadline).format("YYYY-MM-DD") : "마감 정보 없음";
    },
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
