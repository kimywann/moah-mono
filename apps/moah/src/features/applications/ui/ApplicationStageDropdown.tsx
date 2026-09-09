import { APPLICATION_STAGES } from "@moah/shared/constants/application";
import MHBadge from "@moah/ui/components/MHBadge";
import MHDropdown, {
  type IMHDropdownOption,
} from "@moah/ui/components/MHDropdown";
import MHIcon from "@moah/ui/components/MHIcon";
import { APPLICATION_STAGE_DISPLAY } from "@/features/applications/model/application.constant";
import type { TApplicationStage } from "@/features/applications/model/application.type";

interface IApplicationStageDropdownProps {
  isUpdate: boolean;
  onChange: (stage: TApplicationStage) => void;
  stage: TApplicationStage;
}

const APPLICATION_STAGE_OPTIONS: IMHDropdownOption<TApplicationStage>[] =
  APPLICATION_STAGES.map((stage) => ({
    label: APPLICATION_STAGE_DISPLAY[stage].label,
    value: stage,
  }));

const ApplicationStageDropdown = ({
  isUpdate,
  onChange,
  stage,
}: IApplicationStageDropdownProps) => {
  const stageDisplay = APPLICATION_STAGE_DISPLAY[stage];

  return (
    <MHDropdown
      onChange={onChange}
      options={APPLICATION_STAGE_OPTIONS}
      trigger={(isOpen) => (
        <button
          aria-label="지원 단계 변경"
          className="cursor-pointer rounded-tiny focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isUpdate}
          type="button"
        >
          <MHBadge
            className="regular"
            icon={
              <MHIcon
                className={isOpen ? "rotate-180" : ""}
                icon="chevronDown"
                size={14}
              />
            }
            size="md"
            variant={stageDisplay.variant}
          >
            {stageDisplay.label}
          </MHBadge>
        </button>
      )}
      value={stage}
    />
  );
};

export default ApplicationStageDropdown;
