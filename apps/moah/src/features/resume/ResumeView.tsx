import type { TResumeType } from "@moah/contracts/schema/resume";
import MHIcon from "@moah/ui/components/MHIcon";
import type { SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { useResumes } from "@/features/resume/hooks/useResumes";
import ResumeTable from "@/features/resume/ui/ResumeTable";
import ResumeTypeModal from "@/features/resume/ui/ResumeTypeModal";
import ResumeUploadDropzone from "@/features/resume/ui/ResumeUploadDropzone";

const ResumeView = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedFileName, setSelectedFileName] = useState<string>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const { resumesQuery, uploadResumeMutation } = useResumes();
  const resumes = resumesQuery.data ?? [];

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setSelectedFileName(file.name);
    setIsTypeModalOpen(true);
  };

  const handleResumeTypeSubmit = async (resumeType: TResumeType) => {
    if (!selectedFile) {
      return;
    }

    try {
      await uploadResumeMutation.mutateAsync({
        file: selectedFile,
        resumeType,
      });
      setIsTypeModalOpen(false);
      setSelectedFile(null);
      setSelectedFileName(undefined);
    } catch {
      return;
    }
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

  if (resumesQuery.isPending) {
    return (
      <output
        aria-label="이력서 목록을 불러오는 중"
        className="flex min-h-82 items-center justify-center"
      >
        <MHIcon className="animate-spin text-primary" icon="loaderCircle" />
      </output>
    );
  }

  if (resumesQuery.isError) {
    return (
      <p className="p-6 text-danger" role="alert">
        이력서 목록을 불러오지 못했습니다.
      </p>
    );
  }

  return (
    <>
      <section className="w-full">
        <div className="mb-6">
          <ResumeUploadDropzone
            isUploading={uploadResumeMutation.isPending}
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
          resumes={resumes}
          selectedIds={selectedIds}
          sorting={sorting}
        />
      </section>

      {isTypeModalOpen && selectedFile && (
        <ResumeTypeModal
          file={selectedFile}
          isSubmitting={uploadResumeMutation.isPending}
          onClose={() => {
            if (!uploadResumeMutation.isPending) {
              setIsTypeModalOpen(false);
              setSelectedFile(null);
              setSelectedFileName(undefined);
            }
          }}
          onSubmit={(resumeType) => void handleResumeTypeSubmit(resumeType)}
        />
      )}
    </>
  );
};

export default ResumeView;
