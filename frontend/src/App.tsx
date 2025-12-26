import { useState } from 'react'
import Header from './components/Header'
import NoteEditor from './components/NoteEditor'
import { ViewMode } from './types'
import { createNote, updateTitle } from './api'

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Raw)
  const [note, setNote] = useState('')
  const [title, setTitle] = useState('')

  const handleTitleSubmit = async (submittedTitle: string) => {
    if (!submittedTitle.trim()) {
      return
    }

    if (title && title.trim()) {
      await updateTitle(submittedTitle, title)
        .catch((error) => {
          console.error('Failed to update title:', error)
        })
    } else {
      await createNote(submittedTitle)
        .catch((error) => {
          console.error('Failed to create note:', error)
        })
    }
    setTitle(submittedTitle)
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <Header 
        title={title} 
        onTitleSubmit={handleTitleSubmit}
        viewMode={viewMode} 
        onViewModeChange={setViewMode} 
      />
      <NoteEditor note={note} onNoteChange={setNote} viewMode={viewMode} title={title} />
    </div>
  )
}

export default App
