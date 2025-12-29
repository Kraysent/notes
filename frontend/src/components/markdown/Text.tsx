import { type ReactNode } from "react";
import Text, { TextSize, type TextSizeType } from "../core/Text";
import { StringSlice } from "../../utils";
import { useTooltip } from "../../hooks/useTooltip";

export interface HeaderProps {
  children: ReactNode;
  "data-startoffset": string;
  "data-endoffset": string;
  onHover?: (node: StringSlice) => string;
}

interface HeaderComponentProps extends HeaderProps {
  size: TextSizeType;
}

function HeaderComponent(props: HeaderComponentProps) {
  const { onHover, size, ...restProps } = props;
  const { tooltipText, handleMouseEnter, handleMouseLeave } = useTooltip({
    onHover,
    positionData: {
      "data-startoffset": Number(props["data-startoffset"]),
      "data-endoffset": Number(props["data-endoffset"]),
    },
  });

  return (
    <div className="relative group">
      <Text
        size={size}
        {...restProps}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {props.children}
      </Text>
      {tooltipText && (
        <div className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-gray-800 text-gray-100 text-sm rounded shadow-lg whitespace-pre-wrap max-w-md z-50 pointer-events-none font-mono">
          {tooltipText}
        </div>
      )}
    </div>
  );
}

export function H1(props: HeaderProps) {
  return <HeaderComponent {...props} size={TextSize.H1} />;
}

export function H2(props: HeaderProps) {
  return <HeaderComponent {...props} size={TextSize.H2} />;
}

export function H3(props: HeaderProps) {
  return <HeaderComponent {...props} size={TextSize.H3} />;
}

export function H4(props: HeaderProps) {
  return <HeaderComponent {...props} size={TextSize.H4} />;
}

export function H5(props: HeaderProps) {
  return <HeaderComponent {...props} size={TextSize.H5} />;
}

export function H6(props: HeaderProps) {
  return <HeaderComponent {...props} size={TextSize.H6} />;
}

export interface ParagraphProps {
  children: ReactNode;
  "data-startoffset": string;
  "data-endoffset": string;
  onHover?: (node: StringSlice) => string;
}

export function Paragraph(props: ParagraphProps) {
  return <HeaderComponent {...props} size={TextSize.Text} />;
}
