from fastapi import HTTPException
from datetime import datetime
from pathlib import Path
import sqlite3

from backend.models import NoteResponse, NoteUpdate, TitleUpdate
from backend.database import get_db_connection


def save_note(note_update: NoteUpdate, database_path: Path) -> NoteResponse:
    conn = get_db_connection(database_path)
    cursor = conn.cursor()
    
    now = datetime.now().isoformat()
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
        created_at=saved_note["created_at"],
        updated_at=saved_note["updated_at"],
    )


def update_title(title_update: TitleUpdate, database_path: Path) -> NoteResponse:
    conn = get_db_connection(database_path)
    cursor = conn.cursor()
    
    cursor.execute(
        "UPDATE notes SET title = ?, updated_at = ? WHERE title = ?",
        (title_update.new_title, datetime.now().isoformat(), title_update.old_title)
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
        created_at=updated_note["created_at"],
        updated_at=updated_note["updated_at"],
    )

