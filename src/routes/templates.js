const express = require('express');
const fs = require('fs').promises; // Dosya tasima icin gerekli
const path = require('path');
const multer = require('multer');
const { buildTemplatePath } = require('../storage');
const authRequired = require('../middleware/authRequired');
const adminOnly = require('../middleware/adminOnly');
const { sendError } = require('../utils/errorCodes');
const { checkAdminPermission, logAdminAction } = require('../utils/roleValidation');
const { pool } = require('../db');

const upload = multer({ dest: 'temp_uploads/' });
const router = express.Router();

// Sablon ekleme - Admin only
router.post('/', authRequired, adminOnly, upload.single('file'), async (req, res) => {

  const { name, description, field_map_json } = req.body;
  
  if (!name || !name.trim()) {
    return sendError(res, 'VALIDATION.MISSING_FIELD', { field: 'name' });
  }
  
  if (!req.file) {
    return sendError(res, 'VALIDATION.MISSING_FILE');
  }

  if (!req.file.mimetype.includes('pdf')) {
    await fs.unlink(req.file.path).catch(() => {});
    return sendError(res, 'FILE.INVALID_TYPE');
  }

  const safeName = name.replace(/\s+/g, '_');
  const filename = `${Date.now()}_${safeName}.pdf`;
  const dest = buildTemplatePath(filename);

  try {
    // Dosyayi tasi
    await fs.rename(req.file.path, dest);

    const fieldMap = field_map_json ? JSON.parse(field_map_json) : [];

    const [result] = await pool.execute(
      `INSERT INTO templates (name, description, file_path, field_map_json, created_by)
       VALUES (?, ?, ?, ?, ?)`,
      [
        name,
        description || '',
        filename,
        JSON.stringify(fieldMap),
        req.session.user.id
      ]
    );

    logAdminAction(req, 'TEMPLATE_CREATED', { 
      templateId: result.insertId,
      templateName: name
    });

    return res.json({ id: result.insertId, name, file_path: filename });
  } catch (err) {
    console.error('Template insert error:', err);
    return sendError(res, 'DATABASE.QUERY_ERROR');
  }
});

router.get('/', authRequired, async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM templates ORDER BY created_at DESC');
    return res.json(rows);
  } catch (err) {
    console.error('Templates list error:', err);
    return sendError(res, 'DATABASE.QUERY_ERROR');
  }
});

router.get('/:id', authRequired, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM templates WHERE id = ?', [req.params.id]);
    const template = rows[0];
    if (!template) return sendError(res, 'RESOURCE.TEMPLATE_NOT_FOUND');
    return res.json(template);
  } catch (err) {
    console.error('Template get error:', err);
    return sendError(res, 'DATABASE.QUERY_ERROR');
  }
});

module.exports = router;
