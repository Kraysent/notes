import type { ReactNode } from "react";
import { isValidElement } from "react";

export interface ListProps {
  children: ReactNode;
  ordered?: boolean;
  [key: string]: unknown;
}

function hasCheckbox(children: ReactNode): boolean {
  if (!children) return false;

  if (typeof children === "string" || typeof children === "number") {
    return false;
  }

  if (Array.isArray(children)) {
    return children.some((child) => hasCheckbox(child));
  }

  if (isValidElement(children)) {
    if (
      children.type === "input" &&
      (children.props as { type?: string })?.type === "checkbox"
    ) {
      return true;
    }
    const props = children.props as { children?: ReactNode };
    if (props?.children) {
      return hasCheckbox(props.children);
    }
  }

  return false;
}

export function Ul(props: ListProps) {
  const isChecklist = hasCheckbox(props.children);
  const className = isChecklist
    ? "mt-3 mb-3 pl-[1.625em] list-none"
    : "mt-3 mb-3 pl-[1.625em] list-disc";

  return (
    <ul className={className} {...props}>
      {props.children}
    </ul>
  );
}

export function Li(props: ListProps) {
  const isChecklistItem = hasCheckbox(props.children);
  const className = isChecklistItem ? "mt-1 mb-1 list-none" : "mt-1 mb-1";

  return (
    <li className={className} {...props}>
      {props.children}
    </li>
  );
}

export function Ol(props: ListProps) {
  return (
    <ol className="mt-3 mb-3 pl-[1.625em] list-decimal" {...props}>
      {props.children}
    </ol>
  );
}
