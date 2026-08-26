import {
  jobPostingExtractionResponseSchema,
  type TJobPostingForm,
} from "@moah/contracts/schema/job-posting";
import MHIcon from "@moah/ui/components/MHIcon";
import type { ChangeEventHandler, SubmitEventHandler } from "react";
import { useState } from "react";
import JobPostingPreviewModal from "./JobPostingPreviewModal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const JobPostingExtractor = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [jobPosting, setJobPosting] = useState<TJobPostingForm | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [url, setURL] = useState("");
  const isSubmitDisabled = !url.trim() || isExtracting;

  const handleChangeURL: ChangeEventHandler<HTMLInputElement> = (event) => {
    setURL(event.target.value);
  };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (!url.trim()) {
      return;
    }

    setIsExtracting(true);
    setErrorMessage("");

    try {
      if (!API_BASE_URL) {
        throw new Error("API 주소가 설정되지 않았습니다.");
      }

      const response = await fetch(`${API_BASE_URL}/job-postings/extract`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
        }),
      });

      if (!response.ok) {
        throw new Error("채용 공고 추출 요청에 실패했습니다.");
      }

      const responseBody: unknown = await response.json();
      const parsedJobPosting =
        jobPostingExtractionResponseSchema.safeParse(responseBody);

      if (!parsedJobPosting.success) {
        throw new Error("채용 공고 추출 결과가 올바르지 않습니다.");
      }

      setJobPosting({
        ...parsedJobPosting.data,
        url,
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
          className="flex w-full max-w-160 flex-col gap-6"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2">
            <div className="flex min-h-14 w-full items-end gap-2 rounded-full border border-border bg-background p-2 within:ring-focus transition-colors focus-within:border-focus focus-within:ring-1 focus-within:ring-focus">
              <input
                className="display16 h-10 min-w-0 flex-1 bg-transparent px-4 text-foreground outline-none placeholder:text-neutral40"
                onChange={handleChangeURL}
                placeholder="채용 공고 URL을 입력해 주세요"
                type="url"
                value={url}
              />
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
            </div>
            {errorMessage && (
              <p className="display14 text-danger" role="alert">
                {errorMessage}
              </p>
            )}
          </div>
        </form>
      </div>

      {isModalOpen && jobPosting && (
        <JobPostingPreviewModal
          isLoggedIn={false}
          jobPosting={jobPosting}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </section>
  );
};

export default JobPostingExtractor;
