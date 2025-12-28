import { useState, useRef, useEffect } from "react";
import { StringSlice } from "../utils";
import settings from "../settings.json";

export interface TooltipPositionData {
  "data-startline"?: number;
  "data-startcolumn"?: number;
  "data-startoffset"?: number;
  "data-endline"?: number;
  "data-endcolumn"?: number;
  "data-endoffset"?: number;
}

export interface UseTooltipProps {
  onHover?: (node: StringSlice) => string;
  positionData: TooltipPositionData;
  requirePositionData?: boolean;
}

export function useTooltip({
  onHover,
  positionData,
  requirePositionData = false,
}: UseTooltipProps) {
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

    if (
      requirePositionData &&
      (!positionData["data-startoffset"] || !positionData["data-endoffset"])
    ) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const node = {
        startPos: {
          line: positionData["data-startline"] ?? 0,
          column: positionData["data-startcolumn"] ?? 0,
          offset: positionData["data-startoffset"] ?? 0,
        },
        endPos: {
          line: positionData["data-endline"] ?? 0,
          column: positionData["data-endcolumn"] ?? 0,
          offset: positionData["data-endoffset"] ?? 0,
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

  return {
    tooltipText,
    handleMouseEnter,
    handleMouseLeave,
  };
}
