import type { TJobPostingForm } from "@moah/contracts/schema/job-posting";
import MHButton from "@moah/ui/components/MHButton";
import MHIcon from "@moah/ui/components/MHIcon";
import MHInput from "@moah/ui/components/MHInput";
import { toast } from "@moah/ui/components/MHToaster";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import { saveJobPosting } from "@/api/job-posting";

interface IJobPostingPreviewModalProps {
  isLoggedIn: boolean;
  jobPosting: TJobPostingForm;
  onClose?: () => void;
  onSaveSuccess: () => void;
}

const JobPostingPreviewModal = (props: IJobPostingPreviewModalProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const careerValue =
    props.jobPosting.minYears === null && props.jobPosting.maxYears === null
      ? "경력 조건 미정"
      : props.jobPosting.minYears === 0 && props.jobPosting.maxYears === 0
        ? "신입"
        : props.jobPosting.minYears === 0 && props.jobPosting.maxYears === null
          ? "경력 무관"
          : props.jobPosting.maxYears === null
            ? `경력 ${props.jobPosting.minYears}년 이상`
            : props.jobPosting.minYears === props.jobPosting.maxYears
              ? `경력 ${props.jobPosting.minYears}년`
              : `경력 ${props.jobPosting.minYears}~${props.jobPosting.maxYears}년`;
  const deadlineValue =
    props.jobPosting.deadlineType === "ROLLING"
      ? "상시 채용"
      : props.jobPosting.deadlineType === "UNTIL_FILLED"
        ? "채용 시 마감"
        : props.jobPosting.deadlineType === "UNKNOWN"
          ? "마감 정보 없음"
          : (props.jobPosting.deadline ?? "마감 정보 없음");
  const isDateDeadline = props.jobPosting.deadlineType === "DATE";

  const handleSave = async () => {
    if (isSaving) {
      return;
    }

    try {
      setIsSaving(true);

      const response = await saveJobPosting(props.jobPosting);

      if (!response.success) {
        throw new Error("공고 저장에 실패했습니다.");
      }

      await queryClient.invalidateQueries({
        queryKey: ["applications"],
      });

      toast.success("지원 목록에 추가했어요.");
      props.onSaveSuccess();
    } catch {
      toast.error("공고를 저장하지 못했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSaving(false);
    }
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
                value={careerValue}
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
                type={isDateDeadline ? "date" : "text"}
                value={deadlineValue}
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
            <MHButton
              disabled={isSaving}
              isFullWidth
              onClick={handleSave}
              size="large"
            >
              {isSaving ? "공고 저장 중..." : "공고 저장하기"}
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
