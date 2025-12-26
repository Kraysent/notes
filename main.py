from fastapi import FastAPI
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
    content: str
    created_at: str
    updated_at: str


class NoteUpdate(BaseModel):
    content: str


@app.put("/api/note", response_model=NoteResponse)
def save_note(note_update: NoteUpdate):
    conn = get_db_connection(settings.database_path)
    cursor = conn.cursor()
    
    cursor.execute(
        "INSERT INTO notes (content, created_at, updated_at) VALUES (?, ?, ?)",
        (note_update.content, datetime.now().isoformat(), datetime.now().isoformat())
    )
    note_id = cursor.lastrowid
    
    conn.commit()
    cursor.execute("SELECT * FROM notes WHERE id = ?", (note_id,))
    saved_note = cursor.fetchone()
    conn.close()
    
    return {
        "id": saved_note["id"],
        "content": saved_note["content"],
        "created_at": saved_note["created_at"],
        "updated_at": saved_note["updated_at"],
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

