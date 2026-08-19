import type { ReactNode } from "react";
import cn from "../utils/cn";

type TBadgeSize = "sm" | "md" | "lg";

const BADGE_CLASS: Record<TBadgeSize, string> = {
  sm: "h-5 px-2 display10",
  md: "h-6 px-2 display12",
  lg: "h-8 px-3 display14",
};

interface IMHBadgeProps {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  size?: TBadgeSize;
  variant?: "neutral" | "primary" | "success" | "warning" | "danger" | "info";
}

const MHBadge = ({
  children,
  className,
  icon,
  size = "md",
  variant = "neutral",
}: IMHBadgeProps) => {
  const baseBadge = cn(
    "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-tiny medium leading-body",
    BADGE_CLASS[size],
    variant === "neutral" && "bg-muted text-muted-foreground",
    variant === "primary" && "bg-tintRed text-brand50",
    variant === "success" && "bg-tintGreen text-green50",
    variant === "warning" && "bg-tintOrange text-orange50",
    variant === "danger" && "bg-tintRed text-red50",
    variant === "info" && "bg-tintBlue text-blue50",
    className,
  );

  return (
    <span className={baseBadge}>
      {icon}
      {children}
    </span>
  );
};

export default MHBadge;
