const { pool } = require('./src/db');
const bcrypt = require('bcryptjs');

async function checkUser() {
    try {
        console.log('Checking database connection...');
        const [rows] = await pool.execute('SELECT id, username, password_hash, role FROM users');
        console.log('Users found:', rows.length);

        let found = false;
        for (const user of rows) {
            console.log(`User: ID=${user.id}, Username='${user.username}', Role='${user.role}'`);
            if (user.username === 'proftvv') {
                found = true;
                const isMatch = await bcrypt.compare('2503', user.password_hash);
                console.log(`Password '2503' match for proftvv? ${isMatch}`);
            }
        }

        if (!found) {
            console.log('User "proftvv" NOT found in database!');
        }

    } catch (err) {
        console.error('Database Error:', err);
    }
    process.exit();
}

checkUser();
