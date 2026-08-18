import type { MouseEventHandler, ReactNode } from "react";
import cn from "../utils/cn";

const BASE_BUTTON =
  "inline-flex items-center justify-center whitespace-nowrap medium rounded-small mediu leading-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 cursor-pointer";

interface IMHButtonProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  size?: "xSmall" | "small" | "medium" | "large" | "xLarge";
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
    size === "xSmall" && "h-6 px-2 display10",
    size === "small" && "h-9 px-3 display12",
    size === "medium" && "h-11 px-4 display16",
    size === "large" && "h-12 px-5 display18",
    size === "xLarge" && "h-14 px-6 display20",
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
