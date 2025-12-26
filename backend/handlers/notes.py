from fastapi import HTTPException
from datetime import datetime, timezone
from pathlib import Path
import sqlite3

from backend.models import NoteResponse, NoteUpdate, TitleUpdate
from backend.database import get_db_connection


def _normalize_timestamp(ts: str) -> str:
    try:
        dt = datetime.fromisoformat(ts.replace('Z', '+00:00'))
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.isoformat()
    except (ValueError, AttributeError):
        dt = datetime.now(timezone.utc)
        return dt.isoformat()


def save_note(note_update: NoteUpdate, database_path: Path) -> NoteResponse:
    conn = get_db_connection(database_path)
    cursor = conn.cursor()
    
    now = datetime.now(timezone.utc).isoformat()
    content = note_update.content if note_update.content is not None else ""
    
    if note_update.content is not None:
        cursor.execute(
            """INSERT INTO notes (title, content, created_at, updated_at)
               VALUES (?, ?, ?, ?)
               ON CONFLICT(title) DO UPDATE SET
               content = excluded.content,
               updated_at = ?""",
            (note_update.title, content, now, now, now)
        )
    else:
        cursor.execute(
            """INSERT INTO notes (title, content, created_at, updated_at)
               VALUES (?, ?, ?, ?)
               ON CONFLICT(title) DO UPDATE SET
               updated_at = ?""",
            (note_update.title, content, now, now, now)
        )
    
    conn.commit()
    cursor.execute("SELECT * FROM notes WHERE title = ?", (note_update.title,))
    saved_note = cursor.fetchone()
    conn.close()
    
    return NoteResponse(
        id=saved_note["id"],
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
        (title_update.new_title, datetime.now(timezone.utc).isoformat(), title_update.old_title)
    )
    
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=400, detail=f"No note found with title '{title_update.old_title}'")
    
    conn.commit()
    cursor.execute("SELECT * FROM notes WHERE title = ?", (title_update.new_title,))
    updated_note = cursor.fetchone()
    conn.close()
    
    return NoteResponse(
        id=updated_note["id"],
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
        id=note["id"],
        title=note["title"],
        content=note["content"],
        created_at=_normalize_timestamp(note["created_at"]),
        updated_at=_normalize_timestamp(note["updated_at"]),
    )

