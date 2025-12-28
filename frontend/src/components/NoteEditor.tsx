import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { MdOutlineAutorenew, MdCheck, MdClear } from "react-icons/md";
import { ViewMode, SaveStatus } from "../types";
import { saveNote } from "../api";
import settings from "../settings.json";
import { H1, H2, H3, H4, H5, H6 } from "./markdown/Text";
import { Link } from "./markdown/Link";
import { Code } from "./markdown/Code";
import { Pre } from "./markdown/Pre";
import { Ul, Ol, Li } from "./markdown/List";

interface ComponentProps {
  node?: unknown;
  children?: ReactNode;
  [key: string]: unknown;
}

interface CodeComponentProps extends ComponentProps {
  inline?: boolean;
  className?: string;
}

interface LinkComponentProps extends ComponentProps {
  href?: string;
}

interface RawEditorProps {
  note: string;
  onNoteChange: (note: string) => void;
}

function RawEditor({ note, onNoteChange }: RawEditorProps) {
  return (
    <Editor
      height="100%"
      defaultLanguage="markdown"
      value={note}
      onChange={(value) => onNoteChange(value || "")}
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

interface MarkdownViewProps {
  note: string;
}

function MarkdownView({ note }: MarkdownViewProps) {
  return (
    <div className="h-full overflow-auto p-6 bg-[#1e1e1e] text-gray-100">
      <div className="max-w-4xl mx-auto markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeRaw, rehypeKatex]}
          components={
            {
              h1({ node, children, ...props }: ComponentProps) {
                return (
                  <H1 {...(props as Record<string, unknown>)}>{children}</H1>
                );
              },
              h2({ node, children, ...props }: ComponentProps) {
                return (
                  <H2 {...(props as Record<string, unknown>)}>{children}</H2>
                );
              },
              h3({ node, children, ...props }: ComponentProps) {
                return (
                  <H3 {...(props as Record<string, unknown>)}>{children}</H3>
                );
              },
              h4({ node, children, ...props }: ComponentProps) {
                return (
                  <H4 {...(props as Record<string, unknown>)}>{children}</H4>
                );
              },
              h5({ node, children, ...props }: ComponentProps) {
                return (
                  <H5 {...(props as Record<string, unknown>)}>{children}</H5>
                );
              },
              h6({ node, children, ...props }: ComponentProps) {
                return (
                  <H6 {...(props as Record<string, unknown>)}>{children}</H6>
                );
              },
              code({
                node,
                inline,
                className,
                children,
                ...props
              }: CodeComponentProps) {
                const childrenString =
                  typeof children === "string" ? children : String(children);
                return (
                  <Code
                    inline={inline}
                    className={className}
                    {...(props as Record<string, unknown>)}
                  >
                    {childrenString}
                  </Code>
                );
              },
              pre({ node, children, ...props }: ComponentProps) {
                return (
                  <Pre {...(props as Record<string, unknown>)}>{children}</Pre>
                );
              },
              a({ node, href, children, ...props }: LinkComponentProps) {
                return (
                  <Link href={href} {...(props as Record<string, unknown>)}>
                    {children}
                  </Link>
                );
              },
              ul({ node, children, ...props }: ComponentProps) {
                return (
                  <Ul {...(props as Record<string, unknown>)}>{children}</Ul>
                );
              },
              ol({ node, children, ...props }: ComponentProps) {
                return (
                  <Ol {...(props as Record<string, unknown>)}>{children}</Ol>
                );
              },
              li({ node, children, ...props }: ComponentProps) {
                return (
                  <Li {...(props as Record<string, unknown>)}>{children}</Li>
                );
              },
            } as Record<string, unknown>
          }
        >
          {note}
        </ReactMarkdown>
      </div>
    </div>
  );
}

interface NoteEditorProps {
  note: string;
  onNoteChange: (note: string) => void;
  viewMode: ViewMode;
  title: string;
}

function NoteEditor({ note, onNoteChange, viewMode, title }: NoteEditorProps) {
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedContentRef = useRef<string>(note);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(SaveStatus.Saved);

  useEffect(() => {
    if (!title || !title.trim()) {
      setSaveStatus(SaveStatus.Unsaved);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    if (lastSavedContentRef.current === note) {
      setSaveStatus(SaveStatus.Saved);
      return;
    }

    setSaveStatus(SaveStatus.Unsaved);

    saveTimeoutRef.current = setTimeout(() => {
      if (lastSavedContentRef.current !== note) {
        setSaveStatus(SaveStatus.Saving);
        saveNote(title, note)
          .then(() => {
            lastSavedContentRef.current = note;
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
  }, [note, title]);

  useEffect(() => {
    function handleBeforeUnload() {
      if (title && title.trim() && lastSavedContentRef.current !== note) {
        saveNote(title, note).catch((error) => {
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
      if (title && title.trim() && lastSavedContentRef.current !== note) {
        saveNote(title, note).catch((error) => {
          console.error("Failed to save note on unmount:", error);
        });
      }
    };
  }, [note, title]);

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
      {viewMode === ViewMode.Raw ? (
        <RawEditor note={note} onNoteChange={onNoteChange} />
      ) : (
        <MarkdownView note={note} />
      )}
    </div>
  );
}

export default NoteEditor;
