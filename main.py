from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic_settings import BaseSettings
from pathlib import Path
import click
import logging
import uvicorn

from backend.database import run_migrations
from backend.models import NoteResponse, NoteUpdate, TitleUpdate, NotesListResponse
from backend.handlers.notes import save_note, update_title, get_note_by_title, list_notes

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


@app.get("/api/note", response_model=NoteResponse)
def get_note_endpoint(title: str):
    return get_note_by_title(title, settings.database_path)


@app.put("/api/note", response_model=NoteResponse)
def save_note_endpoint(note_update: NoteUpdate):
    return save_note(note_update, settings.database_path)


@app.patch("/api/note/title", response_model=NoteResponse)
def update_title_endpoint(title_update: TitleUpdate):
    return update_title(title_update, settings.database_path)


@app.get("/api/notes", response_model=NotesListResponse)
def list_notes_endpoint(page: int = 1, page_size: int = 50):
    return list_notes(page, page_size, settings.database_path)


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

