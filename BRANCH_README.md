# Mark-II-S2 Branch - Vercel Deployment

Bu branch, Report Mark II sistemini **Vercel** platformunda deploy etmek için özel olarak yapılandırılmıştır.

## 🎯 Branch Amacı

- Vercel serverless architecture'a adaptasyon
- Cloud database desteği (PlanetScale/Railway)
- Vercel Blob Storage entegrasyonu
- Production-ready deployment konfigürasyonu

## 📦 Değişiklikler

### Yeni Dosyalar

1. **vercel.json** - Vercel deployment konfigürasyonu
2. **.vercelignore** - Deployment'a dahil edilmeyecek dosyalar
3. **VERCEL_DEPLOYMENT.md** - Detaylı deployment guide
4. **.env.vercel.example** - Environment variables dokümantasyonu
5. **api/index.js** - Vercel serverless function entry point
6. **src/config.vercel.js** - Vercel-optimized configuration
7. **src/db.vercel.js** - Serverless database connection pooling
8. **src/services/blobStorage.js** - Vercel Blob Storage adapter

### Değiştirilen Dosyalar

1. **frontend/package.json** - `vercel-build` script eklendi
2. **frontend/vite.config.js** - Build optimization, chunking
3. **frontend/src/App.jsx** - API_BASE `/api` olarak güncellendi
4. **package.json** - `@vercel/blob` dependency eklendi

## 🚀 Deployment

### Hızlı Başlangıç

```bash
# Vercel CLI kur
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Production deployment
vercel --prod
```

### Detaylı Guide

Tüm deployment adımları için: **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)**

## 🔧 Gerekli Konfigürasyonlar

### 1. Database (Seçenekler)

- **PlanetScale** (Önerilen) - MySQL-compatible, serverless-friendly
- **Railway** - PostgreSQL/MySQL
- **Supabase** - PostgreSQL
- **AWS RDS** - Production

### 2. File Storage (Seçenekler)

- **Vercel Blob Storage** (Önerilen) - Native Vercel integration
- **AWS S3** - Enterprise storage
- **Cloudinary** - Image/PDF CDN

### 3. Environment Variables

Vercel Dashboard'da ayarlanması gereken değişkenler:

```env
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=report_mark2
SESSION_SECRET=random-secret-key
BLOB_READ_WRITE_TOKEN=vercel-blob-token
```

Detaylar: **[.env.vercel.example](./.env.vercel.example)**

## 📊 Branch Yapısı

```
Mark-II-S2/
├── api/                    # Vercel serverless functions
│   └── index.js           # API entry point
├── src/
│   ├── config.vercel.js   # Vercel config
│   ├── db.vercel.js       # Serverless DB pool
│   └── services/
│       └── blobStorage.js # Blob storage adapter
├── frontend/              # React frontend
│   └── dist/             # Build output
├── vercel.json           # Vercel config
├── .vercelignore         # Ignore file
└── VERCEL_DEPLOYMENT.md  # Deployment guide
```

## 🔄 Main Branch ile Senkronizasyon

```bash
# Main'den güncellemeleri al
git checkout Mark-II-S2
git merge main

# Conflict çözümü gerekirse
git mergetool
git commit
```

## ⚠️ Önemli Notlar

1. **Vercel Limits:**
   - Serverless function timeout: 10s (Hobby), 60s (Pro)
   - Max request size: 4.5 MB
   - Ephemeral file system (/tmp)

2. **Database:**
   - Connection pooling optimize edildi (limit: 1 for serverless)
   - PlanetScale önerilir (serverless-friendly)

3. **File Storage:**
   - Local storage kullanılamaz (ephemeral)
   - Vercel Blob veya S3 gerekli

## 📝 TODO

- [ ] PlanetScale database setup
- [ ] Vercel Blob Storage setup
- [ ] Environment variables configuration
- [ ] Initial deployment test
- [ ] Production deployment
- [ ] Custom domain (opsiyonel)

## 🔗 Yararlı Linkler

- [Vercel Documentation](https://vercel.com/docs)
- [PlanetScale Docs](https://planetscale.com/docs)
- [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob)

---

**Branch Sahibi:** Mark-II Team  
**Oluşturulma Tarihi:** 22 Aralık 2025  
**Son Güncelleme:** 22 Aralık 2025
