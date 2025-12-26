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

DB_NAME = "notes.db"


class Settings(BaseSettings):
    path_prefix: Path = Path("data")
    
    @property
    def database_path(self) -> Path:
        return self.path_prefix / DB_NAME


settings = Settings()


@click.command()
@click.option("--host", default="127.0.0.1", help="Host to bind the server to")
@click.option("--port", default=8000, type=int, help="Port to bind the server to")
@click.option("--path-prefix", default="/data", type=click.Path(path_type=Path), help="Prefix (directory) for the database file")
def main(host: str, port: int, path_prefix: Path | None) -> None:
    global settings
    settings = Settings(path_prefix=Path(path_prefix))
    
    run_migrations(settings.database_path)

    app = FastAPI()
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    def get_note_endpoint(title: str) -> NoteResponse:
        return get_note_by_title(title, settings.database_path)
    
    def save_note_endpoint(note_update: NoteUpdate) -> NoteResponse:
        return save_note(note_update, settings.database_path)
    
    def update_title_endpoint(title_update: TitleUpdate) -> NoteResponse:
        return update_title(title_update, settings.database_path)
    
    def list_notes_endpoint(page: int = 1, page_size: int = 50) -> NotesListResponse:
        return list_notes(page, page_size, settings.database_path)
    
    app.add_api_route("/api/note", get_note_endpoint, methods=["GET"], response_model=NoteResponse)
    app.add_api_route("/api/note", save_note_endpoint, methods=["PUT"], response_model=NoteResponse)
    app.add_api_route("/api/note/title", update_title_endpoint, methods=["PATCH"], response_model=NoteResponse)
    app.add_api_route("/api/notes", list_notes_endpoint, methods=["GET"], response_model=NotesListResponse)
    
    uvicorn.run(app, host=host, port=port)


if __name__ == "__main__":
    main()

