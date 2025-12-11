const mariadb = require('mariadb');
const config = require('../src/config');
const fs = require('fs').promises;
const path = require('path');

async function main() {
    console.log('🔄 Initializing Database with MariaDB driver...');

    let connection;
    try {
        // 1. Connect without DB selected to create it
        connection = await mariadb.createConnection({
            host: '127.0.0.1',
            port: config.db.port,
            user: config.db.user,
            password: config.db.password,
            allowPublicKeyRetrieval: true
        });

        // 2. Create DB
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.db.database}\` DEFAULT CHARACTER SET utf8mb4`);
        console.log(`✅ Database ${config.db.database} checked.`);

        // 3. Switch DB
        await connection.query(`USE \`${config.db.database}\``);

        // 4. Read Schema
        const schemaPath = path.join(__dirname, '../sql/schema.sql');
        let schemaSql = await fs.readFile(schemaPath, 'utf8');

        schemaSql = schemaSql
            .replace(/CREATE DATABASE.*;/i, '')
            .replace(/USE `.*;/i, '');

        const statements = schemaSql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (const stmt of statements) {
            if (stmt.startsWith('--')) continue;
            await connection.query(stmt);
        }

        console.log(`✅ Schema applied (${statements.length} statements).`);

    } catch (err) {
        console.error('❌ Database init failed:', err);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
}

main();
