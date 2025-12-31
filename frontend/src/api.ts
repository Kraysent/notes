const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:8000" : "");

export interface Note {
  code: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  status: string;
}

export async function saveNote(
  code: string,
  title?: string,
  content?: string,
  status?: string
): Promise<Note> {
  const body: {
    title?: string;
    content?: string;
    status?: string;
  } = {};
  if (title !== undefined) {
    body.title = title;
  }
  if (content !== undefined) {
    body.content = content;
  }
  if (status !== undefined) {
    body.status = status;
  }
  const response = await fetch(
    `${API_BASE_URL}/api/note/${encodeURIComponent(code)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to save note");
  }
  return response.json();
}

export async function getNote(code: string): Promise<Note> {
  const response = await fetch(
    `${API_BASE_URL}/api/note/${encodeURIComponent(code)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to get note");
  }
  return response.json();
}

export async function updateTitle(
  oldCode: string,
  newCode: string,
  newTitle: string
): Promise<Note> {
  const response = await fetch(`${API_BASE_URL}/api/note/title`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      old_code: oldCode,
      new_code: newCode,
      new_title: newTitle,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to update title");
  }
  return response.json();
}

export interface NotesListResponse {
  notes: Note[];
  total: number;
  page: number;
  page_size: number;
}

export async function listNotes(
  page: number = 1,
  pageSize: number = 50,
  query?: string
): Promise<NotesListResponse> {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });
  if (query) {
    params.set("query", query);
  }
  const response = await fetch(
    `${API_BASE_URL}/api/notes?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to list notes");
  }
  return response.json();
}

export async function downloadNote(code: string): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/note/${encodeURIComponent(code)}/download`,
    {
      method: "GET",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to download note");
  }
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${code}.md`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
