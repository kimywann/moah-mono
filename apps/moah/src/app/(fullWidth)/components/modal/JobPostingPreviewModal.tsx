"use client";

import MHButton from "@moah/ui/components/MHButton";
import MHIcon from "@moah/ui/components/MHIcon";
import MHInput from "@moah/ui/components/MHInput";
import type { MouseEventHandler } from "react";

interface IJobPostingPreviewModalProps {
  onClose?: MouseEventHandler<HTMLButtonElement>;
  onSave?: MouseEventHandler<HTMLButtonElement>;
}

const JobPostingPreviewModal = (props: IJobPostingPreviewModalProps) => {
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
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="semibold display14 text-neutral40">포지션</span>
              <MHInput
                isFullWidth
                placeholder="포지션을 입력해 주세요"
                readOnly
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="semibold display14 text-neutral40">경력</span>
              <MHInput
                isFullWidth
                placeholder="경력 조건을 입력해 주세요"
                readOnly
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
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="semibold display14 text-neutral40">
                지원 마감일
              </span>
              <MHInput isFullWidth name="deadline" readOnly type="date" />
            </div>

            <div className="flex flex-col gap-2">
              <span className="semibold display14 text-neutral40">
                채용 절차
              </span>
              <MHInput
                isFullWidth
                placeholder="채용 절차를 입력해 주세요"
                readOnly
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
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <MHButton isFullWidth onClick={props.onSave} size="large">
            공고 저장하기
          </MHButton>
        </div>
      </div>
    </div>
  );
};

export default JobPostingPreviewModal;
