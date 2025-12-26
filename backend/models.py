from pydantic import BaseModel


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

