-- Migration: Add onboarding fields to User table
-- Created: 2025-12-08

-- Add focusDomain column (nullable - user chooses during onboarding)
ALTER TABLE User ADD COLUMN focusDomain TEXT;

-- Add onboardingComplete column (defaults to false/0)
ALTER TABLE User ADD COLUMN onboardingComplete INTEGER NOT NULL DEFAULT 0;
