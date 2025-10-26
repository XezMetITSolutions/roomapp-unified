import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

// Request tipini genişlet
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        firstName: string
        lastName: string
        role: string
        permissions: string[]
        tenantId: string
        hotelId: string
      }
    }
  }
}

// JWT Secret - gerçek uygulamada environment variable'dan gelecek
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Authorization header'ından token'ı al
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ 
        message: 'Erişim token\'ı bulunamadı' 
      })
      return
    }

    const token = authHeader.substring(7) // "Bearer " kısmını çıkar

    // Token'ı doğrula
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    
    // Kullanıcıyı veritabanından bul
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        permissions: true
      }
    })

    if (!user) {
      res.status(401).json({ 
        message: 'Kullanıcı bulunamadı' 
      })
      return
    }

    if (!user.isActive) {
      res.status(403).json({ 
        message: 'Kullanıcı hesabı aktif değil' 
      })
      return
    }

    // Request'e kullanıcı bilgisini ekle
    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      permissions: user.permissions.map((p: any) => p.pageName),
      tenantId: user.tenantId,
      hotelId: user.hotelId
    }

    next()
    return
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(401).json({ message: 'Geçersiz token' })
    return
  }
}

// Sayfa bazlı yetki kontrolü middleware'i
export function requirePermission(pageName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ 
        message: 'Kullanıcı bilgisi bulunamadı' 
      })
      return
    }

    if (!req.user.permissions.includes(pageName)) {
      res.status(403).json({ 
        message: `Bu sayfaya erişim yetkiniz yok: ${pageName}` 
      })
      return
    }

    next()
    return
  }
}

// Admin yetkisi kontrolü
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).json({ 
      message: 'Kullanıcı bilgisi bulunamadı' 
    })
    return
  }

  if (req.user.role !== 'ADMIN') {
    res.status(403).json({ 
      message: 'Bu işlem için admin yetkisi gerekli' 
    })
    return
  }

  next()
  return
}

// Kullanıcı ID'sini almak için helper fonksiyon
export function getUserId(req: Request): string {
  if (!req.user) {
    throw new Error('Kullanıcı bilgisi bulunamadı')
  }
  return req.user.id
}

// Token oluşturma fonksiyonu
export function generateToken(userId: string): string {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: '24h' }
  )
}
