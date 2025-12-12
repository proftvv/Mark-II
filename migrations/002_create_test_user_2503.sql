-- Create test user with custom_id = 2503
-- Username: test2503
-- Password: 2503
-- Custom ID: 2503

INSERT INTO users (username, password_hash, custom_id, created_at) 
VALUES ('test2503', '$2a$10$IQHK6DKrOg/Zkg2t3PileOsQ8tOcw8lTfyc.XCAiVOTSfFq64tidi', '2503', NOW());

-- Verification query:
-- SELECT * FROM users WHERE custom_id = '2503';

-- You can now login with:
-- - Identifier: test2503, Password: 2503
-- - Identifier: 2503, Password: 2503
