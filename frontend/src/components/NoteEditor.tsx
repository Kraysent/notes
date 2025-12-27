import { useEffect, useState, useRef } from 'react'
import Editor from '@monaco-editor/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { MdOutlineAutorenew, MdCheck, MdClear } from 'react-icons/md'
import { ViewMode, SaveStatus } from '../types'
import { saveNote } from '../api'
import settings from '../settings.json'

interface RawEditorProps {
  note: string
  onNoteChange: (note: string) => void
}

function RawEditor({ note, onNoteChange }: RawEditorProps) {
  const [theme, setTheme] = useState<'vs' | 'vs-dark'>('vs-dark')

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)')
    const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      setTheme(e.matches ? 'vs' : 'vs-dark')
    }
    
    updateTheme(mediaQuery)
    mediaQuery.addEventListener('change', updateTheme)
    
    return () => mediaQuery.removeEventListener('change', updateTheme)
  }, [])

  return (
    <Editor
      height="100%"
      defaultLanguage="plaintext"
      value={note}
      onChange={(value) => onNoteChange(value || '')}
      theme={theme}
      options={{
        minimap: { enabled: false },
        fontSize: 16,
        lineNumbers: 'off',
        wordWrap: 'on',
        padding: { top: 20, bottom: 20 },
        scrollBeyondLastLine: false,
      }}
    />
  )
}

interface MarkdownViewProps {
  note: string
}

function MarkdownView({ note }: MarkdownViewProps) {
  return (
    <div className="h-full overflow-auto p-6 bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '')

              return !inline && match ? (
                <SyntaxHighlighter style={dracula} PreTag="div" language={match[1]} {...props}>
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
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

