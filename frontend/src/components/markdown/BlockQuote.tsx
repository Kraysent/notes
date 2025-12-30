import type { ReactNode } from "react";
import { mdTypography } from "./typography";

export interface BlockQuoteProps {
  children: ReactNode;
}

export function BlockQuote(props: BlockQuoteProps) {
  return (
    <blockquote className={mdTypography.blockquote} {...props}>
      {props.children}
    </blockquote>
  );
}
