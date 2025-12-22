const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../db');
const logger = require('../services/logger');
const { adminOnly } = require('./auth');

const router = express.Router();

// List all users (admin only)
router.get('/', adminOnly, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, username, custom_id, role, created_at FROM users ORDER BY created_at DESC'
    );
    
    logger.info('Users list fetched', { 
      count: rows.length, 
      admin: req.session.user.username 
    });
    
    return res.json({ users: rows });
  } catch (err) {
    logger.error('Error fetching users', { error: err.message, stack: err.stack });
    return res.status(500).json({ error: `[U-001] Kullanıcılar yüklenemedi: ${err.message}` });
  }
});

// Create new user (admin only)
router.post('/', adminOnly, async (req, res) => {
  try {
    const { username, custom_id, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: '[U-002] Kullanıcı adı ve şifre gerekli' });
    }

    // Validate role
    if (role && !['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: '[U-003] Geçersiz rol. "user" veya "admin" olmalı' });
    }

    // Check if username or custom_id already exists
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE username = ? OR (custom_id IS NOT NULL AND custom_id = ?)',
      [username, custom_id || null]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: '[U-004] Kullanıcı adı veya ID zaten mevcut' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await pool.execute(
      'INSERT INTO users (username, custom_id, password_hash, role) VALUES (?, ?, ?, ?)',
      [username, custom_id || null, password_hash, role || 'user']
    );

    logger.info('New user created', { 
      userId: result.insertId, 
      username, 
      custom_id, 
      role: role || 'user',
      createdBy: req.session.user.username 
    });

    return res.status(201).json({ 
      success: true, 
      userId: result.insertId,
      message: 'Kullanıcı başarıyla oluşturuldu'
    });
  } catch (err) {
    logger.error('Error creating user', { error: err.message, stack: err.stack });
    return res.status(500).json({ error: `[U-005] Kullanıcı oluşturulamadı: ${err.message}` });
  }
});

// Update user (admin only)
router.put('/:id', adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, custom_id, password, role } = req.body;

    if (!username) {
      return res.status(400).json({ error: '[U-006] Kullanıcı adı gerekli' });
    }

    // Validate role
    if (role && !['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: '[U-007] Geçersiz rol. "user" veya "admin" olmalı' });
    }

    // Check if user exists
    const [existing] = await pool.execute('SELECT id FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: '[U-008] Kullanıcı bulunamadı' });
    }

    // Check for duplicate username/custom_id (excluding current user)
    const [duplicate] = await pool.execute(
      'SELECT id FROM users WHERE (username = ? OR (custom_id IS NOT NULL AND custom_id = ?)) AND id != ?',
      [username, custom_id || null, id]
    );

    if (duplicate.length > 0) {
      return res.status(409).json({ error: '[U-009] Kullanıcı adı veya ID zaten kullanımda' });
    }

    // Build update query
    let query = 'UPDATE users SET username = ?, custom_id = ?, role = ?';
    let params = [username, custom_id || null, role || 'user'];

    // If password is provided, update it too
    if (password) {
      const password_hash = await bcrypt.hash(password, 10);
      query += ', password_hash = ?';
      params.push(password_hash);
    }

    query += ' WHERE id = ?';
    params.push(id);

    await pool.execute(query, params);

    logger.info('User updated', { 
      userId: id, 
      username, 
      custom_id, 
      role: role || 'user',
      passwordChanged: !!password,
      updatedBy: req.session.user.username 
    });

    return res.json({ 
      success: true, 
      message: 'Kullanıcı başarıyla güncellendi' 
    });
  } catch (err) {
    logger.error('Error updating user', { error: err.message, stack: err.stack });
    return res.status(500).json({ error: `[U-010] Kullanıcı güncellenemedi: ${err.message}` });
  }
});

// Delete user (admin only)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting yourself
    if (parseInt(id) === req.session.user.id) {
      return res.status(400).json({ error: '[U-011] Kendi hesabınızı silemezsiniz' });
    }

    // Check if user exists
    const [existing] = await pool.execute('SELECT username FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: '[U-012] Kullanıcı bulunamadı' });
    }

    const deletedUsername = existing[0].username;

    await pool.execute('DELETE FROM users WHERE id = ?', [id]);

    logger.warn('User deleted', { 
      userId: id, 
      username: deletedUsername,
      deletedBy: req.session.user.username 
    });

    return res.json({ 
      success: true, 
      message: 'Kullanıcı başarıyla silindi' 
    });
  } catch (err) {
    logger.error('Error deleting user', { error: err.message, stack: err.stack });
    return res.status(500).json({ error: `[U-013] Kullanıcı silinemedi: ${err.message}` });
  }
});

module.exports = router;
