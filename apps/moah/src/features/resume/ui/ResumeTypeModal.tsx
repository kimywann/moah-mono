import type { TResumeType } from "@moah/contracts/schema/resume";
import MHButton from "@moah/ui/components/MHButton";
import MHCheckbox from "@moah/ui/components/MHCheckbox";
import MHIcon from "@moah/ui/components/MHIcon";
import { useState } from "react";
import { RESUME_TYPE_LABEL } from "@/features/resume/model/resume.constant";

interface IResumeTypeModalProps {
  file: File;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (resumeType: TResumeType) => void;
}

const RESUME_TYPE_OPTIONS: Array<{
  label: string;
  value: TResumeType;
}> = [
  { label: RESUME_TYPE_LABEL.PORTFOLIO, value: "PORTFOLIO" },
  { label: RESUME_TYPE_LABEL.RESUME, value: "RESUME" },
  { label: RESUME_TYPE_LABEL.OTHER, value: "OTHER" },
];

const ResumeTypeModal = ({
  file,
  isSubmitting,
  onClose,
  onSubmit,
}: IResumeTypeModalProps) => {
  const [selectedType, setSelectedType] = useState<TResumeType>();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6">
      <div
        aria-labelledby="resume-type-modal-title"
        aria-modal="true"
        className="flex max-h-[calc(100vh-48px)] w-full max-w-120 flex-col overflow-y-auto rounded-medium bg-background p-8 shadow-xs"
        role="dialog"
      >
        <div className="relative flex items-center justify-center">
          <h2 className="bold display24" id="resume-type-modal-title">
            파일 유형 선택
          </h2>
          <button
            aria-label="파일 유형 선택 닫기"
            className="absolute top-0 right-0 flex size-8 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            disabled={isSubmitting}
            onClick={onClose}
            type="button"
          >
            <MHIcon icon="x" size={24} />
          </button>
        </div>

        <div className="mt-8 flex items-center gap-3 rounded-medium bg-field px-5 py-4">
          <MHIcon className="text-primary" icon="fileText" size={24} />
          <span className="regular min-w-0 flex-1 truncate">{file.name}</span>
          <button
            aria-label="선택한 파일 삭제"
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            disabled={isSubmitting}
            onClick={onClose}
            type="button"
          >
            <MHIcon icon="x" size={20} />
          </button>
        </div>

        <fieldset className="mt-8 flex flex-col gap-5">
          <legend className="sr-only">파일 유형</legend>
          {RESUME_TYPE_OPTIONS.map(({ label, value }) => (
            <button
              aria-pressed={selectedType === value}
              className="flex cursor-pointer items-center gap-4 text-left"
              key={value}
              onClick={() => setSelectedType(value)}
              type="button"
            >
              <MHCheckbox
                className="shrink-0"
                isChecked={selectedType === value}
                disabled={isSubmitting}
                onChange={() => setSelectedType(value)}
              />
              <span className="regular display18">{label}</span>
            </button>
          ))}
        </fieldset>

        <MHButton
          className="mt-8"
          disabled={!selectedType || isSubmitting}
          isFullWidth
          onClick={() => {
            if (selectedType) {
              onSubmit(selectedType);
            }
          }}
          size="large"
        >
          {isSubmitting ? "업로드 중..." : "완료"}
        </MHButton>
      </div>
    </div>
  );
};

export default ResumeTypeModal;
