import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { MdCheck, MdContentCopy } from "react-icons/md";
import Button from "../core/Button";

export interface CodeBlockProps {
  language: string;
  children: string;
}

function CodeBlock(props: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeContent = String(props.children).replace(/\n$/, "");
  const { language, children, ...restProps } = props;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(codeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  }

  return (
    <div className="relative group">
      <SyntaxHighlighter
        style={dracula}
        PreTag="div"
        language={language}
        {...restProps}
      >
        {codeContent}
      </SyntaxHighlighter>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button onClick={handleCopy}>
          {copied ? <MdCheck /> : <MdContentCopy />}
        </Button>
      </div>
    </div>
  );
}

export default CodeBlock;
