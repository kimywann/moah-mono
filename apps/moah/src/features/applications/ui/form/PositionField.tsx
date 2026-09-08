import { JOB_POSTING_POSITIONS } from "@moah/shared/constants/job-posting";
import MHInput from "@moah/ui/components/MHInput";
import MHSelect from "@moah/ui/components/MHSelect";
import type { FocusEventHandler } from "react";
import { useState } from "react";

const CUSTOM_POSITION_VALUE = "CUSTOM";

const POSITION_OPTIONS = [
  { label: "직접 입력", value: CUSTOM_POSITION_VALUE },
  ...JOB_POSTING_POSITIONS.map((position) => ({
    label: position,
    value: position,
  })),
];

interface IPositionFieldProps {
  error?: boolean;
  name?: string;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onChange: (value: string) => void;
  value: string;
}

const PositionField = ({
  error = false,
  name,
  onBlur,
  onChange,
  value,
}: IPositionFieldProps) => {
  const [isCustomPosition, setIsCustomPosition] = useState(
    () =>
      value !== "" &&
      !JOB_POSTING_POSITIONS.some((position) => position === value),
  );

  return (
    <div className="flex flex-col gap-2">
      <MHSelect
        isError={error}
        isFullWidth
        onValueChange={(nextValue) => {
          const isCustom = nextValue === CUSTOM_POSITION_VALUE;

          setIsCustomPosition(isCustom);
          onChange(isCustom ? "" : nextValue);
        }}
        options={POSITION_OPTIONS}
        placeholder="포지션을 선택해 주세요"
        value={isCustomPosition ? CUSTOM_POSITION_VALUE : value || undefined}
        variant="field"
      />
      {isCustomPosition && (
        <MHInput
          isError={error}
          isFullWidth
          name={name}
          onBlur={onBlur}
          onChange={(event) => onChange(event.target.value)}
          placeholder="포지션을 직접 입력해 주세요"
          value={value}
        />
      )}
    </div>
  );
};

export default PositionField;
