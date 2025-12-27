from pathlib import Path

from fastapi import HTTPException, Request
from fastapi.responses import FileResponse


def serve_static(request: Request, full_path: str, static_path: Path) -> FileResponse:
    if full_path.startswith("api/") or full_path == "ping":
        raise HTTPException(status_code=404)

    file_path = static_path / full_path
    if file_path.exists() and file_path.is_file():
        return FileResponse(str(file_path))

    index_path = static_path / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))

    raise HTTPException(status_code=404)
