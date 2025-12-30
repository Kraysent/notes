import { type ReactNode } from "react";
import LinkCore from "../core/Link";
import { StringSlice } from "../../utils";
import { useTooltip } from "../../hooks/useTooltip";

export interface LinkProps {
  href?: string;
  children: ReactNode;
  "data-startoffset"?: string;
  "data-endoffset"?: string;
  onHover?: (node: StringSlice) => string;
}

export function Link(props: LinkProps) {
  const { onHover, ...restProps } = props;
  const { tooltipText, handleMouseEnter, handleMouseLeave } = useTooltip({
    onHover,
    positionData: {
      "data-startoffset": Number(props["data-startoffset"]),
      "data-endoffset": Number(props["data-endoffset"]),
    },
    requirePositionData: true,
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
