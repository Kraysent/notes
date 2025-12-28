import { useState, useRef, useEffect, type ReactNode } from "react";
import Text, { TextSize, type TextSizeType } from "../core/Text";
import { StringSlice } from "../../utils";
import settings from "../../settings.json";

export interface HeaderProps {
  children: ReactNode;
  "data-startline": number;
  "data-startcolumn": number;
  "data-startoffset": number;
  "data-endline": number;
  "data-endcolumn": number;
  "data-endoffset": number;
  onHover?: (node: StringSlice) => string;
}

interface HeaderComponentProps extends HeaderProps {
  size: TextSizeType;
}

function HeaderComponent(props: HeaderComponentProps) {
  const { onHover, size, ...restProps } = props;
  const [tooltipText, setTooltipText] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  });

  function handleMouseEnter() {
    if (!onHover) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const node = {
        startPos: {
          line: props["data-startline"],
          column: props["data-startcolumn"],
          offset: props["data-startoffset"],
        },
        endPos: {
          line: props["data-endline"],
          column: props["data-endcolumn"],
          offset: props["data-endoffset"],
        },
      };

      const text = onHover(node);
      setTooltipText(text);
    }, settings.headerTooltipDelayMs);
  }

  function handleMouseLeave() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setTooltipText(null);
  }

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
  "data-startline": number;
  "data-startcolumn": number;
  "data-startoffset": number;
  "data-endline": number;
  "data-endcolumn": number;
  "data-endoffset": number;
  onHover?: (node: StringSlice) => string;
}

export function Paragraph(props: ParagraphProps) {
  return <HeaderComponent {...props} size={TextSize.Text} />;
}
