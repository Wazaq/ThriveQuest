-- Add quests for the 4 missing PERMA domains
-- Safe to run on production - does NOT delete existing quests

-- Positive Emotions Quests (5)
INSERT INTO Quest (title, description, domain) VALUES
  ('Write down three things you are grateful for', 'Gratitude shifts your focus to what''s going well in your life.', 'Positive Emotions'),
  ('Spend 5 minutes in mindful breathing', 'Calm your mind and center yourself with intentional breath work.', 'Positive Emotions'),
  ('Do something that makes you laugh', 'Joy is an essential part of wellness—seek it out today.', 'Positive Emotions'),
  ('Take a walk outside and notice something beautiful', 'Connect with nature and appreciate the world around you.', 'Positive Emotions'),
  ('Listen to a song that lifts your mood', 'Music has the power to shift your emotional state instantly.', 'Positive Emotions');

-- Engagement Quests (5)
INSERT INTO Quest (title, description, domain) VALUES
  ('Do 15 minutes of focused work without any distractions', 'Deep focus brings satisfaction and productivity.', 'Engagement'),
  ('Read a chapter of a book', 'Immerse yourself in a story or learn something new.', 'Engagement'),
  ('Engage in a hobby you love for 20 minutes', 'Flow happens when you do what you enjoy.', 'Engagement'),
  ('Learn one new thing about a topic that fascinates you', 'Curiosity keeps your mind engaged and growing.', 'Engagement'),
  ('Listen to a podcast or watch a documentary on a new subject', 'Expand your knowledge and explore new ideas.', 'Engagement');

-- Relationships Quests (5)
INSERT INTO Quest (title, description, domain) VALUES
  ('Send a thoughtful message to a friend you haven''t spoken to recently', 'Reconnecting strengthens bonds and brings joy to both of you.', 'Relationships'),
  ('Plan a future activity with someone you care about', 'Anticipation of shared experiences deepens relationships.', 'Relationships'),
  ('Practice active listening in a conversation today', 'Being fully present for someone shows you truly care.', 'Relationships'),
  ('Do a small favor for someone without expecting anything in return', 'Generosity creates positive connections.', 'Relationships'),
  ('Write down three things you appreciate about a person in your life', 'Recognizing what others bring to your life fosters gratitude and connection.', 'Relationships');

-- Meaning Quests (5)
INSERT INTO Quest (title, description, domain) VALUES
  ('Write down one thing that gives you a sense of purpose', 'Clarifying your purpose helps you live intentionally.', 'Meaning'),
  ('Donate to a cause you believe in (time or money)', 'Contributing to something larger than yourself creates meaning.', 'Meaning'),
  ('Help someone with a problem they are facing', 'Supporting others aligns with your values and deepens purpose.', 'Meaning'),
  ('Reflect on your personal values for 5 minutes', 'Understanding what matters to you guides better decisions.', 'Meaning'),
  ('Share something you''ve learned that could benefit others', 'Passing on knowledge is a way to contribute meaningfully.', 'Meaning');
