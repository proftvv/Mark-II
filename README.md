# 📊 Mark II

**Dijital Raporlama Platformu**

**Versiyon:** `1.5.0` | **Son Güncelleme:** 22 Aralık 2025

Mark II, şirket içi PDF raporlama süreçlerini dijitalleştiren, LAN/WAN üzerinden erişilebilir modern bir web uygulamasıdır. Masaüstü yazılımlarının yerini alarak, herhangi bir cihazdan (PC, Tablet, Mobil) kolayca rapor oluşturulmasını ve yönetilmesini sağlar.

---

## ✨ v1.5.0 Release Highlights

Bu sürüm, admin yetkilerini genişleten ve sistem görünürlüğünü artıran özellikler içerir:

- ✅ **Kullanıcı Yönetimi:** Tam CRUD işlemleri, rol ataması, şifre yönetimi
- ✅ **Sistem Logları:** Gerçek zamanlı log görüntüleme, filtreleme ve istatistikler
- ✅ **Gelişmiş Debug:** Request/response logging, detaylı hata takibi
- ✅ **RBAC Geliştirmeleri:** Database role kolonu, rol bazlı yetkilendirme
- ✅ **Tek Pencere Başlatma:** start.bat ile concurrently kullanımı
- 🔍 **Comprehensive Logging:** Her işlem loglanıyor (INFO/WARN/ERROR)

---

## 🎯 Proje Amacı ve Özellikler

Standard PDF şablonları üzerine dinamik veri girişi yaparak hatasız, standartlara uygun ve takip edilebilir belgeler üretmek.

### Temel Özellikler

*   **📄 Dinamik PDF Şablonları**  
    Admin kullanıcılar ham PDF yükleyip, sürükle-bırak ile veri alanlarını tanımlar.
    
*   **✍️ Kolay Veri Girişi**  
    Kullanıcılar form arayüzünden alanları doldurarak saniyeler içinde PDF oluşturur.
    
*   **🗂️ Otomatik Belge Numaralandırma**  
    Her rapor benzersiz belge numarası alır (Örn: `P-20251217-042`).
    
*   **🔒 Rol Tabanlı Yetkilendirme (kullanıcı yönetimi, sistem logları, tüm raporları görme/silme
    *   **Kullanıcı:** Sadece rapor oluşturma ve görüntüleme
    
*   **👥 Kullanıcı Yönetimi (Admin)**
    Kullanıcı ekleme, düzenleme, silme ve rol ataması (User/Admin).
    
*   **📋 Sistem Logları (Admin)**
    Gerçek zamanlı log görüntüleme, filtreleme (INFO/WARN/ERROR) ve istatistikler.e, kullanıcı yönetimi
    *   **Kullanıcı:** Sadece rapor oluşturma ve görüntüleme
    
*   **🔍 Gelişmiş Arama & Filtreleme**  
    Belge numarası, müşteri ID, tarih aralığı ile anında filtreleme.
    
*   **🎨 Modern & Responsive UI**  
    React tabanlı, tab navigasyon, karanlık/aydınlık mod desteği.

---

## 🏗️ Teknoloji Yığını (Tech Stack)

| Alan | Teknoloji | Açıklama |
|------|-----------|----------|
| **Frontend** | **React + Vite** | Hızlı ve modern kullanıcı arayüzü. |
| **Backend** | **Node.js (Express)** | REST API ve iş mantığı. |
| **Database** | **MySQL / MariaDB** | Kullanıcı, şablon ve rapor verileri. |
| **PDF Engine** | **pdf-lib** | PDF okuma, işleme ve oluşturma. |
| **Security** | **Bcrypt + Helmet** | Şifreleme ve güvenlik katmanları. |

---

## 🚀 Hızlı Başlangıç

### ⚡ Tek Komut ile Başlatma (Önerilen)

**Windows:**
```batch
start.bat
```

**PowerShell:**
```powershell
.\start.ps1
```

Bu script otomatik olarak:
- ✅ Node.js kurulumunu kontrol eder
- ✅ Eksik bağımlılıkları yükler (`npm install`)
- ✅ Backend'i başlatır (port 3000)
- ✅ Frontend'i başlatır (port 5173)
- ✅ Her iki servisi ayrı pencerede çalıştırır

### 🛠️ Manuel Kurulum

**1. Gereksinimler:**
- Node.js 18+ ([İndir](https://nodejs.org/))
- MySQL 5.7+ veya MariaDB 10.5+

**2. Bağımlılıkları Yükle:**
```bash
npm install
cd frontend && npm install && cd ..
```

**3. Veritabanı Kurulumu:**
```bash
# MySQL/MariaDB'ye bağlan ve setup.sql'i çalıştır
mysql -u root -p < sql/setup.sql
```

**4. Ortam Değişkenlerini Ayarla:**
`.env` dosyasını düzenle:
```env
DB_HOST=localhost
DB_USER=markii_db
DB_PASSWORD=2503
DB_NAME=markii_db
APP_PORT=3000
SESSION_SECRET=your-secret-key-here
```

**5. Sunucuları Başlat:**
```bash
# Backend (Terminal 1)
node src/app.js

# Frontend (Terminal 2)
cd frontend && npm run dev
```

**Erişim:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Proxy: Frontend otomatik olarak backend'e yönlendirir

---

## 🔑 Varsayılan Admin Girişi

**Kullanıcı Adı:** `proftvv`  
**Şifre:** `admin123`

> ⚠️ **GÜVENLİK UYARISI:** İlk girişten sonra mutlaka şifrenizi değiştirin!

Şifre değiştirme:
```bash
node scripts/fix-password.js
```

---

## 📈 Sürüm Sistemi
1.5.0` - User Management & System Logs (Admin features expansion
Proje [Semantic Versioning](https://semver.org/) kullanır: **`MAJOR.MINOR.PATCH`**

**Mevcut Sürüm:** `v2.0.0-alpha` (Mars Release)

**Sürüm Geçmişi:**
- `v2.0.0` - Mars: Tam sistem yenilenmesi (Alpha, Devam Ediyor)
- `v1.4.2` - Template editing, admin features separation
- `v1.3.0` - Dashboard upgrade, tab navigation, search & filters
- `v1.2.0` - Enhanced authentication (username OR custom_id)
- `v1.1.x` - PDF improvements, error codes, logger service
- `v0.0.x` - Initial development, database migration

Detaylı değişiklik geçmişi için [VERSION](VERSION) dosyasına bakın.

---
, users, logs)
│   ├── services/           # Business logic (pdfService, logger)
│   ├── middleware/         # Auth, RBAC, request logger, error handler
```
MARK-II/
├── src/                    # Backend (Node.js/Express)
│   ├── routes/             # API Routes (auth, templates, reports)
│   ├── services/           # Business logic (pdfService, logger)
│   ├── middleware/         # Auth & RBAC middleware
│   ├── utils/              # Utilities (errorCodes, roleValidation)
│   ├── app.js              # Express server
│   ├── db.js               # MySQL connection pool
│   └── config.js           # Configuration
├── frontend/               # Frontend (React + Vite)
│   ├── src/
│   │   ├── App.jsx         # Main application
│   │   ├── App.css         # Styles
│   │   ├── main.jsx        # Entry point
│   │   └── components/     # React components (Users, Logs, PDFCanvas)
│   ├── vite.config.js      # Vite configuration
│   └── package.json        # Frontend dependencies
├── sql/                    # Database scripts
│   ├── setup.sql           # Complete database setup (one-command)
│   └── README.md           # SQL documentation
├── scripts/                # Utility scripts
│   ├── fix-password.js     # Reset password
│   ├── add-role-column.js  # Database migration for roles
│   └── test-endpoints.js   # API endpoint testing
│   └── fix-password.js     # Reset password
├── logs/                   # Application logs
├── temp_uploads/           # Temporary file storage
├── migrations/             # Database migrations
├── start.bat               # Windows startup script
├── start.ps1               # PowerShell startup script
├── .env                    # Environment variables (create from env.example)
├── package.json            # Backend dependencies
├── VERSION                 # Centralized version tracking
└── README.md               # This file
```

---

## 🔧 Geliştirme

### Yeni Kullanıcı Ekleme
```bash
node scripts/add-user.js
```

### Şifre Sıfırlama
```bash
node scripts/fix-password.js
```

### Database Migration
```bash
mysql -u markii_db -p markii_db < migrations/XXX_migration_name.sql
```

### Logları İzleme
```bash
# PowerShell
Get-Content logs/app.log -Tail 50 -Wait

# CMD
tail -f logs/app.log  # (Windows Git Bash)
```

---

## 📊 Kullanım Senaryoları

### 1️⃣ Admin: Yeni Şablon Ekleme
1. "Şablonlar" sekmesine git
2. PDF dosyasını yükle
3. Sürükle-bırak ile veri alanlarını tanımla
4. Şablonu kaydet

### 2️⃣ Kullanıcı: Rapor Oluşturma
1. "Ana Sayfa"da şablon seç
2. Müşteri ID gir
3. Form alanlarını doldur
4. "Rapor Oluştur" butonuna tıkla
5. PDF otomatik indirilir

### 3️⃣ Arşivde Arama
1. "Arşiv" sekmesine git
### 4️⃣ Admin: Kullanıcı Yönetimi
1. "Kullanıcılar" sekmesine git
2. "➕ Yeni Kullanıcı" butonuna tıkla
3. Kullanıcı bilgilerini gir (username, ID, şifre, rol)
4. Kaydet - Kullanıcı hemen aktif olur

### 5️⃣ Admin: Sistem Loglarını İzleme
1. "Loglar" sekmesine git
2. Seviye filtresi ile ERROR loglarını gör
3. Arama ile spesifik olayları bul
4. Tarih aralığı ile belirli periyodu incele2. Belge numarası veya müşteri ID ile ara
3. Tarih aralığı filtrele
4. İstediğin raporu indir veya sil (admin)

---

## 🔒 Güvenlik

- ✅ **Bcrypt** şifreleme (10 salt rounds)
- ✅ **Express Session** güvenli oturum yönetimi
- ✅ **Helmet** HTTP header güvenliği
- ✅ **CORS** yapılandırması
- ✅ **RBAC** rol tabanlı yetkilendirme
- ✅ **Admin Action Logging** tüm admin işlemleri kaydedilir
- ✅ **Error Codes** standardize hata yönetimi

---

## 🐛 Bilinen Sorunlar & Çözümler

### Port 3000 kullanımda hatası
```bash
# Windows'ta çalışan servisi bul
netstat -ano | findstr :3000

# Process ID'yi not al ve kapat
taskkill /PID <process_id> /F
```

### MariaDB authentication hatası
```powershell
# PowerShell (Admin)
Restart-Service MariaDB
``` (v1.5.0 dahil)
- [ERROR_CODE_DEBUG.md](ERROR_CODE_DEBUG.md) - Hata kodları ve debug rehberi

### Frontend production build
```bash
cd frontend
npm run build
# Build dosyaları: frontend/dist/
```

---

## 📚 Ek Dokümantasyon

- [VERSION](VERSION) - Detaylı versiyon geçmişi
- [DEPLOYMENT_AAPANEL.md](DEPLOYMENT_AAPANEL.md) - Windows Server deployment rehberi
- [ERROR_CODES.md](ERROR_CODES.md) - Hata kodları referansı
- [V2_TRANSITION_PLAN.md](V2_TRANSITION_PLAN.md) - v2.0.0 geçiş planı
- [sql/README.md](sql/README.md) - Veritabanı kurulum rehberi

---

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

---

## 👨‍💻 Geliştirici
v1.5.0 - Empowering Admins with User & Log Management"*  
**v1.5.0** | Son Güncelleme: 22
📧 [GitHub](https://github.com/proftvv)  

---

## 🙏 Teşekkürler

Bu projeyi geliştirmede kullanılan açık kaynak kütüphanelere teşekkürler:
- React, Vite, Express, pdf-lib, bcrypt, react-pdf ve daha fazlası

---

*"Mars Release - A New Foundation for Mark II"*  
**v2.0.0-alpha** | Son Güncelleme: 17 Aralık 2025

