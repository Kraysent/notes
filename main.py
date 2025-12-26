from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pydantic_settings import BaseSettings
from datetime import datetime
from pathlib import Path
import click
import logging
import uvicorn
from database import get_db_connection, run_migrations

logging.basicConfig(level=logging.DEBUG, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")


class Settings(BaseSettings):
    database_path: Path = Path("data/notes.db")


settings = Settings()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class NoteResponse(BaseModel):
    id: int
    title: str
    content: str
    created_at: str
    updated_at: str


class NoteUpdate(BaseModel):
    title: str
    content: str | None = None


class TitleUpdate(BaseModel):
    new_title: str
    old_title: str


@app.put("/api/note", response_model=NoteResponse)
def save_note(note_update: NoteUpdate):
    conn = get_db_connection(settings.database_path)
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
    
    return {
        "id": saved_note["id"],
        "title": saved_note["title"],
        "content": saved_note["content"],
        "created_at": saved_note["created_at"],
        "updated_at": saved_note["updated_at"],
    }


@app.patch("/api/note/title", response_model=NoteResponse)
def update_title(title_update: TitleUpdate):
    conn = get_db_connection(settings.database_path)
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
    
    return {
        "id": updated_note["id"],
        "title": updated_note["title"],
        "content": updated_note["content"],
        "created_at": updated_note["created_at"],
        "updated_at": updated_note["updated_at"],
    }


@click.command()
@click.option("--host", default="127.0.0.1", help="Host to bind the server to")
@click.option("--port", default=8000, type=int, help="Port to bind the server to")
@click.option("--db", default=None, type=click.Path(path_type=Path), help="Path to the database file")
def main(host: str, port: int, db: Path | None) -> None:
    global settings
    if db is not None:
        settings = Settings(database_path=db)
    
    run_migrations(settings.database_path)
    
    uvicorn.run("main:app", host=host, port=port, reload=True)


if __name__ == "__main__":
    main()

