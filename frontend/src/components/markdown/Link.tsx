import type { ReactNode } from "react";
import LinkCore from "../core/Link";

interface LinkProps {
  href?: string;
  children: ReactNode;
  [key: string]: unknown;
}

export function Link({ href, children, ...props }: LinkProps) {
  return (
    <LinkCore href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </LinkCore>
  );
}
