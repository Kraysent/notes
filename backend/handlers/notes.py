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


def save_note(code: str, note_update: NoteUpdate, database_path: Path) -> NoteResponse:
    conn = get_db_connection(database_path)
    cursor = conn.cursor()

    now = datetime.now(UTC).isoformat()

    cursor.execute("SELECT * FROM notes WHERE code = ?", (code,))
    existing_note = cursor.fetchone()

    if existing_note:
        update_parts = ["updated_at = ?"]
        update_values = [now]

        if note_update.title is not None:
            update_parts.append("title = ?")
            update_values.append(note_update.title)

        if note_update.content is not None:
            update_parts.append("content = ?")
            update_values.append(note_update.content)

        if note_update.status is not None:
            update_parts.append("status = ?")
            update_values.append(note_update.status)

        update_values.append(code)
        cursor.execute(
            f"UPDATE notes SET {', '.join(update_parts)} WHERE code = ?",
            update_values,
        )
    else:
        if note_update.title is None:
            raise HTTPException(status_code=400, detail="Title is required when creating a new note")
        content = note_update.content if note_update.content is not None else ""
        status = note_update.status if note_update.status is not None else "active"
        cursor.execute(
            """INSERT INTO notes (code, title, content, status, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (code, note_update.title, content, status, now, now),
        )

    conn.commit()
    cursor.execute("SELECT * FROM notes WHERE code = ?", (code,))
    saved_note = cursor.fetchone()
    conn.close()

    return NoteResponse(
        code=saved_note["code"],
        title=saved_note["title"],
        content=saved_note["content"],
        created_at=_normalize_timestamp(saved_note["created_at"]),
        updated_at=_normalize_timestamp(saved_note["updated_at"]),
        status=saved_note["status"],
    )


def update_title(title_update: TitleUpdate, database_path: Path) -> NoteResponse:
    conn = get_db_connection(database_path)
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE notes SET code = ?, title = ?, updated_at = ? WHERE code = ?",
        (title_update.new_code, title_update.new_title, datetime.now(UTC).isoformat(), title_update.old_code),
    )

    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=400, detail=f"No note found with code '{title_update.old_code}'")

    conn.commit()
    cursor.execute("SELECT * FROM notes WHERE code = ?", (title_update.new_code,))
    updated_note = cursor.fetchone()
    conn.close()

    return NoteResponse(
        code=updated_note["code"],
        title=updated_note["title"],
        content=updated_note["content"],
        created_at=_normalize_timestamp(updated_note["created_at"]),
        updated_at=_normalize_timestamp(updated_note["updated_at"]),
        status=updated_note["status"],
    )


def get_note_by_code(code: str, database_path: Path) -> NoteResponse:
    conn = get_db_connection(database_path)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM notes WHERE code = ? AND status != 'removed'", (code,))
    note = cursor.fetchone()
    conn.close()

    if note is None:
        raise HTTPException(status_code=404, detail=f"No note found with code '{code}'")

    return NoteResponse(
        code=note["code"],
        title=note["title"],
        content=note["content"],
        created_at=_normalize_timestamp(note["created_at"]),
        updated_at=_normalize_timestamp(note["updated_at"]),
        status=note["status"],
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
            "SELECT COUNT(*) as total FROM notes WHERE status = 'active' AND (title LIKE ? OR content LIKE ?)",
            (search_pattern, search_pattern),
        )
        total = cursor.fetchone()["total"]

        offset = (page - 1) * page_size
        cursor.execute(
            "SELECT * FROM notes WHERE status = 'active' AND (title LIKE ? OR content LIKE ?) "
            "ORDER BY updated_at DESC LIMIT ? OFFSET ?",
            (search_pattern, search_pattern, page_size, offset),
        )
    else:
        cursor.execute("SELECT COUNT(*) as total FROM notes WHERE status = 'active'")
        total = cursor.fetchone()["total"]

        offset = (page - 1) * page_size
        cursor.execute(
            "SELECT * FROM notes WHERE status = 'active' ORDER BY updated_at DESC LIMIT ? OFFSET ?",
            (page_size, offset),
        )

    notes_rows = cursor.fetchall()
    conn.close()

    notes = [
        NoteResponse(
            code=row["code"],
            title=row["title"],
            content=row["content"],
            created_at=_normalize_timestamp(row["created_at"]),
            updated_at=_normalize_timestamp(row["updated_at"]),
            status=row["status"],
        )
        for row in notes_rows
    ]

    return NotesListResponse(
        notes=notes,
        total=total,
        page=page,
        page_size=page_size,
    )


def get_note_content_for_download(code: str, database_path: Path) -> str:
    conn = get_db_connection(database_path)
    cursor = conn.cursor()

    cursor.execute("SELECT content FROM notes WHERE code = ? AND status != 'removed'", (code,))
    note = cursor.fetchone()
    conn.close()

    if note is None:
        raise HTTPException(status_code=404, detail=f"No note found with code '{code}'")

    return note["content"]
