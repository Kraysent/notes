import type { ReactNode } from "react";
import { markdownTypography } from "./typography";

export interface BlockQuoteProps {
  children: ReactNode;
}

export function BlockQuote(props: BlockQuoteProps) {
  return (
    <blockquote className={markdownTypography.blockquote} {...props}>
      {props.children}
    </blockquote>
  );
}
