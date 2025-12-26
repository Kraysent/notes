import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type ViewMode = 'raw' | 'markdown'

interface NoteEditorProps {
  note: string
  onNoteChange: (note: string) => void
  viewMode: ViewMode
}

function NoteEditor({ note, onNoteChange, viewMode }: NoteEditorProps) {
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
    <div className="flex-1 overflow-hidden">
      {viewMode === 'raw' ? (
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
      ) : (
        <div className="h-full overflow-auto p-6 bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100">
          <div className="max-w-4xl mx-auto markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{note}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  )
}

export default NoteEditor

