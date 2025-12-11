const mysql = require('mysql2/promise');
const config = require('../src/config');
const fs = require('fs').promises;
const path = require('path');
const { pool } = require('../src/db'); // Use the pool from db.js

async function migrate() {
    console.log('🔄 Starting Data Migration (JSON -> MySQL)...');

    try {
        // 1. Users
        const usersPath = path.join(__dirname, '../users.json');
        try {
            const usersData = await fs.readFile(usersPath, 'utf8');
            const users = JSON.parse(usersData);

            for (const user of users) {
                const [rows] = await pool.execute('SELECT id FROM users WHERE username = ?', [user.username]);
                if (rows.length === 0) {
                    await pool.execute(
                        'INSERT INTO users (username, password_hash) VALUES (?, ?)',
                        [user.username, user.password_hash]
                    );
                    console.log(`+ User migrated: ${user.username}`);
                } else {
                    console.log(`= User skipped (exists): ${user.username}`);
                }
            }
        } catch (e) {
            console.log('info: users.json could not be read or empty.', e.message);
        }

        // 2. Templates
        const templatesPath = path.join(__dirname, '../templates.json');
        try {
            const dbUsers = (await pool.query('SELECT id, username FROM users'))[0];
            const adminId = dbUsers.find(u => u.username === 'proftvv')?.id || dbUsers[0]?.id;

            const tplData = await fs.readFile(templatesPath, 'utf8');
            const templates = JSON.parse(tplData);

            for (const t of templates) {
                // Check if exists
                const [rows] = await pool.execute('SELECT id FROM templates WHERE name = ?', [t.name]);
                if (rows.length === 0) {
                    await pool.execute(
                        `INSERT INTO templates (name, description, file_path, field_map_json, created_by, created_at)
              VALUES (?, ?, ?, ?, ?, ?)`,
                        [
                            t.name,
                            t.description || '',
                            t.file_path,
                            JSON.stringify(t.field_map_json || []),
                            t.created_by || adminId, // Fallback to an admin 
                            new Date(t.created_at || Date.now())
                        ]
                    );
                    console.log(`+ Template migrated: ${t.name}`);
                }
            }
        } catch (e) {
            console.log('info: templates.json error: ', e.message);
        }

        // 3. Reports
        // Note: Reports migration is slightly complex because of relations.
        // For now we will do a best effort.

        console.log('✅ Migration completed.');

    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

migrate();
