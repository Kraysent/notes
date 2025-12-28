import type { ReactNode } from "react";
import Text, { TextSize } from "../core/Text";

interface HeaderProps {
  children: ReactNode;
  [key: string]: unknown;
}

export function H1({ children, ...props }: HeaderProps) {
  return (
    <Text size={TextSize.H1} {...props}>
      {children}
    </Text>
  );
}

export function H2({ children, ...props }: HeaderProps) {
  return (
    <Text size={TextSize.H2} {...props}>
      {children}
    </Text>
  );
}

export function H3({ children, ...props }: HeaderProps) {
  return (
    <Text size={TextSize.H3} {...props}>
      {children}
    </Text>
  );
}

export function H4({ children, ...props }: HeaderProps) {
  return (
    <Text size={TextSize.H4} {...props}>
      {children}
    </Text>
  );
}

export function H5({ children, ...props }: HeaderProps) {
  return (
    <Text size={TextSize.H5} {...props}>
      {children}
    </Text>
  );
}

export function H6({ children, ...props }: HeaderProps) {
  return (
    <Text size={TextSize.H6} {...props}>
      {children}
    </Text>
  );
}
