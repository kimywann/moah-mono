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

type TBadgeVariant =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

interface IApplicationTableProps {
  applications: IApplication[];
  onSortingChange: OnChangeFn<SortingState>;
  sorting: SortingState;
}

interface IStageDisplay {
  label: string;
  variant: TBadgeVariant;
}

const STAGE_DISPLAY: Record<TApplicationStage, IStageDisplay> = {
  applied: {
    label: "지원 완료",
    variant: "info",
  },
  document: {
    label: "서류 전형",
    variant: "warning",
  },
  interview: {
    label: "면접 진행",
    variant: "primary",
  },
  offer: {
    label: "최종 합격",
    variant: "success",
  },
  rejected: {
    label: "불합격",
    variant: "neutral",
  },
};

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
