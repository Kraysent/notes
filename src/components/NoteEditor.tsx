import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'

function NoteEditor() {
  const [note, setNote] = useState('')
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
      <Editor
        height="100%"
        defaultLanguage="plaintext"
        value={note}
        onChange={(value) => setNote(value || '')}
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
    </div>
  )
}

export default NoteEditor

