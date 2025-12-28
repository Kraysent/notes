import type { ReactNode } from "react";
import Text, { TextSize } from "../core/Text";

export interface HeaderProps {
  children: ReactNode;
  [key: string]: unknown;
}

export function H1(props: HeaderProps) {
  return (
    <Text size={TextSize.H1} {...props}>
      {props.children}
    </Text>
  );
}

export function H2(props: HeaderProps) {
  return (
    <Text size={TextSize.H2} {...props}>
      {props.children}
    </Text>
  );
}

export function H3(props: HeaderProps) {
  return (
    <Text size={TextSize.H3} {...props}>
      {props.children}
    </Text>
  );
}

export function H4(props: HeaderProps) {
  return (
    <Text size={TextSize.H4} {...props}>
      {props.children}
    </Text>
  );
}

export function H5(props: HeaderProps) {
  return (
    <Text size={TextSize.H5} {...props}>
      {props.children}
    </Text>
  );
}

export function H6(props: HeaderProps) {
  return (
    <Text size={TextSize.H6} {...props}>
      {props.children}
    </Text>
  );
}
