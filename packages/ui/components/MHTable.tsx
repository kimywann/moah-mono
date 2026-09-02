"use client";

import {
  flexRender,
  getCoreRowModel,
  type OnChangeFn,
  type SortingState,
  type TableOptions,
  useReactTable,
} from "@tanstack/react-table";
import cn from "../utils/cn";
import MHCheckbox from "./MHCheckbox";
import MHIcon from "./MHIcon";

interface IMHTableRowSelectionProps {
  onRowSelectionChange: (rowId: string, isSelected: boolean) => void;
  onSelectAllChange: (rowIds: string[], isSelected: boolean) => void;
  selectedRowIds: Set<string>;
}

interface IMHTableProps<TData> {
  caption: string;
  className?: string;
  columns: TableOptions<TData>["columns"];
  data: TData[];
  getRowId?: TableOptions<TData>["getRowId"];
  isLoading?: boolean;
  onSortingChange: OnChangeFn<SortingState>;
  rowSelection?: IMHTableRowSelectionProps;
  sorting: SortingState;
}

const MHTable = <TData,>({
  caption,
  className,
  columns,
  data,
  getRowId,
  isLoading = false,
  onSortingChange,
  rowSelection,
  sorting,
}: IMHTableProps<TData>) => {
  const table = useReactTable({
    columns,
    data,
    enableMultiSort: false,
    getCoreRowModel: getCoreRowModel(),
    getRowId,
    manualSorting: true,
    onSortingChange,
    state: {
      sorting,
    },
  });

  const rows = table.getRowModel().rows;
  const visibleColumnCount =
    table.getVisibleLeafColumns().length + (rowSelection ? 1 : 0);
  const rowIds = rows.map((row) => row.id);
  const isAllSelected =
    rowIds.length > 0 &&
    rowIds.every((rowId) => rowSelection?.selectedRowIds.has(rowId));

  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-small border border-neutral10",
        className,
      )}
    >
      <table
        aria-busy={isLoading}
        className="display14 w-full table-fixed border-collapse text-left"
      >
        <caption className="sr-only">{caption}</caption>

        <thead className="bg-mono10 text-muted-foreground">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {rowSelection && (
                <th
                  className="w-14 border-border-subtle border-b px-4 py-3"
                  scope="col"
                >
                  <MHCheckbox
                    disabled={rows.length === 0}
                    isChecked={isAllSelected}
                    onChange={(event) =>
                      rowSelection.onSelectAllChange(
                        rowIds,
                        event.target.checked,
                      )
                    }
                  />
                </th>
              )}
              {headerGroup.headers.map((header) => {
                const isSortable = header.column.getCanSort();
                const sortingDirection = header.column.getIsSorted();

                return (
                  <th
                    aria-sort={
                      sortingDirection === "asc"
                        ? "ascending"
                        : sortingDirection === "desc"
                          ? "descending"
                          : undefined
                    }
                    className="semibold border-border-subtle border-b px-4 py-3"
                    key={header.id}
                    scope="col"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : isSortable ? (
                      <button
                        className="flex w-full cursor-pointer items-center gap-1 rounded-tiny text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
                        onClick={header.column.getToggleSortingHandler()}
                        type="button"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        <MHIcon
                          className={cn(
                            "text-subtle-foreground transition-transform",
                            sortingDirection && "text-foreground",
                            sortingDirection === "desc" && "rotate-180",
                          )}
                          icon="arrowUp"
                          size={14}
                        />
                      </button>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td className="px-4 py-12" colSpan={visibleColumnCount}>
                <output className="flex items-center justify-center">
                  <MHIcon
                    className="animate-spin text-primary"
                    icon="loaderCircle"
                    size={24}
                  />
                </output>
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td
                className="px-4 py-12 text-center text-muted-foreground"
                colSpan={visibleColumnCount}
              >
                데이터가 존재하지 않습니다.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                className="transition-colors hover:bg-muted last:[&>td]:border-b-0"
                key={row.id}
              >
                {rowSelection && (
                  <td className="border-border-subtle border-b px-4 py-4">
                    <MHCheckbox
                      isChecked={rowSelection.selectedRowIds.has(row.id)}
                      onChange={(event) =>
                        rowSelection.onRowSelectionChange(
                          row.id,
                          event.target.checked,
                        )
                      }
                    />
                  </td>
                )}
                {row.getVisibleCells().map((cell) => (
                  <td
                    className="border-border-subtle border-b px-4 py-4"
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MHTable;
