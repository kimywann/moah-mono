import type { ReactNode } from "react";
import { useId } from "react";
import cn from "../utils/cn";

interface IMHTooltipProps {
  children: ReactNode;
  className?: string;
  content: ReactNode;
}

const MHTooltip = ({ children, className, content }: IMHTooltipProps) => {
  const tooltipId = useId();

  return (
    <div className={cn("group relative inline-flex max-w-full", className)}>
      {children}
      <span
        className="-translate-x-1/2 wrap-break-words pointer-events-none invisible absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-80 whitespace-pre-line rounded-tiny bg-primary px-3 py-2 text-white opacity-0 shadow-sm transition-opacity group-hover:visible group-hover:opacity-100"
        id={tooltipId}
        role="tooltip"
      >
        {content}
      </span>
    </div>
  );
};

export default MHTooltip;
