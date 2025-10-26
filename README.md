# RoomApp - Hotel Management System

🏨 **RoomApp**, QR kod tabanlı misafir hizmetleri ile modern otel yönetim sistemi. Misafirler, resepsiyon ve mutfak personeli arasında gerçek zamanlı iletişim sağlayan kapsamlı bir çözüm.

## 🚀 Özellikler

### Misafir Arayüzü (QR Kod Erişimi)
- **Çok Dilli Destek**: Türkçe, İngilizce, Almanca, Fransızca, İspanyolca, İtalyanca, Rusça, Arapça ve Çince dahil 9 dil
- **Otel Bilgileri**: WiFi şifreleri, çıkış saatleri, yemek programları, otel kuralları ve acil durum iletişim bilgileri
- **Oda Servisi Siparişi**: Menüyü gözden geçirin, sepete ekleyin, özel talimatlarla sipariş verin
- **Hızlı Talepler**: Havlu, temizlik, bakım ve concierge hizmetleri için tek tıkla talep
- **Gerçek Zamanlı Güncellemeler**: Resepsiyon ve mutfak personeline anında bildirimler

### Resepsiyon Paneli
- **Talep Yönetimi**: Öncelik seviyeleri ile tüm misafir taleplerini görüntüleyin ve yönetin
- **Bildirim Sistemi**: Yeni talepler ve siparişler için gerçek zamanlı uyarılar
- **Misafir Bilgileri**: Misafir detaylarına ve oda durumuna erişim
- **Durum Takibi**: Talep durumunu bekleyen'den tamamlandı'ya güncelleyin

### Mutfak Paneli
- **Sipariş Yönetimi**: Oda servisi siparişlerini görüntüleyin ve işleyin
- **Menü Yönetimi**: Ürün müsaitliğini ve fiyatlandırmayı güncelleyin
- **Hazırlık Takibi**: Tahmini pişirme süreleri ve sipariş durumu güncellemeleri
- **Özel Talimatlar**: Diyet gereksinimleri ve özel talepleri ele alın

### Admin Özellikleri
- **QR Kod Üretici**: Her oda için benzersiz QR kodlar oluşturun
- **Oda Yönetimi**: Oda durumu, misafir bilgileri ve doluluk oranını takip edin
- **Analitik Dashboard**: Otel performansını ve misafir memnuniyetini izleyin
- **Personel Yönetimi**: Otel personeli rollerini ve vardiyalarını yönetin

## 🛠️ Teknoloji Yığını

### Backend
- **Runtime**: Node.js 20.x
- **Framework**: Express.js
- **Dil**: TypeScript
- **Veritabanı**: PostgreSQL
- **ORM**: Prisma
- **Gerçek Zamanlı**: Socket.IO
- **Güvenlik**: Helmet, CORS, Rate limiting

### Frontend
- **Framework**: Next.js 14, React 18
- **Dil**: TypeScript
- **Stil**: Tailwind CSS
- **Durum Yönetimi**: Zustand
- **QR Kodlar**: qrcode.react
- **İkonlar**: Lucide React
- **Uluslararasılaştırma**: 9 dil desteği

## 📱 Nasıl Çalışır

1. **QR Kod Sistemi**: Her otel odasının benzersiz bir QR kodu vardır
2. **Misafir Erişimi**: Misafirler QR kodları tarayarak oda özel arayüzüne erişir
3. **Çok Dilli**: Uluslararası misafirler için AI destekli dil seçimi
4. **Talep Akışı**: Misafirler talep yapar → Resepsiyon bildirim alır → Personel işler
5. **Oda Servisi**: Misafirler yemek siparişi verir → Mutfak siparişleri alır → Personel hazırlar ve teslim eder

## 🚀 Kurulum

### Ön Gereksinimler

- Node.js 20.x veya üzeri
- PostgreSQL veritabanı
- npm veya yarn

### Hızlı Başlangıç

1. **Repository'yi klonlayın**
```bash
git clone https://github.com/XezMetITSolutions/roomapp-unified.git
cd roomapp-unified
```

2. **Tüm bağımlılıkları yükleyin**
```bash
npm run install:all
```

3. **Çevre değişkenlerini ayarlayın**
```bash
# Backend için
cp backend/env.example backend/.env
# .env dosyasını veritabanı kimlik bilgileriniz ve diğer ayarlarla düzenleyin
```

4. **Veritabanını ayarlayın**
```bash
npm run db:deploy
npm run db:seed  # İsteğe bağlı: örnek verilerle doldurun
```

5. **Geliştirme sunucularını başlatın**
```bash
npm run dev
```

Bu komut hem backend (port 3001) hem de frontend (port 3000) sunucularını aynı anda başlatır.

## 📋 Kullanım

### Otel Personeli İçin

1. **Ana Dashboard**: Ana sayfadan tüm panellere erişin
2. **Resepsiyon Paneli**: Misafir taleplerini izleyin ve yanıtlayın
3. **Mutfak Paneli**: Oda servisi siparişlerini ve menü öğelerini yönetin
4. **QR Üretici**: Odalar için QR kodlar oluşturun ve yazdırın

### Misafirler İçin

1. **QR Kodu Tarayın**: Telefon kamerasını kullanarak oda QR kodunu tarayın
2. **Dil Seçin**: 9 seçenekten tercih ettiğiniz dili seçin
3. **Hizmetlere Erişin**:
   - Otel bilgilerini ve WiFi şifresini görüntüleyin
   - Menüden oda servisi siparişi verin
   - Temizlik, bakım veya concierge hizmetleri talep edin

## 🏗️ Proje Yapısı

```
roomapp-unified/
├── backend/                    # Backend API
│   ├── src/
│   │   ├── controllers/       # API controllers
│   │   ├── middleware/         # Auth ve güvenlik middleware
│   │   └── server.ts          # Ana sunucu dosyası
│   ├── prisma/                # Veritabanı şeması ve migrations
│   ├── package.json
│   └── README.md
├── frontend/                   # Frontend uygulaması
│   ├── src/
│   │   ├── app/               # Next.js app router sayfaları
│   │   │   ├── admin/         # Admin panelleri
│   │   │   ├── guest/         # Misafir arayüzü
│   │   │   ├── kitchen/       # Mutfak yönetimi
│   │   │   └── reception/     # Resepsiyon paneli
│   │   ├── components/        # Yeniden kullanılabilir bileşenler
│   │   ├── lib/               # Yardımcılar ve utilities
│   │   ├── store/             # Zustand durum yönetimi
│   │   └── types/             # TypeScript tip tanımları
│   ├── package.json
│   └── README.md
├── package.json               # Ana workspace konfigürasyonu
└── README.md                  # Bu dosya
```

## 🎨 Tasarım Sistemi

### Renkler
- **Otel Lacivert**: Ana marka rengi (#1e3a8a)
- **Otel Altın**: Vurgu rengi (#D4AF37)
- **Otel Krem**: Arka plan rengi (#fefce8)
- **Otel Yeşil**: Başarı rengi (#84cc16)

### Bileşenler
- **Otel Kartları**: Gölgeler ve hover efektleri ile tutarlı kart tasarımı
- **Otel Butonları**: Birincil ve ikincil buton stilleri
- **Bildirim Rozetleri**: Gerçek zamanlı bildirim göstergeleri

## 🌐 Çok Dilli Destek

Sistem 9 dil ile kapsamlı çevirileri destekler:

- 🇹🇷 Türkçe
- 🇺🇸 İngilizce
- 🇩🇪 Almanca (Deutsch)
- 🇫🇷 Fransızca (Français)
- 🇪🇸 İspanyolca (Español)
- 🇮🇹 İtalyanca (Italiano)
- 🇷🇺 Rusça (Русский)
- 🇸🇦 Arapça (العربية)
- 🇨🇳 Çince (中文)

## 🚀 Deployment

### Render.com Deployment

Bu proje Render.com'da kolay deployment için yapılandırılmıştır:

1. GitHub repository'nizi Render'e bağlayın
2. `render.yaml` dosyası otomatik olarak yapılandıracak:
   - Node.js 20.x ile web servisi
   - PostgreSQL veritabanı
   - Çevre değişkenleri
   - Build ve start komutları

3. Render'da aşağıdaki çevre değişkenlerini ayarlayın:
   - `DATABASE_URL` (Render PostgreSQL tarafından otomatik ayarlanır)
   - `JWT_SECRET`
   - `FRONTEND_URL`
   - `env.example`'dan diğer isteğe bağlı değişkenler

### Docker Deployment

Docker ile build edin ve çalıştırın:

```bash
# Backend için
cd backend
docker build -t roomapp-backend .
docker run -p 3001:3001 --env-file .env roomapp-backend

# Frontend için
cd frontend
docker build -t roomapp-frontend .
docker run -p 3000:3000 roomapp-frontend
```

## 📊 API Endpoints

### Health Check
- `GET /health` - Sunucu sağlık durumu

### Menu
- `GET /api/menu` - Tüm müsait menü öğelerini getir

### Rooms
- `GET /api/rooms` - Misafir bilgileri ile tüm odaları getir

### Guests
- `GET /api/guests` - Tüm aktif misafirleri getir

### Orders
- `POST /api/orders` - Yeni sipariş oluştur

### Notifications
- `POST /api/notifications` - Bildirim gönder

## 🔒 Güvenlik Özellikleri

- **QR Kod Doğrulama**: Zaman tabanlı QR kod doğrulama (24 saatlik süre)
- **Oda Özel Erişim**: Her QR kod belirli bir odaya bağlıdır
- **Veri Doğrulama**: Giriş doğrulama ve sanitizasyon
- **Güvenli Durum Yönetimi**: Uygun veri akışı ile merkezi durum

## 📱 Mobil Optimizasyon

- **Responsive Tasarım**: Tüm cihaz boyutları için optimize edilmiş
- **Dokunmatik Dostu Arayüz**: Büyük butonlar ve kolay navigasyon
- **QR Kod Tarama**: Mobil kamera taraması için optimize edilmiş
- **Çevrimdışı Yetenek**: Temel özellikler internet olmadan çalışır

## 🎯 Ana Faydalar

### Oteller İçin
- **Azaltılmış Personel İş Yükü**: Otomatik talep yönlendirme
- **Gelişmiş Misafir Memnuniyeti**: Daha hızlı yanıt süreleri
- **Daha İyi İletişim**: Gerçek zamanlı bildirimler
- **Maliyet Tasarrufu**: Azaltılmış telefon aramaları ve manuel süreçler

### Misafirler İçin
- **Temassız Hizmet**: Resepsiyonu aramaya gerek yok
- **Çok Dilli Destek**: Ana dilde hizmet
- **7/24 Erişim**: Her zaman hizmet talep edebilme
- **Şeffaf Süreç**: Talep durumunu takip etme

## 🔄 Gelecek Geliştirmeler

- **Ödeme Entegrasyonu**: Oda servisi ödemeleri için Stripe/PayPal
- **Push Bildirimleri**: Gerçek zamanlı mobil bildirimler
- **Analitik Dashboard**: Detaylı raporlama ve içgörüler
- **Entegrasyon API'leri**: Mevcut otel yönetim sistemleriyle bağlantı
- **Ses Komutları**: Sesle aktifleştirilen talepler
- **AI Chatbot**: Otomatik misafir yardımı

## 📞 Destek

Teknik destek veya özellik talepleri için lütfen geliştirme ekibiyle iletişime geçin.

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

**RoomApp** - Modern teknoloji ile otel operasyonlarını kolaylaştırıyor 🏨✨

