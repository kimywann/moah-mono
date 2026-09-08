import { APPLICATION_STAGES } from "@moah/shared/constants/application";
import MHBadge from "@moah/ui/components/MHBadge";
import { APPLICATION_STAGE_DISPLAY } from "@/features/applications/model/application.constant";
import type { TApplicationStage } from "@/features/applications/model/application.type";

interface IApplicationStageBadgeProps {
  onStageChange: (stage?: TApplicationStage) => void;
  selectedStage?: TApplicationStage;
  stageCounts: Record<TApplicationStage, number>;
}

const ApplicationStageBadge = (props: IApplicationStageBadgeProps) => {
  return (
    <fieldset className="flex flex-wrap gap-2 border-0 p-0">
      <legend className="sr-only">지원 단계별 현황</legend>
      {APPLICATION_STAGES.map((stage) => {
        const stageDisplay = APPLICATION_STAGE_DISPLAY[stage];

        return (
          <button
            aria-pressed={props.selectedStage === stage}
            className="cursor-pointer rounded-tiny focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
            key={stage}
            onClick={() =>
              props.onStageChange(
                props.selectedStage === stage ? undefined : stage,
              )
            }
            type="button"
          >
            <MHBadge
              className={
                props.selectedStage === stage
                  ? "ring-2 ring-primary ring-offset-1"
                  : undefined
              }
              size="lg"
              variant={stageDisplay.variant}
            >
              {stageDisplay.label} {props.stageCounts[stage]}건
            </MHBadge>
          </button>
        );
      })}
    </fieldset>
  );
};

export default ApplicationStageBadge;
