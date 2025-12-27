from pydantic import BaseModel


class NoteResponse(BaseModel):
    title: str
    content: str
    created_at: str
    updated_at: str
    status: str


class NoteUpdate(BaseModel):
    title: str
    content: str | None = None
    status: str | None = None


class TitleUpdate(BaseModel):
    new_title: str
    old_title: str


class NotesListResponse(BaseModel):
    notes: list[NoteResponse]
    total: int
    page: int
    page_size: int
