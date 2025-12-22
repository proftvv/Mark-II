import React, { useState, useEffect } from 'react';

export default function Logs({ apiFetch }) {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [filters, setFilters] = useState({
    level: '',
    search: '',
    startDate: '',
    endDate: '',
    limit: '500'
  });

  useEffect(() => {
    console.log('[Logs] Component mounted');
    loadLogs();
    loadStats();
  }, []);

  async function loadLogs() {
    console.log('[Logs] Loading logs...');
    setLoading(true);
    setStatus('');
    try {
      const params = new URLSearchParams();
      if (filters.level) params.append('level', filters.level);
      if (filters.search) params.append('search', filters.search);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.limit) params.append('limit', filters.limit);

      const data = await apiFetch(`/logs?${params.toString()}`, { method: 'GET' });
      console.log('[Logs] Loaded logs:', data);
      setLogs(data.logs || []);
      
      if (data.total > data.returned) {
        setStatus(`📊 Toplam ${data.total} log, ${data.returned} tanesi gösteriliyor`);
      }
    } catch (err) {
      console.error('[Logs] Load error:', err);
      setStatus(`❌ ${err.message}`);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    console.log('[Logs] Loading stats...');
    try {
      const data = await apiFetch('/logs/stats', { method: 'GET' });
      console.log('[Logs] Loaded stats:', data);
      setStats(data);
    } catch (err) {
      console.error('[Logs] Stats load error:', err);
      // Don't show error to user for stats, it's optional
    }
  }

  async function handleClearLogs() {
    if (!confirm('TÜM LOGLARI temizlemek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz! (Yedek oluşturulacak)')) {
      return;
    }

    setLoading(true);
    try {
      const data = await apiFetch('/logs/clear', { method: 'DELETE' });
      setStatus(`✅ ${data.message}`);
      await loadLogs();
      await loadStats();
    } catch (err) {
      setStatus(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  function getLevelColor(level) {
    switch (level?.toLowerCase()) {
      case 'error': return '#ff4444';
      case 'warn': return '#ffaa00';
      case 'info': return '#4488ff';
      default: return '#999';
    }
  }

  function getLevelIcon(level) {
    switch (level?.toLowerCase()) {
      case 'error': return '🔴';
      case 'warn': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📝';
    }
  }

  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  return (
    <div>
      <section className="card">
        <div className="section-head">
          <h2>📋 Sistem Logları</h2>
          <button 
            className="secondary" 
            onClick={handleClearLogs}
            disabled={loading}
            style={{ 
              background: '#4d0d0d',
              borderColor: '#660000'
            }}
          >
            🗑️ Logları Temizle
          </button>
        </div>

        {/* Statistics */}
        {stats && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <div style={{ 
              background: '#1e1e1e', 
              padding: '15px', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.85em', color: '#999', marginBottom: '5px' }}>
                Toplam Log
              </div>
              <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>
                {stats.total.toLocaleString()}
              </div>
            </div>

            <div style={{ 
              background: '#1e2f4d', 
              padding: '15px', 
              borderRadius: '8px',
              textAlign: 'center',
              borderLeft: '3px solid #4488ff'
            }}>
              <div style={{ fontSize: '0.85em', color: '#aac8ff', marginBottom: '5px' }}>
                ℹ️ Info
              </div>
              <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#4488ff' }}>
                {stats.byLevel.info.toLocaleString()}
              </div>
            </div>

            <div style={{ 
              background: '#4d3a1e', 
              padding: '15px', 
              borderRadius: '8px',
              textAlign: 'center',
              borderLeft: '3px solid #ffaa00'
            }}>
              <div style={{ fontSize: '0.85em', color: '#ffd699', marginBottom: '5px' }}>
                ⚠️ Warning
              </div>
              <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#ffaa00' }}>
                {stats.byLevel.warn.toLocaleString()}
              </div>
            </div>

            <div style={{ 
              background: '#4d1e1e', 
              padding: '15px', 
              borderRadius: '8px',
              textAlign: 'center',
              borderLeft: '3px solid #ff4444'
            }}>
              <div style={{ fontSize: '0.85em', color: '#ffaaaa', marginBottom: '5px' }}>
                🔴 Error
              </div>
              <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#ff4444' }}>
                {stats.byLevel.error.toLocaleString()}
              </div>
            </div>

            <div style={{ 
              background: '#1e1e1e', 
              padding: '15px', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.85em', color: '#999', marginBottom: '5px' }}>
                Dosya Boyutu
              </div>
              <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>
                {formatBytes(stats.fileSize)}
              </div>
            </div>
          </div>
        )}

        {status && (
          <div style={{ 
            padding: '10px', 
            marginBottom: '15px',
            background: status.includes('✅') ? '#0d4d0d' : status.includes('❌') ? '#4d0d0d' : '#1e1e1e',
            borderRadius: '4px'
          }}>
            {status}
          </div>
        )}

        {/* Filters */}
        <div style={{ 
          background: '#1e1e1e', 
          padding: '15px', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginBottom: '15px', fontSize: '1em' }}>🔍 Filtreler</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px'
          }}>
            <label style={{ fontSize: '0.9em' }}>
              Seviye
              <select
                value={filters.level}
                onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                style={{ marginTop: '5px' }}
              >
                <option value="">Tümü</option>
                <option value="info">ℹ️ Info</option>
                <option value="warn">⚠️ Warning</option>
                <option value="error">🔴 Error</option>
              </select>
            </label>

            <label style={{ fontSize: '0.9em' }}>
              Arama
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Mesaj veya meta ara..."
                style={{ marginTop: '5px' }}
              />
            </label>

            <label style={{ fontSize: '0.9em' }}>
              Başlangıç Tarihi
              <input
                type="datetime-local"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                style={{ marginTop: '5px' }}
              />
            </label>

            <label style={{ fontSize: '0.9em' }}>
              Bitiş Tarihi
              <input
                type="datetime-local"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                style={{ marginTop: '5px' }}
              />
            </label>

            <label style={{ fontSize: '0.9em' }}>
              Limit
              <select
                value={filters.limit}
                onChange={(e) => setFilters({ ...filters, limit: e.target.value })}
                style={{ marginTop: '5px' }}
              >
                <option value="100">100</option>
                <option value="500">500</option>
                <option value="1000">1000</option>
                <option value="5000">5000</option>
              </select>
            </label>
          </div>

          <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
            <button 
              className="primary" 
              onClick={loadLogs}
              disabled={loading}
            >
              {loading ? '⏳ Yükleniyor...' : '🔍 Filtrele'}
            </button>
            <button 
              className="secondary" 
              onClick={() => {
                setFilters({
                  level: '',
                  search: '',
                  startDate: '',
                  endDate: '',
                  limit: '500'
                });
              }}
            >
              🔄 Sıfırla
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div style={{ overflowX: 'auto' }}>
          {loading && logs.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              ⏳ Loglar yükleniyor...
            </div>
          ) : logs.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
              📭 Log bulunamadı
            </div>
          ) : (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '8px' 
            }}>
              {logs.map((log, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#1e1e1e',
                    padding: '12px',
                    borderRadius: '6px',
                    borderLeft: `4px solid ${getLevelColor(log.level)}`,
                    fontSize: '0.9em'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    marginBottom: '6px'
                  }}>
                    <span style={{ fontSize: '1.2em' }}>
                      {getLevelIcon(log.level)}
                    </span>
                    <span style={{ 
                      color: getLevelColor(log.level), 
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      fontSize: '0.85em'
                    }}>
                      {log.level}
                    </span>
                    <span style={{ color: '#666', fontSize: '0.85em' }}>
                      {new Date(log.timestamp).toLocaleString('tr-TR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  <div style={{ marginLeft: '32px' }}>
                    <div style={{ marginBottom: '6px' }}>
                      {log.message}
                    </div>
                    
                    {log.meta && Object.keys(log.meta).length > 0 && (
                      <details style={{ marginTop: '8px' }}>
                        <summary style={{ 
                          cursor: 'pointer', 
                          color: '#999',
                          fontSize: '0.9em',
                          userSelect: 'none'
                        }}>
                          📎 Meta veriler
                        </summary>
                        <pre style={{ 
                          background: '#0d0d0d', 
                          padding: '10px', 
                          borderRadius: '4px',
                          marginTop: '8px',
                          overflow: 'auto',
                          fontSize: '0.85em',
                          border: '1px solid #2a2a2a'
                        }}>
                          {JSON.stringify(log.meta, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {logs.length > 0 && (
          <div style={{ 
            marginTop: '20px', 
            padding: '10px', 
            background: '#1e1e1e', 
            borderRadius: '4px',
            fontSize: '0.9em',
            color: '#999',
            textAlign: 'center'
          }}>
            {logs.length} log gösteriliyor
          </div>
        )}
      </section>
    </div>
  );
}
