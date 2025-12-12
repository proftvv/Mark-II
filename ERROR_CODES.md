# Error Codes Dokumentasyonu (v1.4.0+)

MARK-II projesi tüm API hatalarını standartlaştırılmış error codes ile döndürüyor.

## Error Response Format

```json
{
  "error": "Açıklayıcı hata mesajı",
  "code": "XXX_NNN"
}
```

**Code Formatı**: `CATEGORY_NUMBER`
- İlk 3 harf: Kategori (AUTH, AUTHZ, VAL, RES, DB, FILE, PDF, SRV)
- Son 3 rakam: Sıra numarası (001-999)

---

## Error Kategorileri

### AUTH - Kimlik Doğrulama Hataları (401)

| Code | Mesaj | Çözüm |
|------|-------|--------|
| `AUTH_001` | Oturum bulunamadı. Lütfen giriş yapın. | Login sayfasına yönlendir |
| `AUTH_002` | Kullanıcı adı veya şifre hatalı. | Tekrar giriş yap |
| `AUTH_003` | Oturum süresi dolmuş. Lütfen tekrar giriş yapın. | Re-login iste |

---

### AUTHZ - Yetkilendirme Hataları (403)

| Code | Mesaj | Çözüm |
|------|-------|--------|
| `AUTHZ_001` | Bu işlemi yapmaya yetkili değilsiniz. | Feature gizle |
| `AUTHZ_002` | Bu işlem sadece yönetici tarafından yapılabilir. | Admin özelliklerini gizle |
| `AUTHZ_003` | Bu işlem sadece local makineden yapılabilir. | İşlemi lokal'den yap |
| `AUTHZ_004` | Yetkiniz bu işlemi yapmaya yetmiyor. | Feature gizle |

---

### VALIDATION - Doğrulama Hataları (400)

| Code | Mesaj | Çözüm |
|------|-------|--------|
| `VAL_001` | Gerekli alan eksik: {field} | Form alanını doldur |
| `VAL_002` | {field} formatı hatalı. | Format'ı kontrol et |
| `VAL_003` | Dosya yüklemesi gerekli. | Dosya seç |
| `VAL_004` | JSON formatı hatalı: {field} | JSON syntax kontrol et |

---

### RESOURCE - Kaynak Hataları (404)

| Code | Mesaj | Çözüm |
|------|-------|--------|
| `RES_001` | {resource} bulunamadı. | ID'yi kontrol et |
| `RES_002` | Şablon bulunamadı. | Listeyi yenile |
| `RES_003` | Rapor bulunamadı. | Listeyi yenile |

---

### DATABASE - Veritabanı Hataları (500)

| Code | Mesaj | Çözüm |
|------|-------|--------|
| `DB_001` | Veritabanı bağlantı hatası. | Server'ı kontrol et |
| `DB_002` | Veritabanı sorgusu başarısız. | Logs'u kontrol et |
| `DB_003` | İşlem başarısız oldu. | Retry et |

---

### FILE - Dosya Hataları (400/500)

| Code | Mesaj | Status | Çözüm |
|------|-------|--------|---------|
| `FILE_001` | Dosya yükleme başarısız. | 400 | Dosyayı kontrol et |
| `FILE_002` | Dosya okuma başarısız. | 500 | Server logs |
| `FILE_003` | Dosya yazma başarısız. | 500 | Disk alanı kontrol et |
| `FILE_004` | Geçersiz dosya türü. Yalnızca PDF. | 400 | PDF dosya yükle |

---

### PDF - PDF Hataları (500)

| Code | Mesaj | Çözüm |
|------|-------|--------|
| `PDF_001` | PDF işleme hatası. | PDF'i kontrol et |
| `PDF_002` | PDF oluşturma hatası. | Fields'ı kontrol et |
| `PDF_003` | PDF dosyası bozuk. | Yeni PDF yükle |

---

### SERVER - Sunucu Hataları (500)

| Code | Mesaj | Çözüm |
|------|-------|--------|
| `SRV_001` | Sunucu hatası. Lütfen daha sonra tekrar deneyin. | Retry et |
| `SRV_002` | Port zaten kullanımda. | Server'ı restart et |

---

## Frontend Integration Example

```javascript
async function apiFetch(path, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    // err.code: "AUTH_001", "VAL_003", etc.
    // err.error: "Açıklayıcı mesaj"
    throw new Error(err.error);
  }
  return res.json();
}

// Kullanım
try {
  await apiFetch('/templates', { method: 'POST', body: fd });
  setStatus('✅ Şablon eklendi');
} catch (err) {
  setStatus(`❌ ${err.message}`); // ❌ Gerekli alan eksik: name
}
```

---

## Admin Action Logging

Tüm admin işlemleri otomatik olarak log'lanıyor:

```
type: ADMIN_ACTION
user: proftvv
action: TEMPLATE_CREATED
timestamp: 2025-12-12T14:30:00Z
```

**İşlemler**:
- `TEMPLATE_CREATED`: Şablon ekleme
- `REPORT_DELETED`: Rapor silme
- `UNAUTHORIZED_IP_ACCESS`: Yetkisiz IP erişim

---

## v1.3.0'dan Migration

**Eski Format**:
```json
{ "error": "Mesaj" }
```

**Yeni Format**:
```json
{ "error": "Mesaj", "code": "AUTH_001" }
```

Frontend'leri güncelle: `err.message` yerine `err.code` kontrol et.

---

## Sürüm Tarihi

- **v1.4.0**: Error codes sistemi eklendi (AUTH, AUTHZ, VAL, RES, DB, FILE, PDF, SRV)
- **v1.3.0 ve öncesi**: Basit "error" field


