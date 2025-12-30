import { useState, useRef, useEffect } from "react";
import { StringSlice, type OriginalSlice } from "../utils";
import settings from "../settings.json";

export interface UseTooltipProps {
  onHover?: (node: StringSlice) => string;
  positionData: OriginalSlice;
}

export function useTooltip({ onHover, positionData }: UseTooltipProps) {
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
      const node = StringSlice.fromOriginalSlice(positionData);
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
