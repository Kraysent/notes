import { useRef, useImperativeHandle, forwardRef } from 'react'
import NotesSidebarHeader from './NotesSidebarHeader'
import NotesList, { type NotesListRef } from './NotesList'

interface NotesSidebarProps {
  onNoteClick: (title: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export interface NotesSidebarRef {
  refresh: () => void
}

function NotesSidebar({ onNoteClick, searchQuery, onSearchChange }: NotesSidebarProps, ref: React.Ref<NotesSidebarRef>) {
  const notesListRef = useRef<NotesListRef>(null)

  useImperativeHandle(ref, () => ({
    refresh: () => {
      notesListRef.current?.refresh()
    }
  }), [])

  return (
    <div className="w-80 border-l border-gray-700 bg-gray-900 flex flex-col">
      <NotesSidebarHeader searchQuery={searchQuery} onSearchChange={onSearchChange} />
      <div className="flex-1 overflow-y-auto">
        <NotesList ref={notesListRef} onNoteClick={onNoteClick} searchQuery={searchQuery} />
      </div>
    </div>
  )
}

export default forwardRef(NotesSidebar)

