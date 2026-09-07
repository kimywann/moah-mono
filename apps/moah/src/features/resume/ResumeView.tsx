import type { TResumeType } from "@moah/contracts/schema/resume";
import MHIcon from "@moah/ui/components/MHIcon";
import MHModal from "@moah/ui/components/MHModal";
import { toast } from "@moah/ui/components/MHToaster";
import type { SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { getResumePreviewUrl } from "@/features/resume/api/resume";
import { useResumes } from "@/features/resume/hooks/useResumes";
import type { IResume } from "@/features/resume/model/resume.type";
import ResumeTable from "@/features/resume/ui/ResumeTable";
import ResumeTypeModal from "@/features/resume/ui/ResumeTypeModal";
import ResumeUploadDropzone from "@/features/resume/ui/ResumeUploadDropzone";

const ResumeView = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedFileName, setSelectedFileName] = useState<string>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const { deleteResumeMutation, resumesQuery, uploadResumeMutation } =
    useResumes();
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

  const handlePreviewClick = async (resume: IResume) => {
    const previewWindow = window.open("", "_blank");

    if (!previewWindow) {
      toast.error("미리보기 창을 열 수 없습니다.");
      return;
    }

    previewWindow.opener = null;

    try {
      const response = await getResumePreviewUrl(resume.id);

      if (!response.success || !response.data) {
        throw new Error("이력서 미리보기 URL을 발급받지 못했습니다.");
      }

      previewWindow.location.href = response.data.previewUrl;
    } catch {
      previewWindow.close();
      toast.error("이력서 미리보기를 불러오지 못했습니다.");
    }
  };

  const handleDeleteClick = async (resume: IResume) => {
    const result = await MHModal<"cancel" | "delete">({
      name: "파일 삭제",
      title: "정말 삭제하시겠습니까?",
      description: "영구적으로 삭제되며, 삭제한 파일은 복구할 수 없습니다.",
      width: "!w-[412px]",
      buttons: [
        {
          label: "삭제하기",
          value: "delete",
          variant: "danger",
        },
        {
          label: "돌아가기",
          value: "cancel",
          variant: "secondary",
        },
      ],
    });

    if (result === "delete") {
      try {
        await deleteResumeMutation.mutateAsync(resume.id);
      } catch {
        return;
      }
    }
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
          isDeleting={deleteResumeMutation.isPending}
          onDeleteClick={(resume) => void handleDeleteClick(resume)}
          onPreviewClick={(resume) => void handlePreviewClick(resume)}
          onSortingChange={setSorting}
          resumes={resumes}
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
