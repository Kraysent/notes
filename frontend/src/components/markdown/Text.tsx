import type { ReactNode } from "react";
import Text, { TextSize } from "../core/Text";
import { NodeInfo } from "../../utils";

export interface HeaderProps {
  children: ReactNode;
  "data-startline": number;
  "data-startcolumn": number;
  "data-startoffset": number;
  "data-endline": number;
  "data-endcolumn": number;
  "data-endoffset": number;
  onClick?: (node: NodeInfo) => void;
}

function createHeaderOnClick(props: HeaderProps): (() => void) | undefined {
  if (!props.onClick) {
    return undefined;
  }

  return () => {
    const node = {
      startPos: {
        line: props["data-startline"],
        column: props["data-startcolumn"],
        offset: props["data-startoffset"],
      },
      endPos: {
        line: props["data-endline"],
        column: props["data-endcolumn"],
        offset: props["data-endoffset"],
      },
    };

    props.onClick?.(node);
  };
}

export function H1(props: HeaderProps) {
  const { onClick, ...restProps } = props;
  return (
    <Text
      size={TextSize.H1}
      {...restProps}
      onClick={createHeaderOnClick(props)}
    >
      {props.children}
    </Text>
  );
}

export function H2(props: HeaderProps) {
  const { onClick, ...restProps } = props;
  return (
    <Text
      size={TextSize.H2}
      {...restProps}
      onClick={createHeaderOnClick(props)}
    >
      {props.children}
    </Text>
  );
}

export function H3(props: HeaderProps) {
  const { onClick, ...restProps } = props;
  return (
    <Text
      size={TextSize.H3}
      {...restProps}
      onClick={createHeaderOnClick(props)}
    >
      {props.children}
    </Text>
  );
}

export function H4(props: HeaderProps) {
  const { onClick, ...restProps } = props;
  return (
    <Text
      size={TextSize.H4}
      {...restProps}
      onClick={createHeaderOnClick(props)}
    >
      {props.children}
    </Text>
  );
}

export function H5(props: HeaderProps) {
  const { onClick, ...restProps } = props;
  return (
    <Text
      size={TextSize.H5}
      {...restProps}
      onClick={createHeaderOnClick(props)}
    >
      {props.children}
    </Text>
  );
}

export function H6(props: HeaderProps) {
  const { onClick, ...restProps } = props;
  return (
    <Text
      size={TextSize.H6}
      {...restProps}
      onClick={createHeaderOnClick(props)}
    >
      {props.children}
    </Text>
  );
}
