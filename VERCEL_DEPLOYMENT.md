# Vercel Deployment Guide - Mark-II-S2

**Branch:** Mark-II-S2  
**Date:** 22 Aralık 2025  
**Purpose:** Report Mark II sistemini Vercel platformunda deploy etmek

---

## 📋 Ön Hazırlık

### Gereksinimler
- ✅ Vercel hesabı ([vercel.com](https://vercel.com))
- ✅ GitHub repository bağlantısı
- ✅ MySQL database (PlanetScale, Railway, veya Supabase önerilir)
- ✅ File storage (Vercel Blob Storage veya AWS S3)

---

## 🚀 Deployment Adımları

### 1. Vercel CLI Kurulumu
```bash
npm install -g vercel
vercel login
```

### 2. Proje Bağlantısı
```bash
# Proje klasöründe
vercel

# İlk deployment için soruları yanıtla:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? report-mark-ii-s2
# - Directory? ./
# - Override settings? No
```

### 3. Environment Variables Ayarlama

Vercel Dashboard'da **Settings > Environment Variables** bölümünden:

```env
# Database
DB_HOST=your-mysql-host.com
DB_PORT=3306
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=report_mark2

# Application
APP_PORT=3000
APP_HOST=0.0.0.0
SESSION_SECRET=your-super-secret-key-change-this
DOC_PREFIX=P

# Storage (Vercel Blob veya S3)
STORAGE_TYPE=vercel-blob
BLOB_READ_WRITE_TOKEN=vercel_blob_token_here

# Admin IPs (Vercel'de IP değişebilir, authentication'a güvenin)
ADMIN_IPS=0.0.0.0/0
```

### 4. Database Setup

**PlanetScale Önerilen Adımlar:**
1. [PlanetScale](https://planetscale.com) hesabı oluştur
2. Yeni database oluştur: `report-mark-ii`
3. Connection string'i kopyala
4. `sql/setup.sql` dosyasını PlanetScale Console'da çalıştır

```bash
# Alternatif: pscale CLI ile
pscale auth login
pscale database create report-mark-ii
pscale shell report-mark-ii main < sql/setup.sql
```

---

## 📁 File Storage Çözümü

### Seçenek 1: Vercel Blob Storage (Önerilen)

```bash
# @vercel/blob kurulumu
npm install @vercel/blob
```

**storage.js güncellemesi gerekiyor:**
- Local file system yerine Vercel Blob API kullan
- PDF upload/download işlemlerini Blob'a yönlendir

### Seçenek 2: AWS S3

```bash
npm install aws-sdk
```

Environment variables:
```env
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=report-mark-ii-files
```

---

## 🔧 Yapılandırma Değişiklikleri

### Backend Değişiklikleri

1. **src/config.js** - Vercel environment'a adapte
2. **src/db.js** - Serverless connection pooling
3. **src/storage.js** - Blob/S3 entegrasyonu
4. **src/app.js** - Express serverless handler

### Frontend Değişiklikleri

1. **vite.config.js** - Build output optimize
2. **package.json** - Build script güncelle
3. **API_BASE** - Environment variable kullan

---

## ⚠️ Önemli Notlar

### Vercel Sınırlamaları
- **Serverless Function Timeout:** 10 saniye (Hobby), 60 saniye (Pro)
- **Request Body Size:** 4.5 MB
- **Response Size:** 4.5 MB
- **File System:** Read-only (ephemeral /tmp)

### Çözümler
- ✅ Büyük PDF işlemleri için chunked upload
- ✅ File storage için external service (Blob/S3)
- ✅ Database connection pooling (@vercel/postgres veya planetscale)
- ✅ Long-running tasks için background jobs (Vercel Cron veya queue)

---

## 🧪 Test Etme

```bash
# Local test
vercel dev

# Production test
vercel --prod
```

---

## 📊 Monitoring

Vercel Dashboard'da otomatik olarak:
- ✅ Real-time logs
- ✅ Analytics
- ✅ Performance metrics
- ✅ Error tracking

---

## 🔄 Sürekli Deployment

**Otomatik Deployment:**
- `Mark-II-S2` branch'ine her push → Vercel otomatik deploy
- Pull request → Preview deployment
- Merge to main → Production deployment

**Manual Deployment:**
```bash
vercel --prod
```

---

## 📝 Yapılacaklar (TODO)

- [ ] Database migration PlanetScale/Railway'e
- [ ] File storage Vercel Blob'a geçiş
- [ ] Serverless function optimizasyonu
- [ ] Environment variables setup
- [ ] Frontend API endpoint güncelleme
- [ ] Production testing
- [ ] Domain bağlama (opsiyonel)

---

## 🆘 Sorun Giderme

### Database Connection Error
```
Error: connect ETIMEDOUT
```
**Çözüm:** PlanetScale/Railway connection string'i kontrol et, firewall ayarlarını kontrol et

### File Upload Error
```
Error: EROFS: read-only file system
```
**Çözüm:** Vercel Blob Storage entegrasyonu gerekli

### Timeout Error
```
Error: Function execution timeout
```
**Çözüm:** PDF işleme süresini optimize et veya Pro plan'a geç

---

## 🔗 Faydalı Linkler

- [Vercel Documentation](https://vercel.com/docs)
- [PlanetScale Documentation](https://planetscale.com/docs)
- [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob)
- [@vercel/node Runtime](https://vercel.com/docs/runtimes#official-runtimes/node-js)
