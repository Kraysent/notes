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
import { Code } from "../markdown/Code";
import { Pre } from "../markdown/Pre";
import { Ul, Ol, Li } from "../markdown/List";
import { Checkbox } from "../markdown/Checkbox";
import { gatherPosition, getStringSlice, type StringSlice } from "../../utils";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function link(state: any, node: any) {
  const result = {
    type: "element",
    tagName: "a",
    properties: { ...gatherPosition(node) },
    children: state.all(node),
  };
  state.patch(node, result);
  return state.applyData(node, result);
}

function MarkdownView(props: MarkdownViewProps) {
  function getOriginalCode(node: StringSlice): string {
    try {
      return getStringSlice(node, props.note);
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
            link: link,
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
              return <H1 {...props} onHover={getOriginalCode} />;
            },
            h2(props: HeaderProps) {
              return <H2 {...props} onHover={getOriginalCode} />;
            },
            h3(props: HeaderProps) {
              return <H3 {...props} onHover={getOriginalCode} />;
            },
            h4(props: HeaderProps) {
              return <H4 {...props} onHover={getOriginalCode} />;
            },
            h5(props: HeaderProps) {
              return <H5 {...props} onHover={getOriginalCode} />;
            },
            h6(props: HeaderProps) {
              return <H6 {...props} onHover={getOriginalCode} />;
            },
            p(props: ParagraphProps) {
              return <Paragraph {...props} onHover={getOriginalCode} />;
            },
            code: Code,
            pre: Pre,
            a(props: LinkProps) {
              return <Link {...props} onHover={getOriginalCode} />;
            },
            ul: Ul,
            ol: Ol,
            li: Li,
            input: Checkbox,
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
