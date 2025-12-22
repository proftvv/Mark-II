-- Migration: Add role column to users table
-- Date: 2025-12-22

-- Add role column if it doesn't exist
ALTER TABLE users 
ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user' NOT NULL
AFTER password_hash;

-- Update existing user proftvv to admin
UPDATE users SET role = 'admin' WHERE username = 'proftvv';
