import { useEffect, useState, useRef } from 'react'
import Editor from '@monaco-editor/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ViewMode } from '../types'
import { saveNote } from '../api'

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
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{note}</ReactMarkdown>
      </div>
    </div>
  )
}

interface NoteEditorProps {
  note: string
  onNoteChange: (note: string) => void
  viewMode: ViewMode
}

function NoteEditor({ note, onNoteChange, viewMode }: NoteEditorProps) {
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSavedContentRef = useRef<string>(note)

  useEffect(() => {
    lastSavedContentRef.current = note
  }, [note])

  useEffect(() => {
    const performAutosave = () => {
      if (lastSavedContentRef.current !== note) {
        saveNote(note)
          .then(() => {
            lastSavedContentRef.current = note
          })
          .catch((error) => {
            console.error('Failed to autosave note:', error)
          })
      }
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(performAutosave, 2000)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [note])

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (lastSavedContentRef.current !== note) {
        saveNote(note).catch((error) => {
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
      if (lastSavedContentRef.current !== note) {
        saveNote(note).catch((error) => {
          console.error('Failed to save note on unmount:', error)
        })
      }
    }
  }, [note])

  return (
    <div className="flex-1 overflow-hidden">
      {viewMode === ViewMode.Raw ? (
        <RawEditor note={note} onNoteChange={onNoteChange} />
      ) : (
        <MarkdownView note={note} />
      )}
    </div>
  )
}

export default NoteEditor

