-- ThriveQuest Dev Database Initialization
-- Run this in Cloudflare D1 Console for: thrivequest-dev
-- Database ID: 54b60743-2919-4277-acc5-832f3fc26497

-- ============================================
-- 1. Create User Table
-- ============================================
CREATE TABLE User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    createdAt INTEGER NOT NULL DEFAULT (unixepoch())
);

-- ============================================
-- 2. Create Quest Table
-- ============================================
CREATE TABLE Quest (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    domain TEXT NOT NULL
);

-- ============================================
-- 3. Create QuestCompletion Table
-- ============================================
CREATE TABLE QuestCompletion (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date INTEGER NOT NULL,
    userId INTEGER NOT NULL REFERENCES User(id),
    questId INTEGER NOT NULL REFERENCES Quest(id)
);

-- ============================================
-- 4. Create Journal Entries Table
-- ============================================
CREATE TABLE journal_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES User(id),
    date TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    UNIQUE(user_id, date)
);

-- ============================================
-- 5. Seed Accomplishment Domain Quests
-- ============================================
INSERT INTO Quest (title, description, domain) VALUES
('Complete a challenging task', 'Tackle something difficult that you''ve been putting off', 'Accomplishment'),
('Learn something new', 'Spend time learning a new skill or expanding your knowledge', 'Accomplishment'),
('Organize your space', 'Clean and organize a part of your home or workspace', 'Accomplishment'),
('Make progress on a goal', 'Take one concrete step toward a personal or professional goal', 'Accomplishment'),
('Create something', 'Make something with your hands or mind - art, code, writing, anything!', 'Accomplishment');

-- ============================================
-- 6. Seed Positive Emotion Domain Quests
-- ============================================
INSERT INTO Quest (title, description, domain) VALUES
('Write down three things you are grateful for today', 'Take a moment to reflect on what you appreciate in your life', 'Positive Emotion'),
('Spend 10 minutes listening to your favorite music', 'Enjoy music without distractions - let yourself feel it', 'Positive Emotion'),
('Watch a funny video and allow yourself to laugh', 'Find something that makes you genuinely laugh out loud', 'Positive Emotion'),
('Reach out to a friend or family member just to say hello', 'Connect with someone you care about without needing a reason', 'Positive Emotion'),
('Spend time in nature or looking at something beautiful', 'Step outside or find beauty around you - even just looking out a window counts', 'Positive Emotion'),
('Do something kind for someone else', 'Perform a random act of kindness, big or small', 'Positive Emotion'),
('Enjoy your favorite treat or comfort food', 'Give yourself permission to savor something you love without guilt', 'Positive Emotion');

-- ============================================
-- Database initialization complete!
-- ============================================
-- Tables created: User, Quest, QuestCompletion, journal_entries
-- Quests seeded: 5 Accomplishment + 7 Positive Emotion = 12 total
--
-- Next steps:
-- 1. Create a test user account via signup at dev.thrivequest.app
-- 2. Test quest completion and journal features
-- 3. Verify data isolation from production
-- ============================================
