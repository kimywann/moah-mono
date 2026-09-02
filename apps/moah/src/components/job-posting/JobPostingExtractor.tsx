import {
  jobPostingURLSchema,
  type TJobPostingForm,
} from "@moah/contracts/schema/job-posting";
import MHIcon from "@moah/ui/components/MHIcon";
import { toast } from "@moah/ui/components/MHToaster";
import cn from "@moah/ui/utils/cn";
import type { ChangeEventHandler, SubmitEventHandler } from "react";
import { useEffect, useState } from "react";
import {
  extractJobPosting,
  getJobPostingExtractionUsage,
} from "@/api/job-posting";
import { useAuth } from "@/contexts/AuthContext";
import JobPostingPreviewModal from "./JobPostingPreviewModal";

const JobPostingExtractor = () => {
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [jobPosting, setJobPosting] = useState<TJobPostingForm | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [remainingExtractionCount, setRemainingExtractionCount] = useState<
    number | null
  >(null);
  const [url, setURL] = useState("");
  const isSubmitDisabled = !url.trim() || isExtracting;
  const isError = Boolean(errorMessage);

  useEffect(() => {
    if (!isAuthenticated) {
      setRemainingExtractionCount(null);
      return;
    }

    const loadExtractionUsage = async () => {
      const response = await getJobPostingExtractionUsage();

      if (response.success && response.data) {
        setRemainingExtractionCount(response.data.remainingCount);
      }
    };

    void loadExtractionUsage();
  }, [isAuthenticated]);

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

    if (!isAuthenticated) {
      toast.error("로그인 후 채용 공고를 분석할 수 있어요.");
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

      if (
        !response.success &&
        response.error?.code === "JOB_POSTING_REQUIRED_INFO_MISSING"
      ) {
        toast.error("공식 채용 페이지 URL만 입력해 주세요.");
        return;
      }

      if (!response.success && response.error?.message) {
        setErrorMessage(response.error.message);
        return;
      }

      if (!response.success || !response.data) {
        throw new Error("채용 공고 추출 요청에 실패했습니다.");
      }

      setJobPosting({
        ...response.data,
        url: parsedURL.data,
      });
      setRemainingExtractionCount((count) =>
        count === null ? null : Math.max(count - 1, 0),
      );
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
            흩어지는 지원 정보, 이제 <span className="text-primary">모아</span>
            {""} 보세요
          </h1>
          <p className="display16 medium text-muted-foreground">
            공고 URL 하나로 지원 현황을 간편하게 관리해요.
          </p>
        </div>

        <form
          className="relative flex w-full max-w-160 flex-col gap-6"
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <p className="display12 flex items-center gap-2 px-4 text-primary">
                <MHIcon icon="info" size={16} />
                공식 채용 페이지 링크만 지원합니다.
              </p>
              {remainingExtractionCount !== null && (
                <p className="display12 px-4 text-muted-foreground">
                  오늘 남은 분석 횟수 {remainingExtractionCount} / 5회
                </p>
              )}
            </div>
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
