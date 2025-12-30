import { type ReactNode } from "react";
import LinkCore from "../core/Link";
import { StringSlice, type OriginalSlice } from "../../utils";
import { useTooltip } from "../../hooks/useTooltip";

export interface LinkProps extends OriginalSlice {
  href?: string;
  children: ReactNode;
  onHover?: (node: StringSlice) => string;
}

export function Link(props: LinkProps) {
  const { onHover, ...restProps } = props;
  const { tooltipText, handleMouseEnter, handleMouseLeave } = useTooltip({
    onHover,
    positionData: props,
  });

  return (
    <span className="relative group">
      <LinkCore
        href={props.href}
        target="_blank"
        rel="noopener noreferrer"
        {...restProps}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {props.children}
      </LinkCore>
      {tooltipText && (
        <div className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-gray-800 text-gray-100 text-sm rounded shadow-lg whitespace-pre-wrap max-w-md z-50 pointer-events-none font-mono">
          {tooltipText}
        </div>
      )}
    </span>
  );
}
