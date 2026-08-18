import { Gift, type LucideIcon, X } from "lucide-react";
import cn from "../utils/cn";

const ICONS = {
  gift: Gift,
  x: X,
} satisfies Record<string, LucideIcon>;

interface IMHIconProps {
  ariaLabel?: string;
  className?: string;
  icon: keyof typeof ICONS;
  size?: number;
  strokeWidth?: number;
}

const MHIcon = ({
  ariaLabel,
  className,
  icon,
  size = 24,
  strokeWidth = 2,
}: IMHIconProps) => {
  const Icon = ICONS[icon];

  return (
    <Icon
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      size={size}
      strokeWidth={strokeWidth}
    />
  );
};

export default MHIcon;
