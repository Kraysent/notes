import { useEffect, useState } from 'react'
import { listNotes } from '../api'
import type { Note } from '../api'
import Text, { TextSize, TextColor } from './Text'

interface NotesSidebarProps {
  onNoteClick: (title: string) => void
}

function NotesSidebar({ onNoteClick }: NotesSidebarProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listNotes(1, 50)
      .then((response) => {
        setNotes(response.notes)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Failed to load notes:', error)
        setLoading(false)
      })
  }, [])

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
      <div className="w-80 border-l border-gray-700 bg-gray-900 p-4">
        <div className="text-gray-400">Loading notes...</div>
      </div>
    )
  }

  return (
    <div className="w-80 border-l border-gray-700 bg-gray-900 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-gray-100">Notes</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="p-4 text-gray-400">No notes yet</div>
        ) : (
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
        )}
      </div>
    </div>
  )
}

export default NotesSidebar

