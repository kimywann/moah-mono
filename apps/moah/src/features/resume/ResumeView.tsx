import type { SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { RESUME_MOCK_DATA } from "@/features/resume/model/resume.mock";
import ResumeTable from "@/features/resume/ui/ResumeTable";
import ResumeUploadDropzone from "@/features/resume/ui/ResumeUploadDropzone";

const ResumeView = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedFileName, setSelectedFileName] = useState<string>();

  const handleFileSelect = (file: File) => {
    setSelectedFileName(file.name);
  };

  const handleSelectChange = (id: string, isSelected: boolean) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);

      if (isSelected) {
        next.add(id);
      } else {
        next.delete(id);
      }

      return next;
    });
  };

  const handleSelectAll = (ids: string[], isSelected: boolean) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);

      for (const id of ids) {
        if (isSelected) {
          next.add(id);
        } else {
          next.delete(id);
        }
      }

      return next;
    });
  };

  return (
    <section className="w-full">
      <div className="mb-6">
        <ResumeUploadDropzone
          onFileSelect={handleFileSelect}
          selectedFileName={selectedFileName}
        />
      </div>

      <div className="mb-4">
        <h1 className="bold display24">이력서 목록</h1>
      </div>

      <ResumeTable
        onSelectAll={handleSelectAll}
        onSelectChange={handleSelectChange}
        onSortingChange={setSorting}
        resumes={RESUME_MOCK_DATA}
        selectedIds={selectedIds}
        sorting={sorting}
      />
    </section>
  );
};

export default ResumeView;
