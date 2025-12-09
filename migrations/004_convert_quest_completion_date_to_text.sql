-- Migration 004: Convert QuestCompletion.date from integer (Unix timestamp) to text (YYYY-MM-DD)
-- This makes dates timezone-agnostic and consistent with dailyQuests and journalEntries

-- Create new table with text date field
CREATE TABLE QuestCompletion_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  userId INTEGER NOT NULL REFERENCES User(id),
  questId INTEGER NOT NULL REFERENCES Quest(id)
);

-- Copy existing data, converting Unix timestamps to YYYY-MM-DD strings
-- Multiply by 1000 to convert seconds to milliseconds for JavaScript Date
INSERT INTO QuestCompletion_new (id, date, userId, questId)
SELECT
  id,
  strftime('%Y-%m-%d', datetime(date, 'unixepoch')) as date,
  userId,
  questId
FROM QuestCompletion;

-- Drop old table
DROP TABLE QuestCompletion;

-- Rename new table
ALTER TABLE QuestCompletion_new RENAME TO QuestCompletion;

-- Recreate indexes if any (none currently, but good practice)
-- CREATE INDEX IF NOT EXISTS idx_quest_completions_user ON QuestCompletion(userId);
-- CREATE INDEX IF NOT EXISTS idx_quest_completions_date ON QuestCompletion(date);
