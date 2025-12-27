ALTER TABLE notes ADD COLUMN status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'removed'));

