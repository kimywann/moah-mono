"use client";

import type { SortingState } from "@tanstack/react-table";
import { useState } from "react";
import type { IApplication } from "@/app/type/application";
import ApplicationTable from "./components/table/ApplicationTable";

interface IApplicationsProps {
  applications: IApplication[];
}

const Applications = (props: IApplicationsProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  return (
    <section className="w-full">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="bold display28 text-foreground">지원 목록</h1>
          <p className="medium display14 mt-2 text-muted-foreground">
            지원 현황과 전형 일정을 한눈에 관리해 보세요.
          </p>
        </div>

        <p className="medium display14 text-muted-foreground">
          총 {props.applications.length}건
        </p>
      </div>

      <ApplicationTable
        applications={props.applications}
        onSortingChange={setSorting}
        sorting={sorting}
      />
    </section>
  );
};

export default Applications;
