# Backend Deploy Düzeltmeleri

## Yapılan Değişiklikler

### 1. Frontend API URL Güncellemesi
- ✅ `frontend/render.yaml`: `NEXT_PUBLIC_API_URL` → `https://roomapp-backend-1.onrender.com`
- ✅ `frontend/src/app/debug/page.tsx`: Default backend URL güncellendi

### 2. Backend Render.yaml İyileştirmeleri
- ✅ `buildCommand`: `npm install && npx prisma generate && npm run build`
- ✅ `startCommand`: `npx prisma migrate deploy && npm start`
- ✅ Environment variables eklendi:
  - `MAX_FILE_SIZE`: `10485760`
  - `UPLOAD_PATH`: `./uploads`
  - `DIRECT_URL`: Database connection string

### 3. CORS Ayarları
- ✅ Backend'de `onrender.com` domain'i zaten CORS ayarlarında var
- ✅ CORS ayarları esnek ve kapsamlı

## Backend'in Çalışmaması İçin Kontrol Edilmesi Gerekenler

### Render.com Dashboard'da Kontrol Edin:

1. **Service Status**
   - Render Dashboard → `roomapp-backend-1` servisi
   - Status: "Live" olmalı
   - Eğer "Build failed" veya "Deploy failed" ise logları kontrol edin

2. **Build Logs**
   - Render Dashboard → `roomapp-backend-1` → Logs
   - Build sırasında hata var mı kontrol edin
   - Özellikle:
     - `npm install` hatası
     - `npx prisma generate` hatası
     - `npm run build` hatası

3. **Runtime Logs**
   - Render Dashboard → `roomapp-backend-1` → Logs
   - Server başlatılırken hata var mı kontrol edin
   - Özellikle:
     - `npx prisma migrate deploy` hatası
     - Database bağlantı hatası
     - Port hatası

4. **Environment Variables**
   - Render Dashboard → `roomapp-backend-1` → Environment
   - Şu değişkenlerin olduğundan emin olun:
     - `NODE_ENV`: `production`
     - `JWT_SECRET`: (değer ayarlı olmalı)
     - `FRONTEND_URL`: `https://roomxqr.com`
     - `DATABASE_URL`: (database'den otomatik)
     - `DIRECT_URL`: (database'den otomatik)
     - `MAX_FILE_SIZE`: `10485760`
     - `UPLOAD_PATH`: `./uploads`
   - **NOT**: `PORT` Render.com tarafından otomatik ayarlanır, manuel eklemeyin

5. **Database Connection**
   - Render Dashboard → Database → `roomxqr-db`
   - Database'in "Available" durumunda olduğundan emin olun
   - `DATABASE_URL` ve `DIRECT_URL` doğru ayarlanmış olmalı

6. **Health Check**
   - Tarayıcıda: `https://roomapp-backend-1.onrender.com/health`
   - Response: `{"status":"OK",...}` olmalı
   - Eğer hata alıyorsanız, logları kontrol edin

## Olası Hata Senaryoları ve Çözümleri

### 1. Build Failed
**Neden**: Dependencies yüklenemiyor veya TypeScript compile hatası
**Çözüm**: 
- Build logs'u kontrol edin
- `package.json` ve `package-lock.json` güncel mi kontrol edin
- `npm install` yerel olarak çalışıyor mu test edin

### 2. Prisma Generate Failed
**Neden**: Prisma schema hatası veya Prisma Client generate edilemiyor
**Çözüm**:
- `backend/prisma/schema.prisma` dosyasını kontrol edin
- `npx prisma generate` yerel olarak çalışıyor mu test edin

### 3. Database Migration Failed
**Neden**: Database bağlantısı yok veya migration dosyaları hatalı
**Çözüm**:
- Database'in "Available" durumunda olduğundan emin olun
- `DATABASE_URL` doğru ayarlanmış mı kontrol edin
- `npx prisma migrate deploy` yerel olarak çalışıyor mu test edin

### 4. Server Not Starting
**Neden**: Port hatası, database bağlantı hatası, veya kod hatası
**Çözüm**:
- Runtime logs'u kontrol edin
- `PORT` environment variable'ı Render.com tarafından otomatik ayarlanır
- Database bağlantısını kontrol edin
- Server kodunda syntax hatası var mı kontrol edin

### 5. CORS Errors
**Neden**: CORS ayarları yanlış veya eksik
**Çözüm**:
- Backend'de `onrender.com` domain'i CORS ayarlarında var
- Frontend URL'i doğru ayarlanmış mı kontrol edin
- Backend loglarında CORS hatalarını kontrol edin

## Test Adımları

1. **Backend Health Check**
   ```bash
   curl https://roomapp-backend-1.onrender.com/health
   ```
   Veya tarayıcıda: `https://roomapp-backend-1.onrender.com/health`

2. **Frontend Debug Page**
   - `https://roomxqr.com/debug` sayfasını açın
   - "Tüm Testleri Çalıştır" butonuna tıklayın
   - Tüm testlerin başarılı olduğundan emin olun

3. **API Endpoints**
   ```bash
   curl https://roomapp-backend-1.onrender.com/api/menu
   curl https://roomapp-backend-1.onrender.com/api/rooms
   ```

## Sonraki Adımlar

1. ✅ Değişiklikleri commit edin
2. ✅ GitHub'a push edin
3. ✅ Render.com'da manuel deploy yapın (eğer autoDeploy kapalıysa)
4. ✅ Build ve runtime loglarını kontrol edin
5. ✅ Health check endpoint'ini test edin
6. ✅ Frontend'den backend'e bağlantıyı test edin

## Notlar

- Render.com'da `PORT` environment variable'ı otomatik ayarlanır, manuel eklemeyin
- Database migration'ları `startCommand`'da otomatik çalışır
- Prisma Client `buildCommand`'da otomatik generate edilir
- CORS ayarları `onrender.com` domain'ini içerir, bu yüzden yeni backend URL'i çalışmalı

