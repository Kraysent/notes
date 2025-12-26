const API_BASE_URL = 'http://localhost:8000';

export interface Note {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export async function saveNote(content: string): Promise<Note> {
  const response = await fetch(`${API_BASE_URL}/api/note`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) {
    throw new Error('Failed to save note');
  }
  return response.json();
}

