import { useState, useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { MdOutlineAutorenew, MdCheck, MdClear } from 'react-icons/md'
import { ViewMode, SaveStatus } from '../types'
import { saveNote } from '../api'
import settings from '../settings.json'
import { H1, H2, H3, H4, H5, H6 } from './markdown/Text'
import { Link } from './markdown/Link'
import { Code } from './markdown/Code'
import { Pre } from './markdown/Pre'
import { Ul, Ol, Li } from './markdown/List'

interface RawEditorProps {
  note: string
  onNoteChange: (note: string) => void
}

function RawEditor({ note, onNoteChange }: RawEditorProps) {
  return (
    <Editor
      height="100%"
      defaultLanguage="markdown"
      value={note}
      onChange={(value) => onNoteChange(value || '')}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 16,
        lineNumbers: 'on',
        wordWrap: 'on',
        padding: { top: 20, bottom: 20 },
        scrollBeyondLastLine: false,
        quickSuggestions: false,
        suggestOnTriggerCharacters: false,
        acceptSuggestionOnEnter: 'off',
        tabCompletion: 'off',
        wordBasedSuggestions: 'off',
        parameterHints: { enabled: false },
      }}
    />
  )
}

interface MarkdownViewProps {
  note: string
}

function MarkdownView({ note }: MarkdownViewProps) {
  return (
    <div className="h-full overflow-auto p-6 bg-[#1e1e1e] text-gray-100">
      <div className="max-w-4xl mx-auto markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            h1({ node, children, ...props }: any) {
              return <H1 {...props}>{children}</H1>
            },
            h2({ node, children, ...props }: any) {
              return <H2 {...props}>{children}</H2>
            },
            h3({ node, children, ...props }: any) {
              return <H3 {...props}>{children}</H3>
            },
            h4({ node, children, ...props }: any) {
              return <H4 {...props}>{children}</H4>
            },
            h5({ node, children, ...props }: any) {
              return <H5 {...props}>{children}</H5>
            },
            h6({ node, children, ...props }: any) {
              return <H6 {...props}>{children}</H6>
            },
            code({ node, inline, className, children, ...props }: any) {
              return <Code inline={inline} className={className} {...props}>{children}</Code>
            },
            pre({ node, children, ...props }: any) {
              return <Pre {...props}>{children}</Pre>
            },
            a({ node, href, children, ...props }: any) {
              return <Link href={href} {...props}>{children}</Link>
            },
            ul({ node, children, ...props }: any) {
              return <Ul {...props}>{children}</Ul>
            },
            ol({ node, children, ...props }: any) {
              return <Ol {...props}>{children}</Ol>
            },
            li({ node, children, ...props }: any) {
              return <Li {...props}>{children}</Li>
            },
          }}
        >
          {note}
        </ReactMarkdown>
      </div>
    </div>
  )
}

interface NoteEditorProps {
  note: string
  onNoteChange: (note: string) => void
  viewMode: ViewMode
  title: string
}

function NoteEditor({ note, onNoteChange, viewMode, title }: NoteEditorProps) {
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSavedContentRef = useRef<string>(note)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(SaveStatus.Saved)

  useEffect(() => {
    if (!title || !title.trim()) {
      setSaveStatus(SaveStatus.Unsaved)
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      return
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    if (lastSavedContentRef.current === note) {
      setSaveStatus(SaveStatus.Saved)
      return
    }

    setSaveStatus(SaveStatus.Unsaved)

    saveTimeoutRef.current = setTimeout(() => {
      if (lastSavedContentRef.current === note) {
        return
      }

      setSaveStatus(SaveStatus.Saving)
      saveNote(title, note)
        .then(() => {
          lastSavedContentRef.current = note
          setSaveStatus(SaveStatus.Saved)
        })
        .catch((error) => {
          console.error('Failed to autosave note:', error)
          setSaveStatus(SaveStatus.Unsaved)
        })
    }, settings.autosaveFrequencyMs)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [note, title])

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (title && title.trim() && lastSavedContentRef.current !== note) {
        saveNote(title, note).catch((error) => {
          console.error('Failed to save note on page unload:', error)
        })
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      if (title && title.trim() && lastSavedContentRef.current !== note) {
        saveNote(title, note).catch((error) => {
          console.error('Failed to save note on unmount:', error)
        })
      }
    }
  }, [note, title])

  const getStatusIcon = () => {
    switch (saveStatus) {
      case SaveStatus.Saved:
        return <MdCheck />
      case SaveStatus.Saving:
        return <MdOutlineAutorenew />
      case SaveStatus.Unsaved:
        return <MdClear />
    }
  }

  return (
    <div className="flex-1 overflow-hidden relative">
      <div className="absolute top-4 right-4 z-10">
        {getStatusIcon()}
      </div>
      {viewMode === ViewMode.Raw ? (
        <RawEditor note={note} onNoteChange={onNoteChange} />
      ) : (
        <MarkdownView note={note} />
      )}
    </div>
  )
}

export default NoteEditor

