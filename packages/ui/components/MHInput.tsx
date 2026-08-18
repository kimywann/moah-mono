import type {
  ChangeEventHandler,
  FocusEventHandler,
  HTMLInputTypeAttribute,
} from "react";

import cn from "../utils/cn";

const BASE_INPUT =
  "inline-flex rounded-small border border-border bg-transparent px-4 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-focus focus:ring-2 focus:ring-focus focus:ring-offset-2";

interface IMHInputProps {
  className?: string;
  disabled?: boolean;
  isError?: boolean;
  isFullWidth?: boolean;
  maxLength?: number;
  name?: string;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  size?: "xSmall" | "small" | "medium" | "large" | "xLarge";
  type?: HTMLInputTypeAttribute;
  value?: string;
}

const MHInput = ({
  className,
  disabled = false,
  isError = false,
  isFullWidth = false,
  maxLength,
  name,
  onBlur,
  onChange,
  placeholder,
  size = "medium",
  type = "text",
  value,
}: IMHInputProps) => {
  const isDisabled = disabled;

  const inputClassName = cn(
    BASE_INPUT,
    size === "xSmall" && "h-6 px-2 display10",
    size === "small" && "h-8 px-3 display12",
    size === "medium" && "h-11 px-4 display16",
    size === "large" && "h-12 px-5 display18",
    size === "xLarge" && "h-14 px-6 display20",
    isError && "border-danger focus:border-danger focus:ring-danger",
    isDisabled &&
      "cursor-not-allowed border-disabled-border bg-disabled text-disabled-foreground placeholder:text-disabled-foreground",
    isFullWidth && "w-full",
    className,
  );

  return (
    <input
      aria-invalid={isError || undefined}
      className={inputClassName}
      disabled={isDisabled}
      maxLength={maxLength}
      name={name}
      onBlur={onBlur}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      value={value}
    />
  );
};

export default MHInput;
