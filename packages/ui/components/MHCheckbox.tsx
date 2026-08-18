import type { ChangeEventHandler } from "react";
import cn from "../utils/cn";
import MHIcon from "./MHIcon";

const BASE_CHECKBOX =
  "peer absolute inset-0 size-full cursor-pointer opacity-0 disabled:pointer-events-none";

const BASE_CHECKBOX_INDICATOR =
  "pointer-events-none flex disabled:cursor-not-allowed size-5 items-center justify-center rounded-md border border-border bg-background text-white  peer-focus-visible:ring-focus peer-focus-visible:ring-offset-2 peer-checked:border-primary peer-checked:bg-primary peer-disabled:border-disabled-border peer-disabled:bg-disabled";

interface IMHCheckboxProps {
  isChecked?: boolean;
  className?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

const MHCheckbox = ({
  isChecked,
  className,
  disabled = false,
  id,
  name,
  onChange,
}: IMHCheckboxProps) => {
  const isDisabled = disabled;

  return (
    <span className={cn("relative inline-flex size-5", className)}>
      <input
        checked={isChecked}
        className={BASE_CHECKBOX}
        disabled={isDisabled}
        id={id}
        name={name}
        onChange={onChange}
        type="checkbox"
      />
      <span aria-hidden className={BASE_CHECKBOX_INDICATOR}>
        <MHIcon icon="check" size={14} strokeWidth={4} />
      </span>
    </span>
  );
};

export default MHCheckbox;
