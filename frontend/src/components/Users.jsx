import React, { useState, useEffect } from 'react';

export default function Users({ apiFetch }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    custom_id: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    // Only load if we have session
    console.log('[Users] Component mounted');
    loadUsers();
  }, []);

  async function loadUsers() {
    console.log('[Users] Loading users...');
    setLoading(true);
    try {
      const data = await apiFetch('/users', { method: 'GET' });
      console.log('[Users] Loaded users:', data);
      setUsers(data.users || []);
      setStatus('');
    } catch (err) {
      console.error('[Users] Load error:', err);
      setStatus(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      if (editingUser) {
        // Update existing user
        await apiFetch(`/users/${editingUser.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            username: formData.username,
            custom_id: formData.custom_id || null,
            password: formData.password || undefined,
            role: formData.role
          })
        });
        setStatus('✅ Kullanıcı başarıyla güncellendi');
      } else {
        // Create new user
        if (!formData.password) {
          setStatus('❌ Yeni kullanıcı için şifre gerekli');
          setLoading(false);
          return;
        }
        await apiFetch('/users', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        setStatus('✅ Kullanıcı başarıyla oluşturuldu');
      }

      // Reset form and reload
      resetForm();
      await loadUsers();
    } catch (err) {
      setStatus(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(userId, username) {
    if (!confirm(`"${username}" kullanıcısını silmek istediğinizden emin misiniz?`)) {
      return;
    }

    setLoading(true);
    setStatus('');

    try {
      await apiFetch(`/users/${userId}`, { method: 'DELETE' });
      setStatus('✅ Kullanıcı başarıyla silindi');
      await loadUsers();
    } catch (err) {
      setStatus(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(user) {
    setEditingUser(user);
    setFormData({
      username: user.username,
      custom_id: user.custom_id || '',
      password: '',
      role: user.role
    });
    setShowForm(true);
  }

  function resetForm() {
    setEditingUser(null);
    setFormData({
      username: '',
      custom_id: '',
      password: '',
      role: 'user'
    });
    setShowForm(false);
  }

  return (
    <div>
      <section className="card">
        <div className="section-head">
          <h2>👥 Kullanıcı Yönetimi</h2>
          {!showForm && (
            <button 
              className="primary" 
              onClick={() => setShowForm(true)}
              disabled={loading}
            >
              ➕ Yeni Kullanıcı
            </button>
          )}
        </div>

        {status && (
          <div style={{ 
            padding: '10px', 
            marginBottom: '15px',
            background: status.includes('✅') ? '#0d4d0d' : '#4d0d0d',
            borderRadius: '4px'
          }}>
            {status}
          </div>
        )}

        {showForm && (
          <div style={{ 
            background: '#1e1e1e', 
            padding: '20px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            border: '1px solid #333'
          }}>
            <h3>{editingUser ? '✏️ Kullanıcı Düzenle' : '➕ Yeni Kullanıcı Ekle'}</h3>
            <form className="form-grid" onSubmit={handleSubmit}>
              <label>
                Kullanıcı Adı *
                <input
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  placeholder="Örn: ahmet"
                />
              </label>

              <label>
                Özel ID
                <input
                  value={formData.custom_id}
                  onChange={(e) => setFormData({ ...formData, custom_id: e.target.value })}
                  placeholder="Örn: 2503 (opsiyonel)"
                />
              </label>

              <label>
                Şifre {editingUser && '(boş bırakırsanız değişmez)'}
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingUser ? 'Yeni şifre (opsiyonel)' : 'Şifre *'}
                  required={!editingUser}
                />
              </label>

              <label>
                Rol
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="user">👤 Kullanıcı</option>
                  <option value="admin">👑 Admin</option>
                </select>
              </label>

              <div style={{ display: 'flex', gap: '10px', gridColumn: '1 / -1' }}>
                <button type="submit" className="primary" disabled={loading}>
                  {loading ? '⏳ İşleniyor...' : editingUser ? '💾 Güncelle' : '➕ Oluştur'}
                </button>
                <button 
                  type="button" 
                  className="secondary" 
                  onClick={resetForm}
                  disabled={loading}
                >
                  ❌ İptal
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            minWidth: '600px'
          }}>
            <thead>
              <tr style={{ 
                background: '#252525', 
                borderBottom: '2px solid #333'
              }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Kullanıcı Adı</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Özel ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Rol</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Oluşturulma</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>
                    ⏳ Yükleniyor...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>
                    Kullanıcı bulunamadı
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr 
                    key={user.id}
                    style={{ 
                      borderBottom: '1px solid #2a2a2a',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#252525'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px' }}>{user.id}</td>
                    <td style={{ padding: '12px', fontWeight: '500' }}>{user.username}</td>
                    <td style={{ padding: '12px' }}>
                      {user.custom_id ? (
                        <code style={{ 
                          background: '#2a2a2a', 
                          padding: '2px 6px', 
                          borderRadius: '3px' 
                        }}>
                          {user.custom_id}
                        </code>
                      ) : (
                        <span style={{ color: '#666' }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {user.role === 'admin' ? (
                        <span style={{ 
                          background: '#4a3000', 
                          color: '#ffb300', 
                          padding: '4px 8px', 
                          borderRadius: '4px',
                          fontSize: '0.85em',
                          fontWeight: '600'
                        }}>
                          👑 ADMIN
                        </span>
                      ) : (
                        <span style={{ 
                          background: '#1a2a3a', 
                          color: '#6ba3d8', 
                          padding: '4px 8px', 
                          borderRadius: '4px',
                          fontSize: '0.85em'
                        }}>
                          👤 User
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px', fontSize: '0.9em', color: '#999' }}>
                      {new Date(user.created_at).toLocaleString('tr-TR')}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          className="secondary"
                          onClick={() => handleEdit(user)}
                          disabled={loading}
                          style={{ padding: '6px 12px', fontSize: '0.9em' }}
                        >
                          ✏️ Düzenle
                        </button>
                        <button
                          className="secondary"
                          onClick={() => handleDelete(user.id, user.username)}
                          disabled={loading}
                          style={{ 
                            padding: '6px 12px', 
                            fontSize: '0.9em',
                            background: '#4d0d0d',
                            borderColor: '#660000'
                          }}
                        >
                          🗑️ Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          background: '#1e1e1e', 
          borderRadius: '4px',
          fontSize: '0.9em',
          color: '#999'
        }}>
          Toplam {users.length} kullanıcı
        </div>
      </section>
    </div>
  );
}
