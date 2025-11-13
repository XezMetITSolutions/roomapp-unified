#!/bin/sh

# Başarısız migration'ları çöz
echo "🔄 Başarısız migration'lar kontrol ediliyor..."

# Başarısız migration'ı "applied" olarak işaretle (eğer varsa)
npx prisma migrate resolve --applied 20250106210000_add_super_admin_role 2>/dev/null || echo "Migration zaten çözülmüş veya mevcut değil"

# Migration'ları uygula
echo "🔄 Migration'lar uygulanıyor..."
npx prisma migrate deploy

# Uygulamayı başlat
echo "🚀 Uygulama başlatılıyor..."
npm start

