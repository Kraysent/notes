import type { ReactNode } from "react";

export interface BlockQuoteProps {
  children: ReactNode;
}

export function BlockQuote(props: BlockQuoteProps) {
  return (
    <blockquote
      className="mt-3 mb-3 pl-4 border-l-4 border-l-white/20"
      {...props}
    >
      {props.children}
    </blockquote>
  );
}
