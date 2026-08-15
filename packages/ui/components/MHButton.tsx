import type { MouseEventHandler, ReactNode } from "react";
import cn from "../utils/cn";

const BASE_BUTTON =
  "inline-flex h-11 items-center justify-center whitespace-nowrap rounded-small px-4 py-3 font-medium text-display14 leading-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 cursor-pointer";

interface IMHButtonProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "ghost" | "danger";
}

const MHButton = ({
  children,
  className,
  disabled = false,
  onClick,
  type = "button",
  variant = "primary",
}: IMHButtonProps) => {
  const isDisabled = disabled;

  const buttonClassName = cn(
    BASE_BUTTON,
    variant === "primary" &&
      "bg-primary text-white enabled:hover:bg-primary-hover enabled:active:bg-primary-pressed",
    variant === "secondary" &&
      "border border-border bg-transparent text-foreground enabled:hover:bg-neutral10 enabled:active:bg-neutral20",
    variant === "ghost" &&
      "bg-transparent text-foreground enabled:hover:bg-neutral10 enabled:active:bg-neutral20",
    variant === "danger" &&
      "bg-danger text-white enabled:hover:bg-red80 enabled:active:bg-red100",
    isDisabled &&
      "cursor-not-allowed bg-disabled text-disabled-foreground border-disabled-border",
    isDisabled && variant === "secondary" && "border-0",
    className,
  );

  return (
    <button
      className={buttonClassName}
      disabled={isDisabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};

export default MHButton;
