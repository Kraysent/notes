import { useState, useEffect } from 'react'
import Header from './components/Header'
import NoteEditor from './components/NoteEditor'
import NotesSidebar from './components/NotesSidebar'
import { ViewMode } from './types'
import { saveNote, updateTitle, getNote } from './api'
import { getKeybinding, matchesKeybinding } from './keybindings'
import settings from './settings.json'

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Raw)
  const [note, setNote] = useState('')
  const [title, setTitle] = useState('')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(settings.collapseSidebarByDefault)

  const switchNote = (title: string, content: string) => {
    setTitle(title)
    setNote(content)
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const titleParam = params.get('title')
    
    if (titleParam) {
      getNote(titleParam)
        .then((loadedNote) => {
          switchNote(loadedNote.title, loadedNote.content)
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

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      const viewToggleBinding = getKeybinding('view.toggle')
      if (viewToggleBinding && matchesKeybinding(e, viewToggleBinding)) {
        e.preventDefault()
        setViewMode((prevMode) => 
          prevMode === ViewMode.Raw ? ViewMode.Markdown : ViewMode.Raw
        )
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

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
        switchNote(loadedNote.title, loadedNote.content)
      })
      .catch((error) => {
        console.error('Failed to load note:', error)
      })
  }

  const handleNewNote = () => {
    switchNote('', '')
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <Header 
        title={title} 
        onTitleSubmit={handleTitleSubmit}
        viewMode={viewMode} 
        onViewModeChange={setViewMode}
        onNewNote={handleNewNote}
        isSidebarCollapsed={isSidebarCollapsed}
        onSidebarToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className="flex-1 flex overflow-hidden">
        <NoteEditor note={note} onNoteChange={setNote} viewMode={viewMode} title={title} />
        {!isSidebarCollapsed && <NotesSidebar onNoteClick={handleNoteClick} />}
      </div>
    </div>
  )
}

export default App
