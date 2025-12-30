import { type ReactNode } from "react";
import { useTooltip } from "../../hooks/useTooltip";
import { type OriginalSlice, type StringSlice } from "../../utils";

export interface TooltipWrapperProps {
  children: ReactNode;
  onHover?: (node: StringSlice) => string;
  positionData: OriginalSlice;
  wrapperClassName?: string;
  as?: "div" | "span";
  renderTooltip?: (tooltipText: string) => ReactNode;
}

function defaultTooltip(tooltipText: string) {
  return (
    <div className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-gray-800 text-gray-100 text-sm rounded shadow-lg whitespace-pre-wrap max-w-md z-50 pointer-events-none font-mono">
      {tooltipText}
    </div>
  );
}

export function TooltipWrapper({
  children,
  onHover,
  positionData,
  wrapperClassName = "relative group",
  as: WrapperElement = "div",
  renderTooltip = defaultTooltip,
}: TooltipWrapperProps) {
  const { tooltipText, handleMouseEnter, handleMouseLeave } = useTooltip({
    onHover,
    positionData,
  });

  return (
    <WrapperElement className={wrapperClassName}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="contents"
      >
        {children}
      </div>
      {tooltipText && renderTooltip(tooltipText)}
    </WrapperElement>
  );
}
