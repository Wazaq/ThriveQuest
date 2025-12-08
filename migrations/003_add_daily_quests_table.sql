-- Migration: Add daily_quests table for curated daily quest selection
-- Created: 2025-12-08

CREATE TABLE daily_quests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES User(id),
  quest_id INTEGER NOT NULL REFERENCES Quest(id),
  date TEXT NOT NULL, -- Format: 'YYYY-MM-DD'
  created_at INTEGER DEFAULT (unixepoch()),

  -- Ensure one quest per user per day
  UNIQUE(user_id, quest_id, date)
);

-- Index for efficient daily quest lookups
CREATE INDEX idx_daily_quests_user_date ON daily_quests(user_id, date);
