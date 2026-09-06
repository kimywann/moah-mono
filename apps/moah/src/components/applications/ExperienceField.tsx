import MHSelect from "@moah/ui/components/MHSelect";
import ExperienceRangeSlider, {
  MAX_EXPERIENCE_YEARS,
} from "./ExperienceRangeSlider";

type TExperienceType = "NEW_GRAD" | "NO_LIMIT" | "CUSTOM";

interface IExperienceFieldProps {
  maxYears: string;
  minYears: string;
  onChange: (range: IExperienceRange) => void;
}

interface IExperienceRange {
  maxYears: string;
  minYears: string;
}

const EXPERIENCE_TYPE_OPTIONS = [
  { label: "신입", value: "NEW_GRAD" },
  { label: "경력 무관", value: "NO_LIMIT" },
  { label: "직접 입력", value: "CUSTOM" },
] as const;

const toSliderValue = (value: string, fallback: number) => {
  if (!value.trim()) {
    return fallback;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue)
    ? Math.min(Math.max(parsedValue, 0), MAX_EXPERIENCE_YEARS)
    : fallback;
};

const getExperienceType = (
  minYears: string,
  maxYears: string,
): TExperienceType => {
  if (minYears === "0" && maxYears === "0") {
    return "NEW_GRAD";
  }

  if (minYears === "0" && maxYears === "") {
    return "NO_LIMIT";
  }

  if (!minYears.trim() && !maxYears.trim()) {
    return "NO_LIMIT";
  }

  return "CUSTOM";
};

const ExperienceField = ({
  maxYears,
  minYears,
  onChange,
}: IExperienceFieldProps) => {
  const experienceType = getExperienceType(minYears, maxYears);

  const handleExperienceTypeChange = (nextExperienceType: TExperienceType) => {
    if (nextExperienceType === "NEW_GRAD") {
      onChange({ maxYears: "0", minYears: "0" });
      return;
    }

    if (nextExperienceType === "NO_LIMIT") {
      onChange({ maxYears: "", minYears: "0" });
      return;
    }

    onChange({
      maxYears:
        experienceType === "CUSTOM"
          ? maxYears
          : MAX_EXPERIENCE_YEARS.toString(),
      minYears: experienceType === "CUSTOM" ? minYears : "0",
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <MHSelect
        isFullWidth
        onValueChange={(value) =>
          handleExperienceTypeChange(value as TExperienceType)
        }
        options={EXPERIENCE_TYPE_OPTIONS.map((option) => ({
          label: option.label,
          value: option.value,
        }))}
        placeholder="경력을 선택해 주세요"
        value={experienceType}
        variant="field"
      />
      {experienceType === "CUSTOM" && (
        <ExperienceRangeSlider
          maxYears={toSliderValue(maxYears, MAX_EXPERIENCE_YEARS)}
          minYears={toSliderValue(minYears, 0)}
          onChange={(range) =>
            onChange({
              maxYears:
                range.maxYears === MAX_EXPERIENCE_YEARS
                  ? ""
                  : range.maxYears.toString(),
              minYears: range.minYears.toString(),
            })
          }
        />
      )}
    </div>
  );
};

export default ExperienceField;
