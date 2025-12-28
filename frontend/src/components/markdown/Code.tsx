import CodeBlock from "./CodeBlock";

export interface CodeProps {
  inline?: boolean;
  className?: string;
  children: unknown;
  [key: string]: unknown;
}

export function Code(props: CodeProps) {
  const childrenString =
    typeof props.children === "string"
      ? props.children
      : String(props.children);

  const match = /language-(\w+)/.exec(props.className || "");

  if (!props.inline && match) {
    return (
      <CodeBlock language={match[1]} {...props}>
        {childrenString}
      </CodeBlock>
    );
  }

  const isInPre = !props.inline;
  const codeClassName = isInPre
    ? `bg-transparent p-0 font-normal ${props.className || ""}`
    : `bg-white/10 ${props.className || ""}`;

  return (
    <code className={codeClassName} {...props}>
      {childrenString}
    </code>
  );
}
