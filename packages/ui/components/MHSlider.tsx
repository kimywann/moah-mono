import * as Slider from "@radix-ui/react-slider";
import cn from "../utils/cn";

interface IMHSliderProps {
  ariaLabels: string[];
  className?: string;
  max?: number;
  min?: number;
  minStepsBetweenThumbs?: number;
  onValueChange: (value: number[]) => void;
  step?: number;
  value: number[];
}

const MHSlider = ({
  ariaLabels,
  className,
  max,
  min = 0,
  minStepsBetweenThumbs = 0,
  onValueChange,
  step = 1,
  value,
}: IMHSliderProps) => {
  return (
    <Slider.Root
      className={cn(
        "relative flex h-5 w-full touch-none select-none items-center",
        className,
      )}
      max={max}
      min={min}
      minStepsBetweenThumbs={minStepsBetweenThumbs}
      onValueChange={onValueChange}
      step={step}
      value={value}
    >
      <Slider.Track className="relative h-1 grow rounded-full bg-border">
        <Slider.Range className="absolute h-full rounded-full bg-primary" />
      </Slider.Track>
      {value.map((_, index) => (
        <Slider.Thumb
          aria-label={ariaLabels[index]}
          className="block size-5 rounded-full border border-background bg-primary"
          key={index}
        />
      ))}
    </Slider.Root>
  );
};

export default MHSlider;
