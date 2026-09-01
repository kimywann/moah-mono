import { APPLICATION_STAGES } from "@moah/shared/constants/application";
import MHBadge from "@moah/ui/components/MHBadge";
import { STAGE_DISPLAY } from "@/shared/constants/application-stage";
import type {
  IApplicationList,
  TApplicationStage,
} from "@/shared/type/application";

interface IApplicationStageBadgeProps {
  applications: IApplicationList[];
}

const getStageCounts = (applications: IApplicationList[]) => {
  const counts: Record<TApplicationStage, number> = {
    READY: 0,
    APPLIED: 0,
    INTERVIEW: 0,
    PASSED: 0,
    REJECTED: 0,
  };

  for (const application of applications) {
    counts[application.stage] += 1;
  }

  return counts;
};

const ApplicationStageBadge = (props: IApplicationStageBadgeProps) => {
  const stageCounts = getStageCounts(props.applications);

  return (
    <fieldset className="flex flex-wrap gap-2 border-0 p-0">
      <legend className="sr-only">지원 단계별 현황</legend>
      {APPLICATION_STAGES.map((stage) => {
        const stageDisplay = STAGE_DISPLAY[stage];

        return (
          <MHBadge key={stage} size="lg" variant={stageDisplay.variant}>
            {stageDisplay.label} {stageCounts[stage]}건
          </MHBadge>
        );
      })}
    </fieldset>
  );
};

export default ApplicationStageBadge;
