import MHSlider from "@moah/ui/components/MHSlider";

export const MAX_EXPERIENCE_YEARS = 10;

export interface IExperienceRange {
  maxYears: number;
  minYears: number;
}

interface IExperienceRangeSliderProps extends IExperienceRange {
  onChange: (range: IExperienceRange) => void;
}

const ExperienceRangeSlider = ({
  maxYears,
  minYears,
  onChange,
}: IExperienceRangeSliderProps) => (
  <div className="flex flex-col gap-2 rounded-small bg-field px-4 py-3">
    <div className="display12 medium flex items-center justify-between">
      <span>최소 {minYears === 0 ? "신입 포함" : `${minYears}년`}</span>
      <span>
        최대{" "}
        {maxYears === MAX_EXPERIENCE_YEARS
          ? `${MAX_EXPERIENCE_YEARS}년 이상`
          : `${maxYears}년`}
      </span>
    </div>

    <MHSlider
      ariaLabels={["최소 경력", "최대 경력"]}
      min={0}
      max={MAX_EXPERIENCE_YEARS}
      onValueChange={(value) => {
        const nextMinYears = value[0] ?? minYears;
        const nextMaxYears = value[1] ?? maxYears;

        onChange({
          maxYears: nextMaxYears,
          minYears: nextMinYears,
        });
      }}
      step={1}
      value={[minYears, maxYears]}
    />
    <div className="display12 regular flex justify-between text-muted-foreground">
      <span>0년</span>
      <span>5년</span>
      <span>{MAX_EXPERIENCE_YEARS}년</span>
    </div>
  </div>
);

export default ExperienceRangeSlider;
