# Node.js 20 tabanlı küçük ve hızlı bir imaj kullan
FROM node:20-alpine

# Çalışma dizinini oluştur
WORKDIR /app

# package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# Tüm bağımlılıkları kur (devDependencies dahil)
RUN npm ci --only=production=false

# prisma klasörünü kopyala
COPY prisma ./prisma

# Prisma client'ı üret
RUN npx prisma generate

# Projenin geri kalanını kopyala
COPY . .

# TypeScript'i derle
RUN npm run build

# Sadece production bağımlılıklarını bırak
RUN npm prune --omit=dev

# Uygulamanın dışarıya açılacak portunu belirt
EXPOSE 3001

# Container başlarken migration yap, sonra uygulamayı başlat
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
