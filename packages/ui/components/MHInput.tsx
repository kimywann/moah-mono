import type {
  ChangeEventHandler,
  FocusEventHandler,
  HTMLInputTypeAttribute,
  MouseEventHandler,
} from "react";
import { COMPONENT_CLASS, type TComponentSize } from "../constants/component";
import cn from "../utils/cn";
import MHIcon from "./MHIcon";

const BASE_INPUT =
  "inline-flex w-80 rounded-small border border-border bg-transparent text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-focus focus:ring-2 focus:ring-focus focus:ring-offset-2";

interface IMHInputProps {
  className?: string;
  disabled?: boolean;
  isError?: boolean;
  isFullWidth?: boolean;
  maxLength?: number;
  name?: string;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onClear?: MouseEventHandler<HTMLButtonElement>;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  size?: TComponentSize;
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
  onClear,
  placeholder,
  size = "medium",
  type = "text",
  value,
}: IMHInputProps) => {
  const isDisabled = disabled;
  const isClear = Boolean(value) && Boolean(onClear) && !isDisabled;

  const inputClassName = cn(
    BASE_INPUT,
    COMPONENT_CLASS[size],
    isError && "border-danger focus:border-danger focus:ring-danger",
    isDisabled &&
      "cursor-not-allowed border-disabled-border bg-disabled text-disabled-foreground placeholder:text-disabled-foreground",
    isFullWidth && "w-full",
    isClear && "pr-10",
    className,
  );

  return (
    <div className={cn("relative inline-flex", isFullWidth && "w-full")}>
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
      {isClear && (
        <button
          aria-label="입력 내용 지우기"
          className="absolute right-0 flex h-full w-10 items-center justify-center text-muted-foreground"
          onClick={onClear}
          type="button"
        >
          <MHIcon icon="x" size={16} />
        </button>
      )}
    </div>
  );
};

export default MHInput;
