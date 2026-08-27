import type { TJobPostingForm } from "@moah/contracts/schema/job-posting";
import MHButton from "@moah/ui/components/MHButton";
import MHIcon from "@moah/ui/components/MHIcon";
import MHInput from "@moah/ui/components/MHInput";
import type { MouseEventHandler } from "react";
import { useNavigate } from "react-router";

interface IJobPostingPreviewModalProps {
  isLoggedIn: boolean;
  jobPosting: TJobPostingForm;
  onClose?: MouseEventHandler<HTMLButtonElement>;
}

const JobPostingPreviewModal = (props: IJobPostingPreviewModalProps) => {
  const navigate = useNavigate();

  const handleSave = () => {
    // TODO: 로그인 사용자의 채용 공고 저장 기능을 구현
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6">
      <div className="flex max-h-[calc(100vh-48px)] w-full max-w-200 flex-col overflow-y-auto rounded-medium bg-background p-8 shadow-xs">
        <div className="flex items-start justify-between gap-6">
          <h2 className="bold display24">추출한 채용 공고를 확인해주세요</h2>

          <button
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            onClick={props.onClose}
            type="button"
          >
            <MHIcon icon="x" size={24} />
          </button>
        </div>

        <div className="mt-8 flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <span className="semibold display14 text-neutral40">기업명</span>
              <MHInput
                isFullWidth
                placeholder="기업명을 입력해 주세요"
                readOnly
                value={props.jobPosting.companyName ?? ""}
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="semibold display14 text-neutral40">포지션</span>
              <MHInput
                isFullWidth
                placeholder="포지션을 입력해 주세요"
                readOnly
                value={props.jobPosting.position ?? ""}
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="semibold display14 text-neutral40">경력</span>
              <MHInput
                isFullWidth
                placeholder="경력 조건을 입력해 주세요"
                readOnly
                value={props.jobPosting.career ?? ""}
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="semibold display14 text-neutral40">
                근무 지역
              </span>
              <MHInput
                isFullWidth
                placeholder="근무 지역을 입력해 주세요"
                readOnly
                value={props.jobPosting.location ?? ""}
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="semibold display14 text-neutral40">
                지원 마감일
              </span>
              <MHInput
                isFullWidth
                readOnly
                type="date"
                value={props.jobPosting.deadline ?? ""}
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="semibold display14 text-neutral40">
                채용 절차
              </span>
              <MHInput
                isFullWidth
                placeholder="채용 절차를 입력해 주세요"
                readOnly
                value={props.jobPosting.hiringProcess.join(" → ")}
              />
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <span className="semibold display14 text-neutral40">
                기술 스택
              </span>
              <MHInput
                isFullWidth
                placeholder="기술 스택을 입력해 주세요"
                readOnly
                value={props.jobPosting.techStacks.join(", ")}
              />
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <span className="semibold display14 text-neutral40">
                채용 공고 URL
              </span>
              <MHInput
                isFullWidth
                placeholder="URL을 입력해 주세요"
                readOnly
                type="url"
                value={props.jobPosting.url}
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          {props.isLoggedIn ? (
            <MHButton isFullWidth onClick={handleSave} size="large">
              공고 저장하기
            </MHButton>
          ) : (
            <MHButton
              isFullWidth
              onClick={() => navigate("/login")}
              size="large"
            >
              로그인 후 저장하기
            </MHButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobPostingPreviewModal;
