const { pool } = require('./src/db');
const bcrypt = require('bcryptjs');

async function checkUser() {
    try {
        console.log('Checking database connection...');
        const [rows] = await pool.execute('SELECT id, username, password_hash FROM users');
        console.log('Users found:', rows.length);

        let found = false;
        for (const user of rows) {
            console.log(`User: ID=${user.id}, Username='${user.username}'`);
            if (user.username === 'proftvv') {
                found = true;
                const isMatch = await bcrypt.compare('2503', user.password_hash);
                console.log(`Password '2503' match for proftvv? ${isMatch}`);

                if (!isMatch) {
                    console.log('Password mismatch! Resetting to 2503...');
                    const newHash = await bcrypt.hash('2503', 10);
                    await pool.execute('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, user.id]);
                    console.log('Password reset complete.');
                }
            }
        }

        if (!found) {
            console.log('User "proftvv" NOT found! Creating...');
            const newHash = await bcrypt.hash('2503', 10);
            await pool.execute('INSERT INTO users (username, password_hash) VALUES (?, ?)', ['proftvv', newHash]);
            console.log('User created.');
        }

    } catch (err) {
        console.error('Database Error:', err);
    }
    process.exit();
}

checkUser();
