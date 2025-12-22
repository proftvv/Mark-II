# Error Code Reference

## Authentication Errors (A-XXX)
- **A-001**: Yetkisiz erişim - Session yok
- **A-002**: Bu işlem sadece admin kullanıcılar için
- **A-003**: Geçersiz kullanıcı rolü

## Login Errors (L-XXX)
- **L-001**: Kullanıcı adı ve şifre gerekli / Geçersiz bilgiler
- **L-002**: Kullanıcı bulunamadı
- **L-003**: Birden fazla kullanıcı bulundu (sistem hatası)

## User Management Errors (U-XXX)
- **U-001**: Kullanıcılar yüklenemedi
- **U-002**: Kullanıcı adı ve şifre gerekli
- **U-003**: Geçersiz rol
- **U-004**: Kullanıcı adı veya ID zaten mevcut
- **U-005**: Kullanıcı oluşturulamadı
- **U-006**: Kullanıcı adı gerekli
- **U-007**: Geçersiz rol
- **U-008**: Kullanıcı bulunamadı
- **U-009**: Kullanıcı adı veya ID zaten kullanımda
- **U-010**: Kullanıcı güncellenemedi
- **U-011**: Kendi hesabınızı silemezsiniz
- **U-012**: Kullanıcı bulunamadı
- **U-013**: Kullanıcı silinemedi

## Log Management Errors (LOG-XXX)
- **LOG-001**: Loglar yüklenemedi
- **LOG-002**: İstatistikler yüklenemedi
- **LOG-003**: Loglar temizlenemedi

## Server Errors (S-XXX)
- **S-001**: Genel sunucu hatası
- **S-999**: Beklenmeyen sunucu hatası

## Template Errors (T-XXX)
- **T-001**: Şablon yüklenemedi
- **T-002**: Şablon oluşturulamadı
- **T-003**: Şablon güncellenemedi
- **T-004**: Şablon silinemedi

## Report Errors (R-XXX)
- **R-001**: Rapor yüklenemedi
- **R-002**: Rapor oluşturulamadı
- **R-003**: Rapor güncellenemedi
- **R-004**: Rapor silinemedi

## Debugging Tips

### Backend Logs
Loglar şu dosyada tutulur: `logs/app.log`

### Frontend Console
Tüm API istekleri ve yanıtları console'da loglanır:
- `[API] GET /users` - İstek gönderildi
- `[API] Response 200 /users` - Yanıt alındı
- `[API] Success /users` - Başarılı yanıt
- `[API] Error: ...` - Hata detayları

### Component Logs
Her component kendi loglarını yazar:
- `[Users] Component mounted` - Component yüklendi
- `[Users] Loading users...` - Veri yükleniyor
- `[Logs] Loaded logs:` - Veri yüklendi

### Common Issues

1. **401 Unauthorized**: Giriş yapılmamış veya session süresi dolmuş
   - Çözüm: Çıkış yapıp tekrar giriş yapın

2. **403 Forbidden**: Admin yetkisi gerekiyor
   - Çözüm: Admin kullanıcısıyla giriş yapın

3. **404 Not Found**: Endpoint bulunamadı
   - Kontrol: Backend çalışıyor mu? `curl http://localhost:3000/`

4. **HTML Response (<!doctype)**: Backend JSON yerine HTML dönüyor
   - Neden: Endpoint yok veya farklı port
   - Kontrol: Backend port 3000'de mi çalışıyor?

5. **Port already in use**: Port zaten kullanımda
   - Çözüm: `Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force`
