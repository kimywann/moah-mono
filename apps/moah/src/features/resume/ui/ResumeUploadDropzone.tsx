import MHIcon from "@moah/ui/components/MHIcon";
import cn from "@moah/ui/utils/cn";
import type { ChangeEvent, DragEvent } from "react";
import { useState } from "react";

interface IResumeUploadBannerProps {
  isCompact?: boolean;
  isUploading?: boolean;
  onFileSelect: (file: File) => void;
  selectedFileName?: string;
}

const isPDFFile = (file: File) => /\.pdf$/i.test(file.name);

const ResumeUploadBanner = ({
  isCompact = false,
  isUploading = false,
  onFileSelect,
  selectedFileName,
}: IResumeUploadBannerProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFile = (file: File | undefined) => {
    if (!file || isUploading) {
      return;
    }

    if (!isPDFFile(file)) {
      setErrorMessage("PDF 파일만 업로드할 수 있어요.");
      return;
    }

    setErrorMessage("");
    onFileSelect(file);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    if (event.currentTarget === event.target) {
      setIsDragging(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files[0]);
  };

  if (isCompact) {
    return (
      <div className="flex flex-col items-end gap-1">
        <label className="display12 semibold inline-flex h-8 cursor-pointer items-center justify-center gap-1 rounded-tiny bg-primary px-3 text-white transition-colors hover:bg-primary-hover">
          <input
            accept=".pdf,application/pdf"
            className="sr-only"
            disabled={isUploading}
            onChange={handleChange}
            type="file"
          />
          <MHIcon icon="upload" size={16} />
          {isUploading ? "업로드 중" : "파일 업로드"}
        </label>
        {errorMessage && (
          <p className="display10 medium text-danger" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }

  return (
    <label
      className={cn(
        "relative block aspect-6/1 cursor-pointer overflow-hidden rounded-medium border-2 border-border border-dashed transition-colors hover:bg-muted",
        isDragging && "border-primary bg-primary/5",
      )}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      htmlFor="resume-file-upload"
    >
      <input
        accept=".pdf,application/pdf"
        className="sr-only"
        disabled={isUploading}
        id="resume-file-upload"
        onChange={handleChange}
        type="file"
      />

      <div className="flex size-full cursor-pointer flex-col items-center justify-center px-6 text-center focus-within:outline-none">
        <MHIcon className="text-primary" icon="upload" size={32} />
        <p className="bold display18 mt-3">
          {isUploading
            ? "파일을 업로드하는 중이에요"
            : "파일을 이곳에 끌어다 놓거나 클릭해서 업로드해 주세요"}
        </p>
        <p className="display14 regular mt-2 text-muted-foreground">
          {selectedFileName ?? "PDF 파일만 업로드할 수 있어요."}
        </p>
        {errorMessage && (
          <p className="display12 medium mt-2 text-danger" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    </label>
  );
};

export default ResumeUploadBanner;
