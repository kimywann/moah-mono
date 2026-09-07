import type { TResumeType } from "@moah/contracts/schema/resume";
import MHBadge from "@moah/ui/components/MHBadge";
import MHButton from "@moah/ui/components/MHButton";
import MHCheckbox from "@moah/ui/components/MHCheckbox";
import MHIcon from "@moah/ui/components/MHIcon";
import MHInput from "@moah/ui/components/MHInput";
import MHPagination from "@moah/ui/components/MHPagination";
import MHTable from "@moah/ui/components/MHTable";
import { toast } from "@moah/ui/components/MHToaster";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { type ChangeEvent, useEffect, useState } from "react";
import type { IApplicationList } from "@/features/applications/model/application.type";
import {
  getResumeDownloadUrl,
  getResumePreviewUrl,
} from "@/features/resume/api/resume";
import { useResumes } from "@/features/resume/hooks/useResumes";
import { RESUME_TYPE_LABEL } from "@/features/resume/model/resume.constant";
import type { IResume } from "@/features/resume/model/resume.type";
import ResumeTypeModal from "@/features/resume/ui/ResumeTypeModal";
import PDFPreview from "@/shared/components/PDFPreview";

const MAX_ATTACHMENT_COUNT = 4;
const ATTACHMENT_PAGE_SIZE = 5;

interface IApplicationAttachmentModalProps {
  application: IApplicationList;
  isSaving: boolean;
  onClose: () => void;
  onSave: (resumeIds: string[]) => void;
}

const ApplicationAttachmentModal = (
  props: IApplicationAttachmentModalProps,
) => {
  const [selectedIds, setSelectedIds] = useState(
    () => new Set(props.application.attachments.map(({ id }) => id)),
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [previewResumeId, setPreviewResumeId] = useState<string | null>(null);
  const [downloadingResumeId, setDownloadingResumeId] = useState<string | null>(
    null,
  );
  const { resumesQuery, uploadResumeMutation } = useResumes();
  const previewQuery = useQuery({
    queryKey: ["resumePreview", previewResumeId],
    enabled: previewResumeId !== null,
    queryFn: async () => {
      if (!previewResumeId) {
        throw new Error("미리볼 파일을 선택해 주세요.");
      }

      const response = await getResumePreviewUrl(previewResumeId);

      if (!response.success || !response.data) {
        throw new Error("미리보기를 불러오지 못했습니다.");
      }

      return response.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
  const resumes = resumesQuery.data ?? [];
  const filteredResumes = resumes.filter(({ name }) =>
    name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const totalPages = Math.ceil(filteredResumes.length / ATTACHMENT_PAGE_SIZE);
  const currentResumes = filteredResumes.slice(
    (currentPage - 1) * ATTACHMENT_PAGE_SIZE,
    currentPage * ATTACHMENT_PAGE_SIZE,
  );
  const isBusy = props.isSaving || uploadResumeMutation.isPending;

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSelectionChange = (resumeId: string, isSelected: boolean) => {
    setSelectedIds((previousIds) => {
      const nextIds = new Set(previousIds);

      if (isSelected) {
        if (nextIds.size < MAX_ATTACHMENT_COUNT) {
          nextIds.add(resumeId);
        }
      } else {
        nextIds.delete(resumeId);
      }

      return nextIds;
    });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async (resumeType: TResumeType) => {
    if (!selectedFile) {
      return;
    }

    try {
      const uploadedResume = await uploadResumeMutation.mutateAsync({
        file: selectedFile,
        resumeType,
      });

      setSelectedIds((previousIds) =>
        new Set(previousIds).add(uploadedResume.resumeId),
      );
      setSelectedFile(null);
    } catch {
      return;
    }
  };

  const handleDownload = async (resume: IResume) => {
    setDownloadingResumeId(resume.id);

    try {
      const response = await getResumeDownloadUrl(resume.id);

      if (!response.success || !response.data) {
        throw new Error("파일 다운로드 URL을 발급받지 못했습니다.");
      }

      const downloadLink = document.createElement("a");
      downloadLink.href = response.data.downloadUrl;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
    } catch {
      toast.error("파일을 다운로드하지 못했습니다.");
    } finally {
      setDownloadingResumeId(null);
    }
  };

  const columns: ColumnDef<IResume>[] = [
    {
      id: "selection",
      enableSorting: false,
      header: () => <span className="sr-only">선택</span>,
      size: 56,
      cell: ({ row }) => {
        const isSelected = selectedIds.has(row.original.id);
        const isSelectionDisabled =
          isBusy || (!isSelected && selectedIds.size >= MAX_ATTACHMENT_COUNT);

        return (
          <MHCheckbox
            disabled={isSelectionDisabled}
            id={`application-attachment-${row.original.id}`}
            isChecked={isSelected}
            onChange={(event) =>
              handleSelectionChange(row.original.id, event.target.checked)
            }
          />
        );
      },
    },
    {
      accessorKey: "name",
      enableSorting: false,
      header: "파일명",
      size: 280,
      cell: ({ row }) => (
        <label
          className="regular block cursor-pointer truncate"
          htmlFor={`application-attachment-${row.original.id}`}
        >
          {row.original.name}
        </label>
      ),
    },
    {
      accessorKey: "resumeType",
      enableSorting: false,
      header: "유형",
      size: 112,
      cell: ({ row }) => (
        <MHBadge className="regular" size="md">
          {RESUME_TYPE_LABEL[row.original.resumeType]}
        </MHBadge>
      ),
    },
    {
      id: "preview",
      enableSorting: false,
      header: "미리보기",
      size: 104,
      cell: ({ row }) => (
        <MHButton
          disabled={row.original.fileFormat !== "PDF"}
          onClick={() => setPreviewResumeId(row.original.id)}
          size="xSmall"
          variant="secondary"
        >
          미리보기
        </MHButton>
      ),
    },
    {
      id: "download",
      enableSorting: false,
      header: () => <span className="sr-only">다운로드</span>,
      size: 56,
      cell: ({ row }) => (
        <button
          aria-label={`${row.original.name} 다운로드`}
          className="flex size-8 cursor-pointer items-center justify-center rounded-tiny text-muted-foreground hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          disabled={downloadingResumeId === row.original.id}
          onClick={() => void handleDownload(row.original)}
          type="button"
        >
          <MHIcon
            className={
              downloadingResumeId === row.original.id
                ? "animate-spin"
                : undefined
            }
            icon={
              downloadingResumeId === row.original.id
                ? "loaderCircle"
                : "download"
            }
            size={18}
          />
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6">
        <div
          aria-labelledby="application-attachment-modal-title"
          aria-modal="true"
          className="flex h-[calc(100vh-48px)] max-h-[calc(100vh-48px)] w-full max-w-content flex-col overflow-y-auto rounded-medium bg-background p-8 shadow-xs"
          role="dialog"
        >
          <div className="relative text-center">
            <h2
              className="bold display24"
              id="application-attachment-modal-title"
            >
              파일 첨부
            </h2>
            <p className="regular display14 mt-2 text-muted-foreground">
              지원 공고에 연결할 파일을 최대 4개까지 선택할 수 있어요.
            </p>
            <button
              aria-label="파일 첨부 닫기"
              className="absolute top-0 right-0 flex size-8 cursor-pointer items-center justify-center text-muted-foreground hover:text-foreground"
              disabled={isBusy}
              onClick={props.onClose}
              type="button"
            >
              <MHIcon icon="x" size={24} />
            </button>
          </div>

          <div className="mt-8 grid min-h-0 flex-1 grid-cols-2 items-stretch gap-6">
            <div className="flex min-h-0 min-w-0 flex-col">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <MHInput
                    className="w-full"
                    isFullWidth
                    onChange={(event) => {
                      setSearchQuery(event.target.value);
                      setCurrentPage(1);
                    }}
                    onClear={() => {
                      setSearchQuery("");
                      setCurrentPage(1);
                    }}
                    placeholder="파일명 검색"
                    value={searchQuery}
                  />
                  <span className="regular shrink-0 text-muted-foreground">
                    {selectedIds.size} / {MAX_ATTACHMENT_COUNT}개 선택
                  </span>
                </div>
                <label
                  className={
                    selectedIds.size >= MAX_ATTACHMENT_COUNT || isBusy
                      ? "medium flex cursor-not-allowed items-center gap-2 rounded-tiny bg-disabled px-4 py-2 text-disabled-foreground"
                      : "medium flex cursor-pointer items-center gap-2 rounded-tiny bg-primary px-4 py-2 text-white hover:bg-primary-hover"
                  }
                  htmlFor="application-attachment-upload"
                >
                  <MHIcon icon="upload" size={16} />
                  파일 업로드
                </label>
                <input
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="sr-only"
                  disabled={selectedIds.size >= MAX_ATTACHMENT_COUNT || isBusy}
                  id="application-attachment-upload"
                  onChange={handleFileChange}
                  type="file"
                />
              </div>

              <div className="mt-3 flex min-h-0 flex-1 flex-col">
                <MHTable
                  caption="첨부할 파일 목록"
                  className="min-h-0 flex-1 overflow-y-auto"
                  columns={columns}
                  data={currentResumes}
                  emptyMessage={
                    resumesQuery.isError
                      ? "파일 목록을 불러오지 못했습니다."
                      : searchQuery
                        ? "검색 결과가 없습니다."
                        : "업로드한 파일이 없습니다."
                  }
                  getRowId={(resume) => resume.id}
                  isLoading={resumesQuery.isPending}
                  onSortingChange={() => undefined}
                  sorting={[]}
                />
                <div className="mt-3 shrink-0">
                  <MHPagination
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    totalPages={totalPages}
                  />
                </div>
              </div>
            </div>
            <PDFPreview
              isError={previewQuery.isError}
              isLoading={previewQuery.isLoading}
              onRetry={() => void previewQuery.refetch()}
              previewUrl={previewQuery.data?.previewUrl ?? null}
            />
          </div>

          <div className="mt-8 grid shrink-0 grid-cols-2 gap-3">
            <MHButton
              disabled={isBusy}
              isFullWidth
              onClick={props.onClose}
              size="large"
              variant="secondary"
            >
              돌아가기
            </MHButton>
            <MHButton
              disabled={
                resumesQuery.isPending || resumesQuery.isError || isBusy
              }
              isFullWidth
              onClick={() => props.onSave([...selectedIds])}
              size="large"
            >
              {props.isSaving ? "저장 중..." : "저장하기"}
            </MHButton>
          </div>
        </div>
      </div>

      {selectedFile && (
        <ResumeTypeModal
          file={selectedFile}
          isSubmitting={uploadResumeMutation.isPending}
          onClose={() => {
            if (!uploadResumeMutation.isPending) {
              setSelectedFile(null);
            }
          }}
          onSubmit={(resumeType) => void handleUpload(resumeType)}
        />
      )}
    </>
  );
};

export default ApplicationAttachmentModal;
