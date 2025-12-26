import { useEffect, useState, useRef } from 'react'
import Editor from '@monaco-editor/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ViewMode, SaveStatus } from '../types'
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
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(SaveStatus.Saved)

  useEffect(() => {
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
      saveNote(note)
        .then(() => {
          lastSavedContentRef.current = note
          setSaveStatus(SaveStatus.Saved)
        })
        .catch((error) => {
          console.error('Failed to autosave note:', error)
          setSaveStatus(SaveStatus.Unsaved)
        })
    }, 2000)

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

  const getStatusText = () => {
    switch (saveStatus) {
      case SaveStatus.Saved:
        return 'Saved'
      case SaveStatus.Saving:
        return 'Saving...'
      case SaveStatus.Unsaved:
        return 'Unsaved'
    }
  }

  const getStatusColor = () => {
    switch (saveStatus) {
      case SaveStatus.Saved:
        return 'text-green-600 dark:text-green-400'
      case SaveStatus.Saving:
        return 'text-yellow-600 dark:text-yellow-400'
      case SaveStatus.Unsaved:
        return 'text-gray-500 dark:text-gray-400'
    }
  }

  return (
    <div className="flex-1 overflow-hidden relative">
      <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-md bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 shadow-sm">
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
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

