from datetime import UTC, datetime
from pathlib import Path

from fastapi import HTTPException

from backend.database import get_db_connection
from backend.models import NoteResponse, NotesListResponse, NoteUpdate, TitleUpdate


def _normalize_timestamp(ts: str) -> str:
    try:
        dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=UTC)
        return dt.isoformat()
    except (ValueError, AttributeError):
        dt = datetime.now(UTC)
        return dt.isoformat()


def save_note(note_update: NoteUpdate, database_path: Path) -> NoteResponse:
    conn = get_db_connection(database_path)
    cursor = conn.cursor()

    now = datetime.now(UTC).isoformat()
    content = note_update.content if note_update.content is not None else ""

    if note_update.content is not None:
        cursor.execute(
            """INSERT INTO notes (title, content, created_at, updated_at)
               VALUES (?, ?, ?, ?)
               ON CONFLICT(title) DO UPDATE SET
               content = excluded.content,
               updated_at = ?""",
            (note_update.title, content, now, now, now),
        )
    else:
        cursor.execute(
            """INSERT INTO notes (title, content, created_at, updated_at)
               VALUES (?, ?, ?, ?)
               ON CONFLICT(title) DO UPDATE SET
               updated_at = ?""",
            (note_update.title, content, now, now, now),
        )

    conn.commit()
    cursor.execute("SELECT * FROM notes WHERE title = ?", (note_update.title,))
    saved_note = cursor.fetchone()
    conn.close()

    return NoteResponse(
        title=saved_note["title"],
        content=saved_note["content"],
        created_at=_normalize_timestamp(saved_note["created_at"]),
        updated_at=_normalize_timestamp(saved_note["updated_at"]),
    )


def update_title(title_update: TitleUpdate, database_path: Path) -> NoteResponse:
    conn = get_db_connection(database_path)
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE notes SET title = ?, updated_at = ? WHERE title = ?",
        (title_update.new_title, datetime.now(UTC).isoformat(), title_update.old_title),
    )

    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=400, detail=f"No note found with title '{title_update.old_title}'")

    conn.commit()
    cursor.execute("SELECT * FROM notes WHERE title = ?", (title_update.new_title,))
    updated_note = cursor.fetchone()
    conn.close()

    return NoteResponse(
        title=updated_note["title"],
        content=updated_note["content"],
        created_at=_normalize_timestamp(updated_note["created_at"]),
        updated_at=_normalize_timestamp(updated_note["updated_at"]),
    )


def get_note_by_title(title: str, database_path: Path) -> NoteResponse:
    conn = get_db_connection(database_path)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM notes WHERE title = ?", (title,))
    note = cursor.fetchone()
    conn.close()

    if note is None:
        raise HTTPException(status_code=404, detail=f"No note found with title '{title}'")

    return NoteResponse(
        title=note["title"],
        content=note["content"],
        created_at=_normalize_timestamp(note["created_at"]),
        updated_at=_normalize_timestamp(note["updated_at"]),
    )


def list_notes(page: int, page_size: int, database_path: Path, query: str | None = None) -> NotesListResponse:
    if page < 1:
        page = 1
    if page_size < 1:
        page_size = 50

    conn = get_db_connection(database_path)
    cursor = conn.cursor()

    if query:
        search_pattern = f"%{query}%"
        cursor.execute(
            "SELECT COUNT(*) as total FROM notes WHERE title LIKE ? OR content LIKE ?", (search_pattern, search_pattern)
        )
        total = cursor.fetchone()["total"]

        offset = (page - 1) * page_size
        cursor.execute(
            "SELECT * FROM notes WHERE title LIKE ? OR content LIKE ? ORDER BY updated_at DESC LIMIT ? OFFSET ?",
            (search_pattern, search_pattern, page_size, offset),
        )
    else:
        cursor.execute("SELECT COUNT(*) as total FROM notes")
        total = cursor.fetchone()["total"]

        offset = (page - 1) * page_size
        cursor.execute("SELECT * FROM notes ORDER BY updated_at DESC LIMIT ? OFFSET ?", (page_size, offset))

    notes_rows = cursor.fetchall()
    conn.close()

    notes = [
        NoteResponse(
            title=row["title"],
            content=row["content"],
            created_at=_normalize_timestamp(row["created_at"]),
            updated_at=_normalize_timestamp(row["updated_at"]),
        )
        for row in notes_rows
    ]

    return NotesListResponse(
        notes=notes,
        total=total,
        page=page,
        page_size=page_size,
    )
