import MHButton from "@moah/ui/components/MHButton";
import MHIcon from "@moah/ui/components/MHIcon";
import MHInput from "@moah/ui/components/MHInput";
import { useQuery } from "@tanstack/react-query";
import { getApplication } from "@/api/application";
import { PLATFORM_LABEL } from "@/shared/constants/platform";
import type {
  IApplication,
  TApplicationStage,
} from "@/shared/type/application";
import { getCareerLabel, getDeadlineLabel } from "@/shared/utils/format";

interface IApplicationDetailModalProps {
  applicationId: string;
  onClose: () => void;
}

const STAGE_LABEL: Record<TApplicationStage, string> = {
  READY: "지원 준비 중",
  APPLIED: "지원 완료",
  INTERVIEW: "면접",
  PASSED: "합격",
  REJECTED: "불합격",
};

const ApplicationDetailModal = (props: IApplicationDetailModalProps) => {
  const applicationQuery = useQuery({
    queryKey: ["applications", props.applicationId],
    queryFn: async () => {
      const response = await getApplication(props.applicationId);

      if (!response.success || !response.data) {
        throw new Error("지원 정보를 불러오지 못했습니다.");
      }

      return response.data;
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6">
      <div
        aria-labelledby="application-detail-title"
        aria-modal="true"
        className="flex max-h-[calc(100vh-48px)] w-full max-w-200 flex-col overflow-y-auto rounded-medium bg-background p-8 shadow-xs"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-6">
          <h2 className="bold display24" id="application-detail-title">
            지원 공고 상세
          </h2>
          <button
            aria-label="상세 모달 닫기"
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            onClick={props.onClose}
            type="button"
          >
            <MHIcon icon="x" size={24} />
          </button>
        </div>

        <div className="mt-8">
          {applicationQuery.isPending ? (
            <output
              aria-label="지원 정보를 불러오는 중"
              className="flex min-h-82 items-center justify-center"
            >
              <MHIcon
                className="animate-spin text-primary"
                icon="loaderCircle"
              />
            </output>
          ) : applicationQuery.isError || !applicationQuery.data ? (
            <p className="display14 py-12 text-center text-danger" role="alert">
              지원 정보를 불러오지 못했습니다. 다시 시도해 주세요.
            </p>
          ) : (
            <ApplicationDetailContent application={applicationQuery.data} />
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <MHButton onClick={props.onClose} size="large" isFullWidth>
            닫기
          </MHButton>
        </div>
      </div>
    </div>
  );
};

interface IApplicationDetailContentProps {
  application: IApplication;
}

const ApplicationDetailContent = ({
  application,
}: IApplicationDetailContentProps) => {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
      <ApplicationDetailField
        label="기업명"
        value={application.companyName ?? "정보 없음"}
      />
      <ApplicationDetailField
        label="공고명"
        value={application.title ?? "정보 없음"}
      />
      <ApplicationDetailField
        label="포지션"
        value={application.position ?? "정보 없음"}
      />
      <ApplicationDetailField
        label="경력"
        value={getCareerLabel(application)}
      />
      <ApplicationDetailField
        label="근무 지역"
        value={application.location ?? "정보 없음"}
      />
      <ApplicationDetailField
        label="채용 플랫폼"
        value={PLATFORM_LABEL[application.platform]}
      />
      <ApplicationDetailField
        label="지원 단계"
        value={STAGE_LABEL[application.stage]}
      />
      <ApplicationDetailField
        label="지원 마감일"
        value={getDeadlineLabel(application)}
      />
      <ApplicationDetailField
        label="채용 절차"
        value={application.hiringProcess.join(" · ") || "정보 없음"}
      />
      <ApplicationDetailField
        label="기술 스택"
        value={application.techStacks.join(" · ") || "정보 없음"}
      />
      <ApplicationDetailField
        className="sm:col-span-2"
        label="채용 공고 URL"
        type="url"
        value={application.url}
      />
    </div>
  );
};

interface IApplicationDetailFieldProps {
  className?: string;
  label: string;
  type?: "text" | "url";
  value: string;
}

const ApplicationDetailField = (props: IApplicationDetailFieldProps) => {
  return (
    <div className={`flex flex-col gap-2 ${props.className ?? ""}`}>
      <span className="semibold display14 text-neutral40">{props.label}</span>
      <MHInput isFullWidth readOnly type={props.type} value={props.value} />
    </div>
  );
};

export default ApplicationDetailModal;
