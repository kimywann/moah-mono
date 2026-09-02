import * as Select from "@radix-ui/react-select";
import { COMPONENT_CLASS, type TComponentSize } from "../constants/component";
import cn from "../utils/cn";
import MHIcon from "./MHIcon";

interface ISelectOption {
  label: string;
  value: string;
}

interface IMHSelectProps {
  disabled?: boolean;
  isError?: boolean;
  isFullWidth?: boolean;
  onValueChange: (value: string) => void;
  options: ISelectOption[];
  placeholder: string;
  size?: TComponentSize;
  value?: string;
  variant?: "default" | "field";
}

const MHSelect = ({
  disabled = false,
  isError = false,
  isFullWidth = false,
  onValueChange,
  options,
  placeholder,
  size = "medium",
  value,
  variant = "default",
}: IMHSelectProps) => {
  const triggerClassName = cn(
    "inline-flex w-80 items-center justify-between rounded-small text-foreground outline-none transition-colors data-placeholder:text-muted-foreground focus:ring-2 focus:ring-focus focus:ring-offset-2 disabled:cursor-not-allowed disabled:border-disabled-border disabled:bg-disabled disabled:text-disabled-foreground",
    COMPONENT_CLASS[size],
    variant === "default" && "border border-border bg-transparent",
    variant === "field" &&
      "semibold cursor-pointer bg-field focus:border-focus",
    isError && "border-danger focus:ring-danger",
    isFullWidth && "w-full",
  );

  return (
    <Select.Root
      disabled={disabled}
      value={value}
      onValueChange={onValueChange}
    >
      <Select.Trigger
        aria-invalid={isError || undefined}
        className={triggerClassName}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <MHIcon icon="chevronDown" size={16} />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="z-50 w-(--radix-select-trigger-width) overflow-hidden rounded-small border border-border bg-background p-1 text-foreground shadow-lg"
          position="popper"
          sideOffset={4}
        >
          <Select.Viewport className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <Select.Item
                className={cn(
                  COMPONENT_CLASS[size],
                  "relative flex cursor-pointer select-none items-center rounded-small pr-8 pl-4 outline-none data-highlighted:bg-muted data-[state=checked]:text-primary",
                )}
                key={option.value}
                value={option.value}
              >
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator className="absolute right-3">
                  <MHIcon icon="check" size={14} />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default MHSelect;
