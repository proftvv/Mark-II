import { useEffect, useState, useRef } from 'react';
import './App.css';

const API_BASE = import.meta.env.VITE_API_BASE || '';

function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [status, setStatus] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 }); // Indicator icin
  const [templates, setTemplates] = useState([]);
  const [reports, setReports] = useState([]);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    fieldMapJson: '[]'
  });
  const [templateFile, setTemplateFile] = useState(null);
  const [templatePreview, setTemplatePreview] = useState(null);
  const [selectedFields, setSelectedFields] = useState([]);
  const [reportForm, setReportForm] = useState({
    templateId: '',
    customerId: '',
    fieldData: {}
  });
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [reportPreview, setReportPreview] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (templateFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTemplatePreview(e.target.result);
      };
      reader.readAsDataURL(templateFile);
    }
  }, [templateFile]);

  async function apiFetch(path, options = {}) {
    const headers = options.headers ? { ...options.headers } : {};
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      headers,
      ...options
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      // E-GEN-001: Genuine API Error
      throw new Error(err.error || `[E-GEN-001] Sunucu hatası (${res.status})`);
    }
    return res.json();
  }

  function getError(code, message) {
    return `[${code}] ${message}`;
  }

  async function checkSession() {
    try {
      const data = await apiFetch('/auth/me', { method: 'GET' });
      setUser(data.user);
      await Promise.all([loadTemplates(), loadReports()]);
    } catch {
      setUser(null);
    }
  }

  function renderFieldDots(fields) {
    return (fields || []).map((field, idx) => {
      // field.x/y are in PDF coordinates (bottom-left origin)
      // We need to convert to % for CSS (top-left origin)
      // CSS Left = (field.x / 595) * 100
      // CSS Bottom = (field.y / 842) * 100 
      // If it has w/h, render as box. Else render as dot (legacy support).

      const style = {
        left: `${(field.x / 595) * 100}%`,
        bottom: `${(field.y / 842) * 100}%`
      };

      if (field.w && field.h) {
        style.width = `${(field.w / 595) * 100}%`;
        style.height = `${(field.h / 842) * 100}%`;
      }

      return (
        <div
          key={`${field.key}-${idx}`}
          className={field.w ? "field-box" : "field-dot"}
          style={style}
          title={`${field.key} (x:${field.x.toFixed(0)}, y:${field.y.toFixed(0)})`}
        >
          <span className="field-label">{field.key}</span>
        </div>
      );
    });
  }

  async function handleLogin(e) {
    e.preventDefault();
    setStatus('Giriş yapılıyor...');
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(loginForm)
      });
      setUser(data.user);
      setStatus('Giriş başarılı');
      await Promise.all([loadTemplates(), loadReports()]);
    } catch (err) {
      setStatus(`[L-001] ${err.message}`);
    }
  }

  async function handleLogout() {
    await apiFetch('/auth/logout', { method: 'POST' }).catch(() => { });
    setUser(null);
    setTemplates([]);
    setReports([]);
  }

  async function loadTemplates() {
    try {
      const data = await apiFetch('/templates', { method: 'GET' });
      setTemplates(data);
    } catch (err) {
      setStatus(err.message);
    }
  }

  async function loadReports() {
    try {
      const data = await apiFetch('/reports', { method: 'GET' });
      setReports(data);
    } catch (err) {
      setStatus(err.message);
    }
  }

  async function loadTemplatePreview(templateId) {
    try {
      const template = await apiFetch(`/templates/${templateId}`, { method: 'GET' });
      let fieldMap = template.field_map_json;
      if (typeof fieldMap === 'string') {
        try { fieldMap = JSON.parse(fieldMap); } catch { fieldMap = []; }
      }
      if (!Array.isArray(fieldMap)) fieldMap = [];

      // Update template object with parsed map to prevent render errors
      template.field_map_json = fieldMap;
      setSelectedTemplate(template);

      const fileUrl = `${API_BASE}/files/templates/${template.file_path}`;
      setReportPreview(fileUrl);
      setReportForm(prev => ({
        ...prev,
        fieldData: fieldMap.reduce((acc, field) => {
          acc[field.key] = '';
          return acc;
        }, {})
      }));
    } catch (err) {
      setStatus(err.message);
    }
  }

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragCurrent, setDragCurrent] = useState(null);

  function handleMouseDown(e) {
    if (!user?.username === 'proftvv') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDragging(true);
    setDragStart({ x, y });
    setDragCurrent({ x, y });
  }

  function handleMouseMove(e) {
    if (!user?.username === 'proftvv') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (isDragging) {
      setDragCurrent({ x, y });
    }
  }

  function handleMouseUp(e) {
    if (!isDragging || !dragStart) return;
    setIsDragging(false);

    const rect = e.currentTarget.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    // Calculate box dimensions relative to PDF 595x842 coordinate system
    // Using Math.min to ensure x/y are top-left
    const rawX = Math.min(dragStart.x, currentX);
    const rawY = Math.min(dragStart.y, currentY);
    const rawW = Math.abs(currentX - dragStart.x);
    const rawH = Math.abs(currentY - dragStart.y);

    // Convert to PDF coordinates (PDF origin is usually bottom-left, but for simple overlay we often use top-left if the viewer matches. 
    // However, pdf-lib usually uses bottom-left origin. 
    // Let's assume standard PDF coordinates: x=left, y=bottom.
    // The previous logic used `rect.height - (e.clientY - rect.top)` which implies bottom-up Y.
    // If we want to draw a box, we need (x, y, w, h). 
    // Let's store normalized values and handle rendering/pdf-generation accordingly.

    // PDF Y is from bottom. So Top-Left of screen box is:
    // Screen Y (from top) = rawY
    // PDF Y (from bottom) = rect.height - rawY
    // But since it's a box, we usually define it by bottom-left corner or top-left. 
    // Let's stick to the previous point logic: x, y, size.
    // BUT user complained about visual mismatch. 
    // Let's save the BOX definition: x (left), y (bottom), w, h.

    // PDF Coordinate (Bottom-Left of the box):
    // x = rawX
    // y = rect.height - (rawY + rawH) 

    const scaleX = 595 / rect.width;
    const scaleY = 842 / rect.height;

    const x = rawX * scaleX;
    // PDF Y (bottom-left)
    const y = (rect.height - (rawY + rawH)) * scaleY;
    const w = rawW * scaleX;
    const h = rawH * scaleY;

    // Don't allow tiny boxes
    if (w < 5 || h < 5) {
      setDragStart(null);
      setDragCurrent(null);
      return;
    }

    const key = prompt('Alan adı (key):');
    if (key) {
      const newField = {
        key,
        page: 0,
        x, // Bottom-left X
        y, // Bottom-left Y
        w, // Width
        h, // Height
        type: 'box'
      };
      setSelectedFields([...selectedFields, newField]);
      setTemplateForm(prev => ({
        ...prev,
        fieldMapJson: JSON.stringify([...selectedFields, newField], null, 2)
      }));
    }
    setDragStart(null);
    setDragCurrent(null);
  }

  async function handleTemplateUpload(e) {
    e.preventDefault();
    if (user?.username !== 'proftvv') {
      setStatus('Sadece ana hesap şablon ekleyebilir');
      return;
    }
    if (!templateForm.name || templateForm.name.trim() === '') {
      setStatus('Şablon adı gerekli');
      return;
    }
    if (!templateFile) {
      setStatus('PDF şablon dosyası seçin');
      return;
    }
    setStatus('Şablon yükleniyor...');
    try {
      const fd = new FormData();
      fd.append('file', templateFile);
      fd.append('name', templateForm.name.trim());
      fd.append('description', templateForm.description.trim());
      fd.append('field_map_json', templateForm.fieldMapJson);
      const response = await apiFetch('/templates', { method: 'POST', body: fd });
      setStatus(`Şablon eklendi: ${templateForm.name}`);
      setTemplateForm({ name: '', description: '', fieldMapJson: '[]' });
      setTemplateFile(null);
      setTemplatePreview(null);
      setSelectedFields([]);
      await loadTemplates();
    } catch (err) {
      setStatus(`Hata: ${err.message}`);
    }
  }

  function updateFieldData(key, value) {
    setReportForm(prev => ({
      ...prev,
      fieldData: { ...prev.fieldData, [key]: value }
    }));
  }

  async function handleReportCreate(e) {
    e.preventDefault();
    if (!reportForm.templateId) {
      setStatus('Şablon seçin');
      return;
    }
    setStatus('Rapor oluşturuluyor...');
    try {
      const body = {
        template_id: Number(reportForm.templateId),
        customer_id: reportForm.customerId ? Number(reportForm.customerId) : null,
        field_data: reportForm.fieldData
      };
      const data = await apiFetch('/reports', {
        method: 'POST',
        body: JSON.stringify(body)
      });
      setStatus(`Rapor oluşturuldu: ${data.doc_number}`);
      await loadReports();
    } catch (err) {
      setStatus(err.message);
    }
  }

  async function handleDeleteReport(id) {
    if (!confirm('Bu raporu silmek istediginizden emin misiniz?')) return;
    try {
      await apiFetch(`/reports/${id}`, { method: 'DELETE' });
      setStatus('Rapor silindi');
      await loadReports();
    } catch (err) {
      setStatus(err.message);
    }
  }

  const isAdmin = user?.username === 'proftvv';

  return (
    <div className={`page ${darkMode ? 'dark' : ''}`}>
      <header className="topbar">
        {/* ... header content ... */}


        {!user && (
          <section className="card">
            <h2>Giriş</h2>
            <form className="form-grid" onSubmit={handleLogin}>
              <label>
                Kullanıcı adı
                <input
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  required
                />
              </label>
              <label>
                Şifre
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </label>
              <button type="submit">Giriş yap</button>
            </form>
          </section>
        )}

        {user && (
          <>
            <section className="card">
              <div className="section-head">
                <h2>Şablonlar</h2>
                <button onClick={loadTemplates} className="secondary">Yenile</button>
              </div>
              <div className="list">
                {templates.length === 0 && <div className="muted">Şablon yok</div>}
                {templates.map((t) => (
                  <div key={t.id} className="list-item">
                    <div>
                      <strong>{t.name}</strong>
                      <div className="muted">{t.description}</div>
                    </div>
                    <div className="muted">#{t.id}</div>
                  </div>
                ))}
              </div>
              {isAdmin && (
                <details className="accordion">
                  <summary>Şablon ekle (sadece proftvv)</summary>
                  <form className="form-grid" onSubmit={handleTemplateUpload}>
                    <label>
                      Ad
                      <input
                        value={templateForm.name}
                        onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                        required
                      />
                    </label>
                    <label>
                      Açıklama
                      <input
                        value={templateForm.description}
                        onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                      />
                    </label>
                    <label>
                      PDF Şablon
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setTemplateFile(e.target.files?.[0] || null)}
                        required
                      />
                    </label>
                    {templatePreview && (
                      <div className="pdf-preview-container">
                        <h3>PDF önizleme - Tıklayarak alan ekleyin</h3>
                        <div className="pdf-frame">
                          <object
                            data={`${templatePreview}#toolbar=0`}
                            type="application/pdf"
                            className="pdf-embed"
                          >
                            <p>PDF görüntülenemedi. <a href={templatePreview} target="_blank" rel="noreferrer">Yeni sekmede aç</a></p>
                          </object>
                          <div className="pdf-dots">
                            {renderFieldDots(selectedFields)}
                          </div>
                          {isAdmin && (
                            <>
                              <div
                                className="pdf-click-overlay"
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={() => {
                                  setMousePos({ x: -1, y: -1 });
                                  setIsDragging(false);
                                  setDragStart(null);
                                }}
                                title="Tıklayıp sürükleyerek alan seçin"
                              />
                              {/* Guide Lines (Crosshair) */}
                              {mousePos.x > 0 && mousePos.y > 0 && !isDragging && (
                                <>
                                  <div className="guide-line-x" style={{ top: mousePos.y }}></div>
                                  <div className="guide-line-y" style={{ left: mousePos.x }}></div>
                                </>
                              )}
                              {/* Selection Drag Box */}
                              {isDragging && dragStart && dragCurrent && (
                                <div
                                  className="selection-box"
                                  style={{
                                    left: Math.min(dragStart.x, dragCurrent.x),
                                    top: Math.min(dragStart.y, dragCurrent.y),
                                    width: Math.abs(dragCurrent.x - dragStart.x),
                                    height: Math.abs(dragCurrent.y - dragStart.y)
                                  }}
                                ></div>
                              )}
                            </>
                          )}
                        </div>
                        <div className="field-list">
                          <h4>Seçilen Alanlar:</h4>
                          {selectedFields.map((field, idx) => (
                            <div key={idx} className="field-item">
                              <strong>{field.key}</strong> - x: {field.x.toFixed(0)}, y: {field.y.toFixed(0)}
                              <button
                                type="button"
                                onClick={() => {
                                  const newFields = selectedFields.filter((_, i) => i !== idx);
                                  setSelectedFields(newFields);
                                  setTemplateForm(prev => ({
                                    ...prev,
                                    fieldMapJson: JSON.stringify(newFields, null, 2)
                                  }));
                                }}
                              >
                                Sil
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <label>
                      field_map_json (otomatik doldurulur)
                      <textarea
                        rows={6}
                        value={templateForm.fieldMapJson}
                        onChange={(e) => setTemplateForm({ ...templateForm, fieldMapJson: e.target.value })}
                      />
                    </label>
                    <button type="submit">Şablonu kaydet</button>
                  </form>
                </details>
              )}
            </section>

            <section className="card">
              <div className="section-head">
                <h2>Rapor oluştur</h2>
                <button onClick={loadReports} className="secondary">Listeyi yenile</button>
              </div>
              <form className="form-grid" onSubmit={handleReportCreate}>
                <label>
                  Şablon
                  <select
                    value={reportForm.templateId}
                    onChange={(e) => {
                      const templateId = e.target.value;
                      setReportForm({ ...reportForm, templateId, fieldData: {} });
                      if (templateId) {
                        loadTemplatePreview(parseInt(templateId));
                      } else {
                        setSelectedTemplate(null);
                        setReportPreview(null);
                      }
                    }}
                    required
                  >
                    <option value="">Seçin</option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </label>

                {selectedTemplate && reportPreview && (
                  <div className="pdf-preview-container">
                    <h3>PDF önizleme - Alanları doldurun</h3>
                    <div className="pdf-frame">
                      <object
                        data={`${reportPreview}#toolbar=0`}
                        type="application/pdf"
                        className="pdf-embed"
                      >
                        <p>PDF görüntülenemedi. <a href={reportPreview} target="_blank" rel="noreferrer">Yeni sekmede aç</a></p>
                      </object>
                      <div className="pdf-dots">
                        {renderFieldDots(selectedTemplate.field_map_json || [])}
                      </div>
                    </div>
                    <div className="field-form">
                      <h4>Alanları Doldur:</h4>
                      {/* Ensure field_map_json is an array and map it */}
                      {(Array.isArray(selectedTemplate.field_map_json) ? selectedTemplate.field_map_json : []).map((field) => (
                        <label key={field.key}>
                          {field.key}
                          <input
                            type="text"
                            value={reportForm.fieldData[field.key] || ''}
                            onChange={(e) => updateFieldData(field.key, e.target.value)}
                            placeholder={`${field.key} değerini girin`}
                          />
                        </label>
                      ))}
                      {(!selectedTemplate.field_map_json || selectedTemplate.field_map_json.length === 0) && (
                        <div className="muted">Bu şablonda tanımlı alan yok.</div>
                      )}
                    </div>
                  </div>
                )}
                <button type="submit">Rapor üret</button>
              </form>

              <div className="list">
                {reports.length === 0 && <div className="muted">Rapor yok</div>}
                {reports.map((r) => (
                  <div key={r.id} className="list-item">
                    <div>
                      <strong>{r.doc_number}</strong>
                      <div className="muted">Template #{r.template_id} | Customer {r.customer_id || '-'}</div>
                    </div>
                    <div className="actions">
                      <a className="secondary" href={`${API_BASE}/files/generated/${r.doc_number}.pdf`} target="_blank" rel="noreferrer">PDF</a>
                      {isAdmin && (
                        <button
                          className="danger"
                          style={{ marginLeft: '8px', background: '#ef4444', border: '1px solid #b91c1c' }}
                          onClick={() => handleDeleteReport(r.id)}
                        >
                          Sil
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {status && <div className="status">{status}</div>}
    </div>
  );
}

export default App;
