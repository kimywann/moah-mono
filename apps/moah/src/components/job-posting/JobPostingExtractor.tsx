import {
  jobPostingURLSchema,
  type TJobPostingForm,
} from "@moah/contracts/schema/job-posting";
import MHIcon from "@moah/ui/components/MHIcon";
import cn from "@moah/ui/utils/cn";
import type { ChangeEventHandler, SubmitEventHandler } from "react";
import { useState } from "react";
import { extractJobPosting } from "@/api/job-posting";
import { useAuth } from "@/contexts/AuthContext";
import JobPostingPreviewModal from "./JobPostingPreviewModal";

const JobPostingExtractor = () => {
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [jobPosting, setJobPosting] = useState<TJobPostingForm | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [url, setURL] = useState("");
  const isSubmitDisabled = !url.trim() || isExtracting;
  const isError = Boolean(errorMessage);

  const handleChangeURL: ChangeEventHandler<HTMLInputElement> = (event) => {
    setURL(event.target.value);
    setErrorMessage("");
  };

  const handleReset = () => {
    setURL("");
    setErrorMessage("");
  };

  const handleSaveSuccess = () => {
    setURL("");
    setJobPosting(null);
    setIsModalOpen(false);
  };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const trimmedURL = url.trim();

    if (!trimmedURL) {
      return;
    }

    const parsedURL = jobPostingURLSchema.safeParse(trimmedURL);

    if (!parsedURL.success) {
      setErrorMessage(
        parsedURL.error.issues[0]?.message ?? "URL을 확인해 주세요.",
      );
      return;
    }

    setIsExtracting(true);
    setErrorMessage("");

    try {
      const response = await extractJobPosting(parsedURL.data);

      if (!response.success || !response.data) {
        throw new Error("채용 공고 추출 요청에 실패했습니다.");
      }

      setJobPosting({
        ...response.data,
        url: parsedURL.data,
      });
      setIsModalOpen(true);
    } catch {
      setErrorMessage("채용 공고를 추출하지 못했습니다. 다시 시도해 주세요.");
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <section className="flex min-w-0 flex-1 flex-col items-center justify-center p-6">
      <div className="flex w-full flex-col items-center gap-10">
        <div className="flex max-w-200 flex-col items-center gap-3 text-center">
          <h1 className="bold display40">
            길어지는 취업 준비, 복잡한 관리는 끝
          </h1>
          <p className="display16 medium text-muted-foreground">
            공고 URL만 입력하면, 지원 관리는 모아가 정리합니다.
          </p>
        </div>

        <form
          className="relative flex w-full max-w-160 flex-col gap-6"
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2">
            <div
              className={cn(
                "flex min-h-14 w-full items-end gap-2 rounded-full border border-border bg-background p-2 transition-colors focus-within:border-focus focus-within:ring-1 focus-within:ring-focus",
                isError &&
                  "border-danger focus-within:border-danger focus-within:ring-danger",
              )}
            >
              <input
                className="display16 h-10 min-w-0 flex-1 bg-transparent px-4 text-foreground outline-none placeholder:text-neutral40"
                aria-invalid={isError}
                inputMode="url"
                onChange={handleChangeURL}
                placeholder="채용 공고 URL을 입력해 주세요"
                type="text"
                value={url}
              />
              {isError ? (
                <button
                  aria-label="입력 초기화"
                  className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-danger text-white transition-colors"
                  onClick={handleReset}
                  type="button"
                >
                  <MHIcon icon="x" size={20} />
                </button>
              ) : (
                <button
                  aria-label={
                    isExtracting ? "채용 공고 추출 중" : "채용 공고 추출"
                  }
                  className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-white transition-colors disabled:cursor-not-allowed disabled:bg-disabled-border disabled:text-muted"
                  disabled={isSubmitDisabled}
                  type="submit"
                >
                  <MHIcon icon="arrowUp" size={20} />
                </button>
              )}
            </div>
          </div>
          {errorMessage && (
            <p
              className="display14 absolute top-full pt-2 text-danger"
              role="alert"
            >
              {errorMessage}
            </p>
          )}
        </form>
      </div>

      {isModalOpen && jobPosting && (
        <JobPostingPreviewModal
          isLoggedIn={isAuthenticated}
          jobPosting={jobPosting}
          onClose={() => setIsModalOpen(false)}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
    </section>
  );
};

export default JobPostingExtractor;
