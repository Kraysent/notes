import logging
from pathlib import Path

import click
import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response
from fastapi.routing import APIRoute
from pydantic_settings import BaseSettings

from backend.database import run_migrations
from backend.handlers.notes import get_note_by_code, get_note_content_for_download, list_notes, save_note, update_title
from backend.handlers.static import serve_static
from backend.models import NoteResponse, NotesListResponse, NoteUpdate, TitleUpdate

logging.basicConfig(level=logging.DEBUG, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")

DB_NAME = "notes.db"


class Settings(BaseSettings):
    path_prefix: Path = Path("data")

    @property
    def database_path(self) -> Path:
        return self.path_prefix / DB_NAME


settings = Settings()


def custom_generate_unique_id(route: APIRoute) -> str:
    if route.tags and len(route.tags) > 0:
        return f"{route.tags[0]}-{route.name}"
    return route.name


def get_app(app_settings: Settings | None = None, cors_origins: str | None = None) -> FastAPI:
    if app_settings is None:
        app_settings = settings

    app = FastAPI(generate_unique_id_function=custom_generate_unique_id)

    if cors_origins:
        origins = [origin.strip() for origin in cors_origins.split(",") if origin.strip()]
    else:
        origins = ["http://localhost:5173", "http://127.0.0.1:5173"]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    def get_note_endpoint(code: str) -> NoteResponse:
        return get_note_by_code(code, app_settings.database_path)

    def save_note_endpoint(code: str, note_update: NoteUpdate) -> NoteResponse:
        return save_note(code, note_update, app_settings.database_path)

    def update_title_endpoint(title_update: TitleUpdate) -> NoteResponse:
        return update_title(title_update, app_settings.database_path)

    def list_notes_endpoint(page: int = 1, page_size: int = 50, query: str | None = None) -> NotesListResponse:
        return list_notes(page, page_size, app_settings.database_path, query)

    def download_note_endpoint(code: str) -> Response:
        content = get_note_content_for_download(code, app_settings.database_path)
        filename = f"{code}.md"
        return Response(
            content=content,
            media_type="text/markdown",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )

    def ping_endpoint() -> dict[str, str]:
        return {"status": "ok"}

    def serve_static_endpoint(request: Request, full_path: str) -> FileResponse:
        static_path = Path("static")
        return serve_static(request, full_path, static_path)

    app.add_api_route("/ping", ping_endpoint, methods=["GET"], tags=["system"], name="ping")
    app.add_api_route(
        "/api/note/{code}",
        get_note_endpoint,
        methods=["GET"],
        response_model=NoteResponse,
        tags=["notes"],
        name="get_note",
    )
    app.add_api_route(
        "/api/note/{code}",
        save_note_endpoint,
        methods=["PUT"],
        response_model=NoteResponse,
        tags=["notes"],
        name="save_note",
    )
    app.add_api_route(
        "/api/note/title",
        update_title_endpoint,
        methods=["PATCH"],
        response_model=NoteResponse,
        tags=["notes"],
        name="update_title",
    )
    app.add_api_route(
        "/api/notes",
        list_notes_endpoint,
        methods=["GET"],
        response_model=NotesListResponse,
        tags=["notes"],
        name="list_notes",
    )
    app.add_api_route(
        "/api/note/{code}/download", download_note_endpoint, methods=["GET"], tags=["notes"], name="download_note"
    )
    app.add_api_route("/{full_path:path}", serve_static_endpoint, methods=["GET"], tags=["static"], name="serve_static")

    return app


@click.command()
@click.option("--host", default="127.0.0.1", help="Host to bind the server to")
@click.option("--port", default=8000, type=int, help="Port to bind the server to")
@click.option(
    "--path-prefix",
    default="/data",
    type=click.Path(path_type=Path),
    help="Prefix (directory) for the database file",
)
@click.option(
    "--cors-origins",
    default=None,
    help="Comma-separated list of allowed CORS origins (e.g., 'http://localhost:5173,http://127.0.0.1:5173')",
)
def main(host: str, port: int, path_prefix: Path | None, cors_origins: str | None) -> None:
    global settings
    settings = Settings(path_prefix=Path(path_prefix))

    run_migrations(settings.database_path)

    app = get_app(settings, cors_origins)

    uvicorn.run(app, host=host, port=port)


if __name__ == "__main__":
    main()
