import CodeBlock from "./CodeBlock";

export interface CodeProps {
  inline?: boolean;
  className?: string;
  children: string;
  [key: string]: unknown;
}

export function Code(props: CodeProps) {
  const match = /language-(\w+)/.exec(props.className || "");

  if (!props.inline && match) {
    return (
      <CodeBlock language={match[1]} {...props}>
        {props.children}
      </CodeBlock>
    );
  }

  const isInPre = !props.inline;
  const codeClassName = isInPre
    ? `bg-transparent p-0 font-normal ${props.className || ""}`
    : `bg-white/10 ${props.className || ""}`;

  return (
    <code className={codeClassName} {...props}>
      {props.children}
    </code>
  );
}
