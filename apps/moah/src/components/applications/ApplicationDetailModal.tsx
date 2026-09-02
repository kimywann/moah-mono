import type { TApplicationUpdate } from "@moah/contracts/schema/application";
import { APPLICATION_STAGES } from "@moah/shared/constants/application";
import {
  JOB_POSTING_DEADLINE_TYPES,
  JOB_POSTING_POSITIONS,
} from "@moah/shared/constants/job-posting";
import MHButton from "@moah/ui/components/MHButton";
import MHIcon from "@moah/ui/components/MHIcon";
import MHInput from "@moah/ui/components/MHInput";
import MHSelect from "@moah/ui/components/MHSelect";
import { toast } from "@moah/ui/components/MHToaster";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type ReactNode, useEffect, useState } from "react";
import { getApplication, updateApplication } from "@/api/application";
import { DEADLINE_TYPE_LABEL } from "@/components/applications/form/application-register.form";
import { PLATFORM_LABEL } from "@/shared/constants/platform";
import type {
  IApplication,
  TApplicationStage,
  TJobPostingDeadlineType,
} from "@/shared/type/application";

interface IApplicationDetailModalProps {
  applicationId: string;
  onClose: () => void;
}

interface IApplicationEditForm {
  companyName: string;
  deadline: string;
  deadlineType: TJobPostingDeadlineType;
  hiringProcess: string;
  location: string;
  maxYears: string;
  minYears: string;
  position: NonNullable<TApplicationUpdate["position"]> | "";
  stage: TApplicationStage;
  techStacks: string;
}

const STAGE_LABEL: Record<TApplicationStage, string> = {
  READY: "지원 준비 중",
  APPLIED: "지원 완료",
  INTERVIEW: "면접",
  PASSED: "합격",
  REJECTED: "불합격",
};

const splitValues = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const toNullableNumber = (value: string) =>
  value.trim() ? Number(value) : null;

const toEditForm = (application: IApplication): IApplicationEditForm => ({
  companyName: application.companyName ?? "",
  deadline: application.deadline?.slice(0, 10) ?? "",
  deadlineType: application.deadlineType,
  hiringProcess: application.hiringProcess.join(", "),
  location: application.location ?? "",
  maxYears: application.maxYears?.toString() ?? "",
  minYears: application.minYears?.toString() ?? "",
  position: (application.position as IApplicationEditForm["position"]) ?? "",
  stage: application.stage,
  techStacks: application.techStacks.join(", "),
});

const ApplicationDetailModal = (props: IApplicationDetailModalProps) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<IApplicationEditForm | null>(null);
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

  useEffect(() => {
    if (applicationQuery.data) {
      setForm(toEditForm(applicationQuery.data));
    }
  }, [applicationQuery.data]);

  const updateApplicationMutation = useMutation({
    mutationFn: async (updateData: TApplicationUpdate) => {
      const response = await updateApplication(props.applicationId, updateData);

      if (!response.success || !response.data) {
        throw new Error("지원 정보 수정에 실패했습니다.");
      }

      return response.data;
    },
    onError: () => {
      toast.error("지원 정보를 수정하지 못했습니다. 다시 시도해 주세요.");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("지원 정보를 수정했어요.");
      props.onClose();
    },
  });

  const handleFormChange = <TKey extends keyof IApplicationEditForm>(
    key: TKey,
    value: IApplicationEditForm[TKey],
  ) => {
    setForm((previous) =>
      previous ? { ...previous, [key]: value } : previous,
    );
  };

  const handleSubmit = () => {
    if (!form) return;

    if (
      !/^\d*$/.test(form.minYears.trim()) ||
      !/^\d*$/.test(form.maxYears.trim())
    ) {
      toast.error("경력은 0 이상의 정수로 입력해 주세요.");
      return;
    }

    updateApplicationMutation.mutate({
      companyName: form.companyName.trim() || null,
      deadline: form.deadlineType === "DATE" ? form.deadline || null : null,
      deadlineType: form.deadlineType,
      hiringProcess: splitValues(form.hiringProcess),
      location: form.location.trim() || null,
      maxYears: toNullableNumber(form.maxYears),
      minYears: toNullableNumber(form.minYears),
      position: form.position || null,
      stage: form.stage,
      techStacks: splitValues(form.techStacks),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6">
      <form
        aria-labelledby="application-detail-title"
        aria-modal="true"
        className="flex max-h-[calc(100vh-48px)] w-full max-w-200 flex-col overflow-y-auto rounded-medium bg-background p-8 shadow-xs"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
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
          ) : applicationQuery.isError || !applicationQuery.data || !form ? (
            <p className="display14 py-12 text-center text-danger" role="alert">
              지원 정보를 불러오지 못했습니다. 다시 시도해 주세요.
            </p>
          ) : (
            <ApplicationDetailContent
              application={applicationQuery.data}
              form={form}
              onChange={handleFormChange}
            />
          )}
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <MHButton
            isFullWidth
            onClick={props.onClose}
            size="large"
            type="button"
            variant="secondary"
          >
            돌아가기
          </MHButton>
          <MHButton
            disabled={!form || updateApplicationMutation.isPending}
            isFullWidth
            size="large"
            type="submit"
          >
            {updateApplicationMutation.isPending ? "수정 중..." : "수정하기"}
          </MHButton>
        </div>
      </form>
    </div>
  );
};

interface IApplicationDetailContentProps {
  application: IApplication;
  form: IApplicationEditForm;
  onChange: <TKey extends keyof IApplicationEditForm>(
    key: TKey,
    value: IApplicationEditForm[TKey],
  ) => void;
}

const ApplicationDetailContent = ({
  application,
  form,
  onChange,
}: IApplicationDetailContentProps) => (
  <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
    <ApplicationDetailField label="기업명">
      <MHInput
        isFullWidth
        onChange={(event) => onChange("companyName", event.target.value)}
        value={form.companyName}
      />
    </ApplicationDetailField>
    <ApplicationDetailField label="공고명">
      <MHInput isFullWidth readOnly value={application.title ?? "정보 없음"} />
    </ApplicationDetailField>
    <ApplicationDetailField label="포지션">
      <MHSelect
        isFullWidth
        onValueChange={(value) =>
          onChange("position", value as IApplicationEditForm["position"])
        }
        options={JOB_POSTING_POSITIONS.map((position) => ({
          label: position,
          value: position,
        }))}
        placeholder="포지션을 선택해 주세요"
        value={form.position || undefined}
        variant="field"
      />
    </ApplicationDetailField>
    <ApplicationDetailField label="경력">
      <div className="flex gap-2">
        <MHInput
          isFullWidth
          onChange={(event) => onChange("minYears", event.target.value)}
          placeholder="최소 경력"
          type="number"
          value={form.minYears}
        />
        <MHInput
          isFullWidth
          onChange={(event) => onChange("maxYears", event.target.value)}
          placeholder="최대 경력"
          type="number"
          value={form.maxYears}
        />
      </div>
    </ApplicationDetailField>
    <ApplicationDetailField label="근무 지역">
      <MHInput
        isFullWidth
        onChange={(event) => onChange("location", event.target.value)}
        value={form.location}
      />
    </ApplicationDetailField>
    <ApplicationDetailField label="채용 플랫폼">
      <MHInput
        isFullWidth
        readOnly
        value={PLATFORM_LABEL[application.platform]}
      />
    </ApplicationDetailField>
    <ApplicationDetailField label="지원 단계">
      <MHSelect
        isFullWidth
        onValueChange={(value) => onChange("stage", value as TApplicationStage)}
        options={APPLICATION_STAGES.map((stage) => ({
          label: STAGE_LABEL[stage],
          value: stage,
        }))}
        placeholder="지원 단계를 선택해 주세요"
        value={form.stage}
        variant="field"
      />
    </ApplicationDetailField>
    <ApplicationDetailField label="마감 방식">
      <MHSelect
        isFullWidth
        onValueChange={(value) =>
          onChange("deadlineType", value as TJobPostingDeadlineType)
        }
        options={JOB_POSTING_DEADLINE_TYPES.map((deadlineType) => ({
          label: DEADLINE_TYPE_LABEL[deadlineType],
          value: deadlineType,
        }))}
        placeholder="마감 방식을 선택해 주세요"
        value={form.deadlineType}
        variant="field"
      />
    </ApplicationDetailField>
    {form.deadlineType === "DATE" && (
      <ApplicationDetailField label="지원 마감일">
        <MHInput
          isFullWidth
          onChange={(event) => onChange("deadline", event.target.value)}
          type="date"
          value={form.deadline}
        />
      </ApplicationDetailField>
    )}
    <ApplicationDetailField label="채용 절차">
      <MHInput
        isFullWidth
        onChange={(event) => onChange("hiringProcess", event.target.value)}
        placeholder="쉼표로 구분해 입력해 주세요"
        value={form.hiringProcess}
      />
    </ApplicationDetailField>
    <ApplicationDetailField label="기술 스택">
      <MHInput
        isFullWidth
        onChange={(event) => onChange("techStacks", event.target.value)}
        placeholder="쉼표로 구분해 입력해 주세요"
        value={form.techStacks}
      />
    </ApplicationDetailField>
    <ApplicationDetailField className="sm:col-span-2" label="채용 공고 URL">
      <MHInput isFullWidth readOnly type="url" value={application.url} />
    </ApplicationDetailField>
  </div>
);

interface IApplicationDetailFieldProps {
  children: ReactNode;
  className?: string;
  label: string;
}

const ApplicationDetailField = (props: IApplicationDetailFieldProps) => (
  <div className={`flex flex-col gap-2 ${props.className ?? ""}`}>
    <span className="semibold display14 text-neutral40">{props.label}</span>
    {props.children}
  </div>
);

export default ApplicationDetailModal;
