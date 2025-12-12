const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../db');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Support legacy 'username' field for backward compatibility
    const loginIdentifier = identifier || req.body.username;

    if (!loginIdentifier || !password) {
      return res.status(400).json({ error: '[L-001] Kullanici ve sifre gerekli' });
    }

    // Query both username and custom_id fields
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE username = ? OR custom_id = ?',
      [loginIdentifier, loginIdentifier]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: '[L-002] Kullanıcı bulunamadı' });
    }

    if (rows.length > 1) {
      // This shouldn't happen with UNIQUE constraints, but handle it gracefully
      console.error('Multiple users found for identifier:', loginIdentifier);
      return res.status(500).json({ error: '[L-003] Birden fazla kullanıcı bulundu (sistem hatası)' });
    }

    const user = rows[0];

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      console.log('Password mismatch for identifier:', loginIdentifier);
      return res.status(401).json({ error: '[L-001] Gecersiz bilgiler' });
    }

    req.session.user = { id: user.id, username: user.username, custom_id: user.custom_id };
    return res.json({ user: req.session.user });
  } catch (err) {
    console.error('Login hatasi:', err);
    return res.status(500).json({ error: `[S-001] Sunucu hatasi: ${err.message}` });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

router.get('/me', (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'Oturum yok' });
  }
  return res.json({ user: req.session.user });
});

module.exports = router;
