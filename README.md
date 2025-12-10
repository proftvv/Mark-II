# Report Mark-II

LAN üzerinden erişilen **PDF rapor doldurma ve versiyonlama** uygulaması.

## 📁 Proje Yapısı

```
Report-Mark2/
├── Mark-II/                 # Ana proje klasörü
│   ├── src/                # Backend kaynağı
│   ├── frontend/           # React uygulaması
│   ├── sql/                # Database şeması
│   └── package.json
├── run-all.bat             # Hızlı başlatma (Mark-II'de çalıştırır + otomatik push)
└── .git/                   # Git repository
```

## 🚀 Başlangıç

### 1. Bağımlılıkları Yükle

```bash
cd Mark-II
npm install
cd frontend
npm install
cd ..
```

### 2. Ortam Değişkenlerini Ayarla

`Mark-II/env` dosyasını düzenle:

```env
APP_PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=2503
STORAGE_ROOT=Z:\Report-Mark-II\raporlar
```

### 3. Başlat

#### Seçenek 1: Hızlı Başlangıç (Tavsiye Edilen)

```bash
./run-all.bat
```

Bu komut:
- ✅ Backend + Frontend başlatır
- ✅ Servisi kapatınca otomatik olarak GitHub'a push yapar

#### Seçenek 2: Manuel Başlangıç

```bash
cd Mark-II
npm run start:all
```

#### Seçenek 3: Manuel Push

```bash
cd Mark-II
.\push-to-github.ps1 "Açıklaması"
```

## 🔐 GitHub Yapılandırması

- **Repository**: https://github.com/proftvv/ReportDisTicaret
- **Branch**: `Mark-2`
- **Tüm Push'lar**: `Mark-II` klasöründe yapılır

## 📝 Versiyon

Hali hazırda: **v0.0.9**

Her güncelleme yapıldığında versiyon otomatik artar.

## 🔧 Teknolojiler

- **Backend**: Node.js + Express
- **Frontend**: React + Vite
- **Database**: MySQL/MariaDB
- **PDF İşleme**: pdf-lib

## 📞 İletişim

- **GitHub**: https://github.com/proftvv/ReportDisTicaret
- **E-posta**: ozcanyilmazcelebi2016@gmail.com
