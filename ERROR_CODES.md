# Hata Kodları (Error Codes)

Bu dosya, uygulamada kullanılan hata kodlarını ve anlamlarını listeler.

## [L-xxxxx] Login Errors (L-xxx)
- **[L-001]**: Giriş başarısız / Geçersiz bilgiler (Invalid credentials)
- **[L-002]**: Kullanıcı bulunamadı (User not found) - *Added in v1.2.0*
- **[L-003]**: Birden fazla kullanıcı bulundu (Multiple users found - system error) - *Added in v1.2.0*
- **[L-004]**: Oturum süresi dolmuş veya geçersiz.

## [D-xxxxx] Database Hataları
*   `[D-001]`: Veritabanı bağlantı hatası.
*   `[D-002]`: Sorgu hatası (SQL Syntax, Table Not Found vb.).

## [P-xxxxx] PDF Hataları
*   `[P-001]`: PDF dosyası yüklenemedi (Dosya bozuk veya bulunamadı).
*   `[P-002]`: PDF işlenirken worker hatası oluştu.

## [R-xxxxx] Rapor Hataları
*   `[R-001]`: Rapor şablonu yüklenemedi.
*   `[R-002]`: Rapor oluşturulurken sunucu hatası (PDF Generation Failed).

## [S-xxxxx] Sistem & Sunucu Hataları
*   `[S-001]`: Genel sunucu hatası (Internal Server Error 500).
*   `[T-001]`: Şablon listesi veya verisi alınamadı.
