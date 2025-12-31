import {
  type NoteResponse,
  type NotesListResponse,
} from "./client";
import { createClient } from "./client/client";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:8000" : "");

export const client = createClient({ baseUrl: API_BASE_URL });

export type { NoteResponse as Note, NotesListResponse };
