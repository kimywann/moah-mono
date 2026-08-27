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
    accessorKey: "career",
    enableSorting: false,
    header: "경력",
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
    cell: ({ getValue }) => {
      const deadline = getValue<string | null>();

      return deadline ? dayjs(deadline).format("YYYY-MM-DD") : "상시 채용";
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
      caption="지원 목록"
      columns={columns}
      data={props.applications}
      getRowId={(application) => application.id}
      onSortingChange={props.onSortingChange}
      sorting={props.sorting}
    />
  );
};

export default ApplicationTable;
