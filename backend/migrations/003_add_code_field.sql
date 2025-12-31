ALTER TABLE notes ADD COLUMN code TEXT NOT NULL DEFAULT '';

DROP INDEX IF EXISTS idx_notes_title_unique;

CREATE UNIQUE INDEX IF NOT EXISTS idx_notes_code_unique ON notes(code);

