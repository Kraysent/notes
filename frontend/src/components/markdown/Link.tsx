import type { ReactNode } from "react";
import LinkCore from "../core/Link";

export interface LinkProps {
  href?: string;
  children: ReactNode;
  [key: string]: unknown;
}

export function Link(props: LinkProps) {
  return (
    <LinkCore
      href={props.href}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {props.children}
    </LinkCore>
  );
}
