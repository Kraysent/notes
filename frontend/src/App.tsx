import { useState, useEffect } from 'react'
import Header from './components/Header'
import NoteEditor from './components/NoteEditor'
import NotesSidebar from './components/NotesSidebar'
import { ViewMode } from './types'
import { saveNote, updateTitle, getNote } from './api'

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Raw)
  const [note, setNote] = useState('')
  const [title, setTitle] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const titleParam = params.get('title')
    
    if (titleParam) {
      getNote(titleParam)
        .then((loadedNote) => {
          setTitle(loadedNote.title)
          setNote(loadedNote.content)
        })
        .catch((error) => {
          console.error('Failed to load note:', error)
        })
    }
  }, [])

  useEffect(() => {
    const url = new URL(window.location.href)
    if (title && title.trim()) {
      url.searchParams.set('title', title.trim())
    } else {
      url.searchParams.delete('title')
    }
    window.history.replaceState({}, '', url.toString())
  }, [title])

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
      await saveNote(submittedTitle, note)
        .catch((error) => {
          console.error('Failed to save note:', error)
        })
    }
    setTitle(submittedTitle)
  }

  const handleNoteClick = (noteTitle: string) => {
    getNote(noteTitle)
      .then((loadedNote) => {
        setTitle(loadedNote.title)
        setNote(loadedNote.content)
      })
      .catch((error) => {
        console.error('Failed to load note:', error)
      })
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <Header 
        title={title} 
        onTitleSubmit={handleTitleSubmit}
        viewMode={viewMode} 
        onViewModeChange={setViewMode} 
      />
      <div className="flex-1 flex overflow-hidden">
        <NoteEditor note={note} onNoteChange={setNote} viewMode={viewMode} title={title} />
        <NotesSidebar onNoteClick={handleNoteClick} />
      </div>
    </div>
  )
}

export default App
