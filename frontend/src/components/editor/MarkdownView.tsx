import { useMemo } from "react";
import { Fragment } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import rehypeReact from "rehype-react";
import "katex/dist/katex.min.css";
import {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Paragraph,
  type HeaderProps,
  type ParagraphProps,
} from "../markdown/Text";
import { Link, type LinkProps } from "../markdown/Link";
import { Code, type CodeProps } from "../markdown/Code";
import { Pre, type PreProps } from "../markdown/Pre";
import { Ul, Ol, Li, type ListProps } from "../markdown/List";
import { Checkbox, type CheckboxProps } from "../markdown/Checkbox";
import { gatherPosition, getOriginalCode, type NodeInfo } from "../../utils";

export interface MarkdownViewProps {
  note: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function heading(state: any, node: any) {
  const result = {
    type: "element",
    tagName: "h" + node.depth,
    properties: { ...gatherPosition(node) },
    children: state.all(node),
  };
  state.patch(node, result);
  return state.applyData(node, result);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function text(state: any, node: any) {
  const result = {
    type: "element",
    tagName: "span",
    properties: { ...gatherPosition(node) },
    children: [{ type: "text", value: node.value }],
  };
  state.patch(node, result);
  return state.applyData(node, result);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function paragraph(state: any, node: any) {
  const result = {
    type: "element",
    tagName: "p",
    properties: { ...gatherPosition(node) },
    children: state.all(node),
  };
  state.patch(node, result);
  return state.applyData(node, result);
}

function MarkdownView(props: MarkdownViewProps) {
  function getOriginalCodeForNode(node: NodeInfo): string {
    try {
      return getOriginalCode(node, props.note);
    } catch (error) {
      console.error("Error getting original code for node:", error);
      return "[could not determine snippet]";
    }
  }

  const processor = useMemo(
    () =>
      unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkMath)
        .use(remarkRehype, {
          allowDangerousHtml: false,
          handlers: {
            heading: heading,
            text: text,
            paragraph: paragraph,
          },
        })
        .use(rehypeRaw)
        .use(rehypeKatex)
        .use(rehypeReact, {
          Fragment,
          jsx,
          jsxs,
          components: {
            h1(props: HeaderProps) {
              return <H1 {...props} onHover={getOriginalCodeForNode} />;
            },
            h2(props: HeaderProps) {
              return <H2 {...props} onHover={getOriginalCodeForNode} />;
            },
            h3(props: HeaderProps) {
              return <H3 {...props} onHover={getOriginalCodeForNode} />;
            },
            h4(props: HeaderProps) {
              return <H4 {...props} onHover={getOriginalCodeForNode} />;
            },
            h5(props: HeaderProps) {
              return <H5 {...props} onHover={getOriginalCodeForNode} />;
            },
            h6(props: HeaderProps) {
              return <H6 {...props} onHover={getOriginalCodeForNode} />;
            },
            p(props: ParagraphProps) {
              return <Paragraph {...props} onHover={getOriginalCodeForNode} />;
            },
            code(props: CodeProps) {
              return <Code {...props} />;
            },
            pre(props: PreProps) {
              return <Pre {...props} />;
            },
            a(props: LinkProps) {
              return <Link {...props} />;
            },
            ul(props: ListProps) {
              return <Ul {...props} />;
            },
            ol(props: ListProps) {
              return <Ol {...props} />;
            },
            li(props: ListProps) {
              return <Li {...props} />;
            },
            input(props: CheckboxProps) {
              return <Checkbox {...props} />;
            },
          },
        }),
    []
  );

  const content = useMemo(() => {
    try {
      return processor.processSync(props.note).result;
    } catch (error) {
      console.error("Error processing markdown:", error);
      return <div>Error rendering markdown</div>;
    }
  }, [processor, props.note]);

  return (
    <div className="h-full overflow-auto p-6 bg-[#1e1e1e] text-gray-100">
      <div className="max-w-4xl mx-auto markdown-content">{content}</div>
    </div>
  );
}

export default MarkdownView;
