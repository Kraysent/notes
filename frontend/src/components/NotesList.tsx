import {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";
import { listNotes, saveNote } from "../api";
import type { Note } from "../api";
import Text, { TextSize, TextColor } from "./core/Text";
import Button from "./core/Button";
import { MdDelete } from "react-icons/md";

interface NotesListProps {
  onNoteClick: (code: string) => void;
  searchQuery: string;
}

export interface NotesListRef {
  refresh: () => void;
}

function NotesList(
  { onNoteClick, searchQuery }: NotesListProps,
  ref: React.Ref<NotesListRef>,
) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    listNotes(1, 50, searchQuery || undefined)
      .then((response) => {
        setNotes(response.notes);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load notes:", error);
        setLoading(false);
      });
  }, [searchQuery]);

  useImperativeHandle(
    ref,
    () => ({
      refresh,
    }),
    [refresh],
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function handleDelete(note: Note) {
    try {
      await saveNote(note.code, undefined, undefined, "removed");
      refresh();
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  }

  if (loading) {
    return <div className="p-4 text-gray-400">Loading notes...</div>;
  }

  if (notes.length === 0) {
    return <div className="p-4 text-gray-400">No notes yet</div>;
  }

  return (
    <div className="divide-y divide-gray-700">
      {notes.map((note) => (
        <div
          key={note.code}
          className="w-full flex items-center group hover:bg-gray-800 transition-colors"
        >
          <button
            onClick={() => onNoteClick(note.code)}
            className="flex-1 text-left p-1 pl-4"
          >
            <Text
              size={TextSize.H6}
              color={TextColor.Primary}
              className="break-words"
            >
              {note.title}
            </Text>
            <Text size={TextSize.Text} color={TextColor.Secondary}>
              {formatDate(note.updated_at)}
            </Text>
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Button onClick={() => handleDelete(note)}>
              <MdDelete size={20} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default forwardRef(NotesList);
