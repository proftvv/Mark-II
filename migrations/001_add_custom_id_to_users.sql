-- Migration: Add custom_id field to users table
-- Version: v1.2.0
-- Date: 2025-12-12
-- Description: Adds custom_id column to support login with username OR user ID

-- Add custom_id column
ALTER TABLE users 
ADD COLUMN custom_id VARCHAR(50) UNIQUE NULL 
AFTER username;

-- Add index for performance (optional but recommended)
CREATE INDEX idx_users_custom_id ON users(custom_id);

-- Verify the change
-- DESCRIBE users;
