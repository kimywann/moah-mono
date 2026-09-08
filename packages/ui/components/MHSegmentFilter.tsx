import cn from "../utils/cn";

interface ISegmentFilterOption<TValue extends string> {
  label: string;
  value: TValue;
}

interface IMHSegmentFilterProps<TValue extends string> {
  ariaLabel: string;
  className?: string;
  onValueChange: (value: TValue) => void;
  options: ISegmentFilterOption<TValue>[];
  value: TValue;
}

const MHSegmentFilter = <TValue extends string>({
  ariaLabel,
  className,
  onValueChange,
  options,
  value,
}: IMHSegmentFilterProps<TValue>) => {
  return (
    <fieldset
      className={cn(
        "inline-flex w-fit min-w-0 gap-1 rounded-tiny border-0 bg-field p-1",
        className,
      )}
    >
      <legend className="sr-only">{ariaLabel}</legend>
      {options.map((option) => {
        const isSelected = option.value === value;

        return (
          <button
            aria-pressed={isSelected}
            className={cn(
              "medium inline-flex h-8 cursor-pointer items-center justify-center gap-1 rounded-small px-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2",
              isSelected
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-neutral10 hover:text-foreground",
            )}
            key={option.value}
            onClick={() => onValueChange(option.value)}
            type="button"
          >
            <span>{option.label}</span>
          </button>
        );
      })}
    </fieldset>
  );
};

export default MHSegmentFilter;
