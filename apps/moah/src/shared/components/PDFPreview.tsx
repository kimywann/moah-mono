import MHButton from "@moah/ui/components/MHButton";
import MHIcon from "@moah/ui/components/MHIcon";

interface IPDFPreviewProps {
  isError: boolean;
  isLoading: boolean;
  onRetry: () => void;
  previewUrl: string | null;
}

const PDFPreview = ({
  isError,
  isLoading,
  onRetry,
  previewUrl,
}: IPDFPreviewProps) => {
  return (
    <section className="flex h-full min-h-120 w-full min-w-0 flex-col rounded-small border border-neutral10">
      <h3 className="semibold display16 border-border-subtle border-b px-4 py-3">
        PDF 미리보기
      </h3>
      {!previewUrl && !isLoading && !isError ? (
        <p className="flex flex-1 items-center justify-center text-muted-foreground">
          목록에서 미리보기 버튼을 눌러 주세요
        </p>
      ) : isLoading ? (
        <output
          aria-label="PDF 미리보기를 불러오는 중"
          className="flex flex-1 items-center justify-center"
        >
          <MHIcon className="animate-spin text-primary" icon="loaderCircle" />
        </output>
      ) : isError ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <p role="alert">미리보기를 불러오지 못했습니다</p>
          <MHButton onClick={onRetry} variant="secondary">
            다시 시도
          </MHButton>
        </div>
      ) : (
        <iframe
          className="min-h-0 w-full flex-1 border-0"
          src={previewUrl ?? undefined}
          title="선택한 파일 PDF 미리보기"
        />
      )}
    </section>
  );
};

export default PDFPreview;
