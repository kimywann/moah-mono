import { zodResolver } from "@hookform/resolvers/zod";
import {
  JOB_POSTING_DEADLINE_TYPES,
  JOB_POSTING_POSITIONS,
} from "@moah/shared/constants/job-posting";
import MHButton from "@moah/ui/components/MHButton";
import MHIcon from "@moah/ui/components/MHIcon";
import MHInput from "@moah/ui/components/MHInput";
import MHSelect from "@moah/ui/components/MHSelect";
import { toast } from "@moah/ui/components/MHToaster";
import { useQueryClient } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router";
import { createApplication } from "@/api/application";
import {
  DEADLINE_TYPE_LABEL,
  INITIAL_APPLICATION_REGISTER_FORM,
  toJobPostingForm,
} from "@/components/applications/form/application-register.form";
import {
  applicationRegisterFormSchema,
  type TApplicationRegisterForm,
} from "@/components/applications/form/application-register.schema";
import applicationRegisterImage from "@/shared/assets/application-register.webp";

interface IApplicationRegisterModalProps {
  onClose: () => void;
}

const ApplicationRegisterModal = (props: IApplicationRegisterModalProps) => {
  const queryClient = useQueryClient();
  const [isOptionalOpen, setIsOptionalOpen] = useState(false);
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
    watch,
  } = useForm<TApplicationRegisterForm>({
    defaultValues: INITIAL_APPLICATION_REGISTER_FORM,
    resolver: zodResolver(applicationRegisterFormSchema),
  });
  const deadlineType = watch("deadlineType");

  const handleSave = async (form: TApplicationRegisterForm) => {
    const payload = toJobPostingForm(form);

    try {
      const response = await createApplication(payload);

      if (!response.success) {
        throw new Error("지원 정보 저장에 실패했습니다.");
      }

      await queryClient.invalidateQueries({
        queryKey: ["applications"],
      });
      toast.success("지원 목록에 추가했어요.");
      props.onClose();
    } catch {
      toast.error("지원 정보를 저장하지 못했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6">
      <form
        aria-labelledby="application-registration-title"
        aria-modal="true"
        className="flex max-h-[calc(100vh-48px)] w-full max-w-200 flex-col overflow-y-auto rounded-medium bg-background p-8 shadow-xs"
        noValidate
        onSubmit={handleSubmit(handleSave)}
        role="dialog"
      >
        <div className="flex items-start justify-between gap-6">
          <h2 className="bold display24" id="application-registration-title">
            지원 공고 등록
          </h2>
          <button
            aria-label="지원 공고 등록 모달 닫기"
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            onClick={props.onClose}
            type="button"
          >
            <MHIcon icon="x" size={24} />
          </button>
        </div>

        <Link
          className="relative mt-8 flex h-35 cursor-pointer items-center overflow-hidden rounded-small bg-linear-to-r from-brand60 via-brand40 px-5 shadow-xs"
          to="/"
        >
          <div className="relative z-10">
            <p className="semibold display18 text-white">
              공고 URL 하나면 등록 완료
            </p>
            <p className="regular display12 mt-1 text-white/90">
              링크를 붙여넣으면 기업명, 포지션, 마감일을 자동으로 채워드려요.
            </p>
          </div>
          <img
            aria-hidden
            className="-top-1 absolute right-5 size-40 object-contain"
            src={applicationRegisterImage}
          />
        </Link>

        <div className="mt-8">
          <h3 className="bold display18">필수 입력</h3>
          <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
            <Controller
              control={control}
              name="companyName"
              render={({ field }) => (
                <RegistrationField
                  error={errors.companyName?.message}
                  label="기업명"
                >
                  <MHInput
                    isError={Boolean(errors.companyName)}
                    isFullWidth
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    value={field.value}
                  />
                </RegistrationField>
              )}
            />
            <Controller
              control={control}
              name="position"
              render={({ field }) => (
                <RegistrationField
                  error={errors.position?.message}
                  label="포지션"
                >
                  <MHSelect
                    isError={Boolean(errors.position)}
                    isFullWidth
                    onValueChange={field.onChange}
                    options={JOB_POSTING_POSITIONS.map((position) => ({
                      label: position,
                      value: position,
                    }))}
                    placeholder="포지션을 선택해 주세요"
                    value={field.value || undefined}
                    variant="field"
                  />
                </RegistrationField>
              )}
            />
            <Controller
              control={control}
              name="url"
              render={({ field }) => (
                <RegistrationField
                  className="sm:col-span-2"
                  error={errors.url?.message}
                  label="채용 공고 URL"
                >
                  <MHInput
                    isError={Boolean(errors.url)}
                    isFullWidth
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    type="url"
                    value={field.value}
                  />
                </RegistrationField>
              )}
            />
          </div>
        </div>

        <div className="mt-8 border-border-subtle border-t pt-8">
          <button
            aria-expanded={isOptionalOpen}
            className="flex w-full cursor-pointer items-center justify-between rounded-small text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
            onClick={() => setIsOptionalOpen((previous) => !previous)}
            type="button"
          >
            <h3 className="bold display18">선택 입력</h3>
            <MHIcon
              className={isOptionalOpen ? "rotate-180" : ""}
              icon="chevronDown"
              size={20}
            />
          </button>
          {isOptionalOpen && (
            <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
              <Controller
                control={control}
                name="title"
                render={({ field }) => (
                  <RegistrationField
                    error={errors.title?.message}
                    label="공고명"
                  >
                    <MHInput
                      isError={Boolean(errors.title)}
                      isFullWidth
                      name={field.name}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </RegistrationField>
                )}
              />
              <Controller
                control={control}
                name="location"
                render={({ field }) => (
                  <RegistrationField
                    error={errors.location?.message}
                    label="근무 지역"
                  >
                    <MHInput
                      isError={Boolean(errors.location)}
                      isFullWidth
                      name={field.name}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </RegistrationField>
                )}
              />
              <Controller
                control={control}
                name="minYears"
                render={({ field }) => (
                  <RegistrationField
                    error={errors.minYears?.message}
                    label="최소 경력"
                  >
                    <MHInput
                      isError={Boolean(errors.minYears)}
                      isFullWidth
                      name={field.name}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      type="number"
                      value={field.value}
                    />
                  </RegistrationField>
                )}
              />
              <Controller
                control={control}
                name="maxYears"
                render={({ field }) => (
                  <RegistrationField
                    error={errors.maxYears?.message}
                    label="최대 경력"
                  >
                    <MHInput
                      isError={Boolean(errors.maxYears)}
                      isFullWidth
                      name={field.name}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      type="number"
                      value={field.value}
                    />
                  </RegistrationField>
                )}
              />
              <Controller
                control={control}
                name="deadlineType"
                render={({ field }) => (
                  <RegistrationField
                    error={errors.deadlineType?.message}
                    label="마감 방식"
                  >
                    <MHSelect
                      isError={Boolean(errors.deadlineType)}
                      isFullWidth
                      onValueChange={(value) => {
                        field.onChange(value);
                        if (value !== "DATE") {
                          setValue("deadline", "");
                        }
                      }}
                      options={JOB_POSTING_DEADLINE_TYPES.map(
                        (deadlineType) => ({
                          label: DEADLINE_TYPE_LABEL[deadlineType],
                          value: deadlineType,
                        }),
                      )}
                      placeholder="마감 방식을 선택해 주세요"
                      value={field.value}
                      variant="field"
                    />
                  </RegistrationField>
                )}
              />
              {deadlineType === "DATE" && (
                <Controller
                  control={control}
                  name="deadline"
                  render={({ field }) => (
                    <RegistrationField
                      error={errors.deadline?.message}
                      label="지원 마감일"
                    >
                      <MHInput
                        isError={Boolean(errors.deadline)}
                        isFullWidth
                        name={field.name}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                        type="date"
                        value={field.value}
                      />
                    </RegistrationField>
                  )}
                />
              )}
              <Controller
                control={control}
                name="hiringProcess"
                render={({ field }) => (
                  <RegistrationField
                    error={errors.hiringProcess?.message}
                    label="채용 절차"
                  >
                    <MHInput
                      isError={Boolean(errors.hiringProcess)}
                      isFullWidth
                      name={field.name}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      placeholder="쉼표로 구분해 입력해 주세요"
                      value={field.value}
                    />
                  </RegistrationField>
                )}
              />
              <Controller
                control={control}
                name="techStacks"
                render={({ field }) => (
                  <RegistrationField
                    error={errors.techStacks?.message}
                    label="기술 스택"
                  >
                    <MHInput
                      isError={Boolean(errors.techStacks)}
                      isFullWidth
                      name={field.name}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      placeholder="쉼표로 구분해 입력해 주세요"
                      value={field.value}
                    />
                  </RegistrationField>
                )}
              />
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <MHButton
            onClick={props.onClose}
            size="large"
            variant="secondary"
            isFullWidth
          >
            취소
          </MHButton>
          <MHButton
            disabled={isSubmitting}
            size="large"
            type="submit"
            isFullWidth
          >
            {isSubmitting ? "등록 중..." : "등록하기"}
          </MHButton>
        </div>
      </form>
    </div>
  );
};

interface IRegistrationFieldProps {
  children: ReactNode;
  className?: string;
  error?: string;
  label: string;
}

const RegistrationField = (props: IRegistrationFieldProps) => {
  return (
    <div className={`flex flex-col gap-2 ${props.className ?? ""}`}>
      <span className="semibold display14 text-neutral40">{props.label}</span>
      {props.children}
      {props.error && (
        <p className="display12 text-danger" role="alert">
          {props.error}
        </p>
      )}
    </div>
  );
};

export default ApplicationRegisterModal;
