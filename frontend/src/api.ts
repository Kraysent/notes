const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:8000' : '');

export interface Note {
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export async function saveNote(title: string, content: string): Promise<Note> {
  const response = await fetch(`${API_BASE_URL}/api/note`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, content }),
  });
  if (!response.ok) {
    throw new Error('Failed to save note');
  }
  return response.json();
}

export async function getNote(title: string): Promise<Note> {
  const response = await fetch(`${API_BASE_URL}/api/note?title=${encodeURIComponent(title)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to get note');
  }
  return response.json();
}

export async function updateTitle(newTitle: string, oldTitle: string): Promise<Note> {
  const response = await fetch(`${API_BASE_URL}/api/note/title`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ new_title: newTitle, old_title: oldTitle }),
  });
  if (!response.ok) {
    throw new Error('Failed to update title');
  }
  return response.json();
}

export interface NotesListResponse {
  notes: Note[];
  total: number;
  page: number;
  page_size: number;
}

export async function listNotes(page: number = 1, pageSize: number = 50, query?: string): Promise<NotesListResponse> {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });
  if (query) {
    params.set('query', query);
  }
  const response = await fetch(`${API_BASE_URL}/api/notes?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to list notes');
  }
  return response.json();
}

