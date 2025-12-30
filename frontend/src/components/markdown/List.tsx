import type { ReactNode } from "react";
import { isValidElement } from "react";
import { markdownTypography } from "./typography";

export interface ListProps {
  children: ReactNode;
  ordered?: boolean;
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
    ? `${markdownTypography.list} list-none`
    : `${markdownTypography.list} list-disc`;

  return (
    <ul className={className} {...props}>
      {props.children}
    </ul>
  );
}

export function Li(props: ListProps) {
  const isChecklistItem = hasCheckbox(props.children);
  const className = isChecklistItem
    ? `${markdownTypography.listItem} list-none`
    : markdownTypography.listItem;

  return (
    <li className={className} {...props}>
      {props.children}
    </li>
  );
}

export function Ol(props: ListProps) {
  return (
    <ol className={`${markdownTypography.list} list-decimal`} {...props}>
      {props.children}
    </ol>
  );
}
