import { formatDateTime } from "@moah/shared/utils/format";
import MHBadge from "@moah/ui/components/MHBadge";
import MHIcon from "@moah/ui/components/MHIcon";
import { RESUME_TYPE_LABEL } from "@/features/resume/model/resume.constant";
import type { IResume } from "@/features/resume/model/resume.type";

interface IResumeListProps {
  isDeleting: boolean;
  onDeleteClick: (resume: IResume) => void;
  onPreviewClick: (resume: IResume) => void;
  resumes: IResume[];
}

const ResumeList = ({
  isDeleting,
  onDeleteClick,
  onPreviewClick,
  resumes,
}: IResumeListProps) => {
  if (resumes.length === 0) {
    return (
      <p className="rounded-small border border-neutral10 px-4 py-12 text-center text-muted-foreground">
        등록된 파일이 없어요. 첫 파일을 업로드해 보세요!
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border-subtle rounded-medium border border-neutral10 bg-background">
      {resumes.map((resume) => {
        const [firstLinkedApplication] = resume.linkedApplications;
        const additionalApplicationCount = resume.linkedApplications.length - 1;
        const linkedApplicationLabel = firstLinkedApplication
          ? [firstLinkedApplication.companyName, firstLinkedApplication.title]
              .filter(Boolean)
              .join(" · ") || "공고 정보 없음"
          : "연결된 공고 없음";

        return (
          <li className="p-4" key={resume.id}>
            <div className="flex min-w-0 items-start gap-3">
              <button
                aria-label={`${resume.name} 미리보기`}
                className="flex min-w-0 flex-1 cursor-pointer items-start gap-3 rounded-small text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                onClick={() => onPreviewClick(resume)}
                type="button"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-small bg-muted text-muted-foreground">
                  <MHIcon icon="fileText" size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="display14 semibold block truncate">
                    {resume.name}
                  </span>
                  <span className="mt-2 flex items-center gap-2">
                    <MHBadge size="sm">
                      {RESUME_TYPE_LABEL[resume.resumeType]}
                    </MHBadge>
                    <span className="display12 text-muted-foreground">
                      {resume.fileFormat}
                    </span>
                  </span>
                </span>
              </button>

              <button
                aria-label={`${resume.name} 삭제`}
                className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-small text-danger transition-colors hover:bg-tintRed disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isDeleting}
                onClick={() => onDeleteClick(resume)}
                type="button"
              >
                <MHIcon icon="trash2" size={18} />
              </button>
            </div>

            <dl className="display12 mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-muted-foreground">
              <dt>업로드</dt>
              <dd className="truncate text-foreground">
                {formatDateTime(resume.createdAt).slice(0, 10)}
              </dd>
              <dt>연결 공고</dt>
              <dd className="truncate text-foreground">
                {linkedApplicationLabel}
                {additionalApplicationCount > 0 &&
                  ` 외 ${additionalApplicationCount}건`}
              </dd>
            </dl>
          </li>
        );
      })}
    </ul>
  );
};

export default ResumeList;
