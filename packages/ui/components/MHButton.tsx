import type { MouseEventHandler, ReactNode } from "react";
import { COMPONENT_CLASS, type TComponentSize } from "../constants/component";
import cn from "../utils/cn";

const BASE_BUTTON =
  "inline-flex semibold items-center justify-center whitespace-nowrap medium rounded-small leading-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 cursor-pointer";

interface IMHButtonProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  size?: TComponentSize;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "ghost" | "danger";
  isFullWidth?: boolean;
}

const MHButton = ({
  children,
  className,
  disabled = false,
  onClick,
  size = "medium",
  type = "button",
  variant = "primary",
  isFullWidth = false,
}: IMHButtonProps) => {
  const isDisabled = disabled;

  const buttonClassName = cn(
    BASE_BUTTON,
    COMPONENT_CLASS[size],
    variant === "primary" &&
      "bg-primary text-white enabled:hover:bg-primary-hover",
    variant === "secondary" &&
      "border border-border bg-transparent text-foreground enabled:hover:bg-neutral10",
    variant === "ghost" &&
      "bg-transparent text-foreground enabled:hover:bg-neutral10",
    variant === "danger" && "bg-danger text-white enabled:hover:bg-red80",
    isDisabled &&
      "cursor-not-allowed bg-disabled text-disabled-foreground border-disabled-border",
    isDisabled && variant === "secondary" && "border-0",
    isFullWidth && "w-full",
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
