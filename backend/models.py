from pydantic import BaseModel
from typing import List


class NoteResponse(BaseModel):
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


class NotesListResponse(BaseModel):
    notes: List[NoteResponse]
    total: int
    page: int
    page_size: int

