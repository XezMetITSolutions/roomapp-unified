# 🚨 Frontend 503 Hatası - Çözüm Adımları

## ❌ Mevcut Durum
```
https://roomxqr.com/debug
HTTP ERROR 503 - Service Unavailable
```

## 🔍 503 Hatası Ne Anlama Geliyor?
503 hatası, frontend servisinin:
- Çalışmadığı
- Build hatası aldığı
- Crash olduğu
- Veya henüz başlamadığı anlamına gelir

## 🚀 HEMEN YAPILMASI GEREKENLER

### 1️⃣ Render.com Dashboard'a Gidin
https://dashboard.render.com

### 2️⃣ Frontend Servisini Kontrol Edin

**"roomxqr-frontend" veya benzeri isimli servisi bulun**

#### Kontrol Edilecekler:

**A) Servis Durumu:**
- 🟢 **"Live"** badge'i var mı?
- 🔴 **"Failed"** veya **"Build Failed"** yazıyor mu?
- 🟡 **"Deploying"** durumunda mı?

**B) Son Deploy:**
- Son deploy ne zaman yapıldı?
- Deploy başarılı mı, başarısız mı?

**C) Logs (En Önemli):**
- **"Logs"** sekmesine tıklayın
- Son 100 satırı okuyun
- Hata mesajları var mı?

### 3️⃣ Olası Senaryolar ve Çözümler

#### Senaryo 1: Build Failed (Build Hatası)
**Belirtiler:**
- Servis durumu "Failed"
- Loglarda "Build failed" mesajı

**Çözüm:**
```bash
# Yerel olarak test edin
cd "c:\Users\IT Admin\Downloads\Yeni\roomapp-unified\frontend"
npm install
npm run build:safe
```

Eğer yerel build başarılı ise:
1. Render'da **"Manual Deploy"** → **"Clear build cache & deploy"**
2. Bekleyin (~5-10 dakika)

#### Senaryo 2: Service Crashed (Servis Çöktü)
**Belirtiler:**
- Build başarılı ama servis başlamıyor
- Loglarda "Error" veya "Crash" mesajları

**Çözüm:**
1. Render Dashboard → Frontend Service
2. **"Manual Deploy"** → **"Deploy latest commit"**
3. Logları izleyin

#### Senaryo 3: Environment Variables Eksik
**Belirtiler:**
- Build başarılı ama runtime hatası
- Loglarda "undefined" veya "missing env" mesajları

**Çözüm:**
Render Dashboard → Frontend Service → Environment
Şu değişkenlerin olduğundan emin olun:
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://roomapp-backend.onrender.com
NEXT_PUBLIC_BASE_DOMAIN=roomxqr.com
NEXT_PUBLIC_FRONTEND_URL=roomxqr.com
HUSKY=0
```

#### Senaryo 4: Port Problemi
**Belirtiler:**
- Build başarılı
- Servis başlıyor ama erişilemiyor

**Çözüm:**
Render Dashboard → Frontend Service → Settings
- **Start Command:** `npm start` olmalı
- **Port:** Otomatik (Next.js varsayılan 3000 kullanır)

#### Senaryo 5: Domain/DNS Problemi
**Belirtiler:**
- Render URL'si çalışıyor (örn: https://roomxqr-frontend.onrender.com)
- Ama custom domain (roomxqr.com) çalışmıyor

**Çözüm:**
1. Render Dashboard → Frontend Service → Settings → Custom Domains
2. `roomxqr.com` domain'i ekli mi kontrol edin
3. DNS ayarlarını kontrol edin:
   - A Record veya CNAME doğru mu?
   - SSL sertifikası aktif mi?

### 4️⃣ Hızlı Test Adımları

**Test 1: Render URL'sini Deneyin**
```
https://roomxqr-frontend.onrender.com/debug
veya
https://[your-service-name].onrender.com/debug
```

Eğer bu çalışıyorsa → Domain/DNS problemi
Eğer bu da çalışmıyorsa → Servis problemi

**Test 2: Health Check**
```
https://roomxqr-frontend.onrender.com/
```
Ana sayfa açılıyor mu?

### 5️⃣ Log Örnekleri

**Başarılı Build:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

**Başarısız Build:**
```
✗ Failed to compile
Error: ...
Build failed
```

**Runtime Error:**
```
Error: Cannot find module ...
TypeError: Cannot read property ...
```

## 🔧 Acil Çözüm: Frontend'i Yeniden Deploy Edin

### Adım 1: Render Dashboard
https://dashboard.render.com → Frontend Service

### Adım 2: Clear Cache & Deploy
1. **"Manual Deploy"** butonuna tıklayın
2. **"Clear build cache & deploy"** seçin
3. Deploy başlayacak

### Adım 3: Logları İzleyin
- Build aşamasını izleyin
- Hata mesajlarını not edin
- Deploy tamamlanana kadar bekleyin (~5-10 dakika)

### Adım 4: Test Edin
```
https://roomxqr.com/debug
```

## 📊 Beklenen Sonuç

### Deploy Öncesi:
```
❌ https://roomxqr.com/debug → 503 Error
```

### Deploy Sonrası:
```
✅ https://roomxqr.com/debug → Debug sayfası açılır
✅ Backend health checks görünür
```

## 🆘 Hala Çalışmıyorsa

### Paylaşmanız Gereken Bilgiler:
1. **Frontend service adı** (Render'da)
2. **Son 50 satır log** (Render Logs sekmesinden)
3. **Environment variables** (hassas bilgileri gizleyin)
4. **Render URL çalışıyor mu?** (örn: .onrender.com URL'si)
5. **Custom domain ayarları** (DNS records)

### Geçici Çözüm:
Render URL'sini kullanın:
```
https://[your-service-name].onrender.com/debug
```

## ⏱️ Tahmini Süre
- Log kontrolü: 2-3 dakika
- Redeploy: 5-10 dakika
- DNS propagation (gerekirse): 5-30 dakika
- **Toplam: 10-45 dakika**

---

**ÖNEMLİ:** Backend'i zaten deploy ettiniz, şimdi sadece frontend'e odaklanın!
