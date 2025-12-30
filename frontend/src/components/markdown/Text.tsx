import { type ReactNode } from "react";
import { StringSlice } from "../../utils";
import { useTooltip } from "../../hooks/useTooltip";
import { markdownTypography } from "./typography";

export interface HeaderProps {
  children: ReactNode;
  "data-startoffset": string;
  "data-endoffset": string;
  onHover?: (node: StringSlice) => string;
}

interface HeaderComponentProps extends HeaderProps {
  typographyClass: string;
}

function HeaderComponent(props: HeaderComponentProps) {
  const { onHover, typographyClass, ...restProps } = props;
  const { tooltipText, handleMouseEnter, handleMouseLeave } = useTooltip({
    onHover,
    positionData: {
      "data-startoffset": Number(props["data-startoffset"]),
      "data-endoffset": Number(props["data-endoffset"]),
    },
  });

  return (
    <div className="relative group">
      <div
        className={`${typographyClass} text-gray-100`}
        {...restProps}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {props.children}
      </div>
      {tooltipText && (
        <div className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-gray-800 text-gray-100 text-sm rounded shadow-lg whitespace-pre-wrap max-w-md z-50 pointer-events-none font-mono">
          {tooltipText}
        </div>
      )}
    </div>
  );
}

export function H1(props: HeaderProps) {
  return <HeaderComponent {...props} typographyClass={markdownTypography.h1} />;
}

export function H2(props: HeaderProps) {
  return <HeaderComponent {...props} typographyClass={markdownTypography.h2} />;
}

export function H3(props: HeaderProps) {
  return <HeaderComponent {...props} typographyClass={markdownTypography.h3} />;
}

export function H4(props: HeaderProps) {
  return <HeaderComponent {...props} typographyClass={markdownTypography.h4} />;
}

export function H5(props: HeaderProps) {
  return <HeaderComponent {...props} typographyClass={markdownTypography.h5} />;
}

export function H6(props: HeaderProps) {
  return <HeaderComponent {...props} typographyClass={markdownTypography.h6} />;
}

export interface ParagraphProps {
  children: ReactNode;
  "data-startoffset": string;
  "data-endoffset": string;
  onHover?: (node: StringSlice) => string;
}

export function Paragraph(props: ParagraphProps) {
  return (
    <HeaderComponent
      {...props}
      typographyClass={markdownTypography.paragraph}
    />
  );
}
