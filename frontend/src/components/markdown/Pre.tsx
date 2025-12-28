import type { ReactNode } from "react";

export interface PreProps {
  children: ReactNode;
  [key: string]: unknown;
}

export function Pre(props: PreProps) {
  return (
    <pre className="bg-white/5" {...props}>
      {props.children}
    </pre>
  );
}
