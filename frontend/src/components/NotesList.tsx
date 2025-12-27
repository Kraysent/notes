import { useEffect, useState, useImperativeHandle, forwardRef, useCallback } from 'react'
import { listNotes } from '../api'
import type { Note } from '../api'
import Text, { TextSize, TextColor } from './core/Text'

interface NotesListProps {
  onNoteClick: (title: string) => void
  searchQuery: string
}

export interface NotesListRef {
  refresh: () => void
}

function NotesList({ onNoteClick, searchQuery }: NotesListProps, ref: React.Ref<NotesListRef>) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    setLoading(true)
    listNotes(1, 50, searchQuery || undefined)
      .then((response) => {
        setNotes(response.notes)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Failed to load notes:', error)
        setLoading(false)
      })
  }, [searchQuery])

  useImperativeHandle(ref, () => ({
    refresh
  }), [refresh])

  useEffect(() => {
    refresh()
  }, [refresh])

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="p-4 text-gray-400">Loading notes...</div>
    )
  }

  if (notes.length === 0) {
    return (
      <div className="p-4 text-gray-400">No notes yet</div>
    )
  }

  return (
    <div className="divide-y divide-gray-700">
      {notes.map((note) => (
        <button
          key={note.title}
          onClick={() => onNoteClick(note.title)}
          className="w-full text-left p-4 hover:bg-gray-800 transition-colors"
        >
          <Text size={TextSize.Medium} color={TextColor.Primary} className="break-words mb-1">
            {note.title}
          </Text>
          <Text size={TextSize.Small} color={TextColor.Secondary}>
            {formatDate(note.updated_at)}
          </Text>
        </button>
      ))}
    </div>
  )
}

export default forwardRef(NotesList)

