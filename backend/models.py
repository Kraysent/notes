from pydantic import BaseModel


class NoteResponse(BaseModel):
    code: str
    title: str
    content: str
    created_at: str
    updated_at: str
    status: str


class NoteUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    status: str | None = None


class TitleUpdate(BaseModel):
    old_code: str
    new_code: str
    new_title: str


class NotesListResponse(BaseModel):
    notes: list[NoteResponse]
    total: int
    page: int
    page_size: int
