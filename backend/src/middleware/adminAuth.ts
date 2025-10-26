import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

// Admin yetkilendirme middleware
export async function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Yetkilendirme token gerekli' })
      return
    }

    const token = authHeader.substring(7) // "Bearer " kısmını çıkar
    
    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
    
    // Kullanıcıyı veritabanından bul
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        tenant: true,
        hotel: true
      }
    })

    if (!user) {
      res.status(401).json({ message: 'Geçersiz token' })
      return
    }

    // Admin kontrolü - sadece SUPER_ADMIN rolü admin işlemleri yapabilir
    if (user.role !== 'SUPER_ADMIN') {
      res.status(403).json({ message: 'Admin yetkisi gerekli' })
      return
    }

    // Request'e kullanıcı bilgisini ekle
    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      permissions: [],
      tenantId: user.tenantId,
      hotelId: user.hotelId
    }

    next()
    return
  } catch (error) {
    console.error('Admin auth middleware error:', error)
    res.status(401).json({ message: 'Geçersiz token' })
    return
  }
}

// Super admin oluşturma fonksiyonu
export async function createSuperAdmin() {
  try {
    const existingSuperAdmin = await prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN' }
    })

    if (existingSuperAdmin) {
      console.log('Super admin zaten mevcut')
      return
    }

    // Super admin için özel tenant oluştur
    const superTenant = await prisma.tenant.create({
      data: {
        name: 'System Admin',
        slug: 'system-admin',
        domain: 'admin.roomxqr.com',
        isActive: true,
        settings: {
          theme: {
            primaryColor: '#1f2937',
            secondaryColor: '#f3f4f6'
          },
          currency: 'TRY',
          language: 'tr'
        }
      }
    })

    // Super admin için özel otel oluştur
    const superHotel = await prisma.hotel.create({
      data: {
        name: 'System Hotel',
        address: 'System Address',
        phone: '000-000-0000',
        email: 'admin@system.com',
        tenantId: superTenant.id
      }
    })

    // Super admin kullanıcısı oluştur
    const superAdmin = await prisma.user.create({
      data: {
        email: 'admin@roomxqr.com',
        password: 'admin123', // Production'da hash'lenmeli
        firstName: 'Super',
        lastName: 'Admin',
        role: 'SUPER_ADMIN',
        tenantId: superTenant.id,
        hotelId: superHotel.id
      }
    })

    console.log('Super admin oluşturuldu:', superAdmin.email)
    return superAdmin
  } catch (error) {
    console.error('Super admin oluşturma hatası:', error)
    throw error
  }
}
