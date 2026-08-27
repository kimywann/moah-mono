import MHBadge from "@moah/ui/components/MHBadge";
import MHIcon from "@moah/ui/components/MHIcon";
import { PLATFORM_LABEL } from "@/shared/constants/platform";
import type { IJobPostingList } from "@/shared/type/job-posting";
import { getCareerLabel, getDeadlineLabel } from "@/shared/utils/format";

interface IJobPostingCardProps {
  jobPosting: IJobPostingList;
}

const JobPostingCard = (props: IJobPostingCardProps) => {
  const platformLabel = PLATFORM_LABEL[props.jobPosting.platform];
  const isDeadlineVisible =
    props.jobPosting.deadlineType !== "UNKNOWN" &&
    (props.jobPosting.deadlineType !== "DATE" ||
      props.jobPosting.deadline !== null);

  return (
    <article className="flex min-h-64 flex-col rounded-medium border border-border-subtle bg-background p-6 shadow-xs transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="medium display12 truncate text-muted-foreground">
            {props.jobPosting.companyName ?? "회사명 미정"}
          </p>
          <h2 className="bold display16 mt-2 line-clamp-2 h-12 shrink-0 text-foreground">
            {props.jobPosting.title ?? "제목 미정"}
          </h2>
        </div>

        <MHBadge size="sm" variant="neutral">
          {platformLabel}
        </MHBadge>
      </div>

      <div className="mt-4 mb-4 flex flex-col items-start gap-2">
        <div className="flex gap-2">
          {isDeadlineVisible && (
            <MHBadge size="md" variant="info">
              {getDeadlineLabel(props.jobPosting)}
            </MHBadge>
          )}
          <MHBadge size="md" variant="info">
            {getCareerLabel(props.jobPosting)}
          </MHBadge>
        </div>
        <div className="flex items-center gap-2">
          <MHIcon icon="mapPin" size={16} />
          <span className="regular display12 truncate text-muted-foreground">
            {props.jobPosting.location ?? "근무지 미정"}
          </span>
        </div>
      </div>

      <a
        className="semibold display16 mt-auto inline-flex h-11 w-full items-center justify-center gap-2 rounded-tiny bg-primary px-4 text-white transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
        href={props.jobPosting.url}
        rel="noreferrer"
        target="_blank"
      >
        {platformLabel}에서 지원하기
      </a>
    </article>
  );
};

export default JobPostingCard;
