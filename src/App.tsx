import { useState } from 'react'
import Header from './components/Header'
import NoteEditor from './components/NoteEditor'

type ViewMode = 'raw' | 'markdown'

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('raw')
  const [note, setNote] = useState('')

  return (
    <div className="w-full h-screen flex flex-col">
      <Header viewMode={viewMode} onViewModeChange={setViewMode} />
      <NoteEditor note={note} onNoteChange={setNote} viewMode={viewMode} />
    </div>
  )
}

export default App
