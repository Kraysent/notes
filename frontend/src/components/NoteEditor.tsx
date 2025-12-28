import { useState, useEffect, useRef, useMemo } from "react";
import { Fragment } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import Editor from "@monaco-editor/react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import rehypeReact from "rehype-react";
import "katex/dist/katex.min.css";
import { MdOutlineAutorenew, MdCheck, MdClear } from "react-icons/md";
import { ViewMode, SaveStatus } from "../types";
import { saveNote } from "../api";
import settings from "../settings.json";
import { H1, H2, H3, H4, H5, H6, type HeaderProps } from "./markdown/Text";
import { Link, type LinkProps } from "./markdown/Link";
import { Code, type CodeProps } from "./markdown/Code";
import { Pre, type PreProps } from "./markdown/Pre";
import { Ul, Ol, Li, type ListProps } from "./markdown/List";
import { Checkbox, type CheckboxProps } from "./markdown/Checkbox";
import type { NodeInfo } from "../utils";

export interface RawEditorProps {
  note: string;
  onNoteChange: (note: string) => void;
}

function RawEditor(props: RawEditorProps) {
  return (
    <Editor
      height="100%"
      defaultLanguage="markdown"
      value={props.note}
      onChange={(value) => props.onNoteChange(value || "")}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 16,
        lineNumbers: "on",
        wordWrap: "on",
        padding: { top: 20, bottom: 20 },
        scrollBeyondLastLine: false,
        quickSuggestions: false,
        suggestOnTriggerCharacters: false,
        acceptSuggestionOnEnter: "off",
        tabCompletion: "off",
        wordBasedSuggestions: "off",
        parameterHints: { enabled: false },
      }}
    />
  );
}

export interface MarkdownViewProps {
  note: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function gatherPosition(node: any) {
  return {
    [`data-startline`]: node.position.start.line,
    [`data-startcolumn`]: node.position.start.column,
    [`data-startoffset`]: node.position.start.offset,
    [`data-endline`]: node.position.end.line,
    [`data-endcolumn`]: node.position.end.column,
    [`data-endoffset`]: node.position.end.offset,
  };
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

function MarkdownView(props: MarkdownViewProps) {
  function getOriginalCode(node: NodeInfo): string {
    const note =
      typeof props !== "undefined" && typeof props.note === "string"
        ? props.note
        : "";
    const text =
      typeof node === "object" &&
      node.startPos &&
      node.endPos &&
      typeof note === "string"
        ? note.slice(node.startPos.offset, node.endPos.offset)
        : null;
    return text !== null ? text : "[could not determine snippet]";
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

export interface NoteEditorProps {
  note: string;
  onNoteChange: (note: string) => void;
  viewMode: ViewMode;
  title: string;
}

function NoteEditor(props: NoteEditorProps) {
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedContentRef = useRef<string>(props.note);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(SaveStatus.Saved);

  useEffect(() => {
    if (!props.title || !props.title.trim()) {
      setSaveStatus(SaveStatus.Unsaved);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    if (lastSavedContentRef.current === props.note) {
      setSaveStatus(SaveStatus.Saved);
      return;
    }

    setSaveStatus(SaveStatus.Unsaved);

    saveTimeoutRef.current = setTimeout(() => {
      if (lastSavedContentRef.current !== props.note) {
        setSaveStatus(SaveStatus.Saving);
        saveNote(props.title, props.note)
          .then(() => {
            lastSavedContentRef.current = props.note;
            setSaveStatus(SaveStatus.Saved);
          })
          .catch((error) => {
            console.error("Failed to autosave note:", error);
            setSaveStatus(SaveStatus.Unsaved);
          });
      }
    }, settings.autosaveFrequencyMs);

    return () => {
      const timeoutId = saveTimeoutRef.current;
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [props.note, props.title]);

  useEffect(() => {
    function handleBeforeUnload() {
      if (
        props.title &&
        props.title.trim() &&
        lastSavedContentRef.current !== props.note
      ) {
        saveNote(props.title, props.note).catch((error) => {
          console.error("Failed to save note on page unload:", error);
        });
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (
        props.title &&
        props.title.trim() &&
        lastSavedContentRef.current !== props.note
      ) {
        saveNote(props.title, props.note).catch((error) => {
          console.error("Failed to save note on unmount:", error);
        });
      }
    };
  }, [props.note, props.title]);

  function getStatusIcon() {
    switch (saveStatus) {
      case SaveStatus.Saved:
        return <MdCheck />;
      case SaveStatus.Saving:
        return <MdOutlineAutorenew />;
      case SaveStatus.Unsaved:
        return <MdClear />;
      default:
        return <MdClear />;
    }
  }

  return (
    <div className="flex-1 overflow-hidden relative">
      <div className="absolute top-4 right-4 z-10">{getStatusIcon()}</div>
      {props.viewMode === ViewMode.Raw ? (
        <RawEditor note={props.note} onNoteChange={props.onNoteChange} />
      ) : (
        <MarkdownView note={props.note} />
      )}
    </div>
  );
}

export default NoteEditor;
