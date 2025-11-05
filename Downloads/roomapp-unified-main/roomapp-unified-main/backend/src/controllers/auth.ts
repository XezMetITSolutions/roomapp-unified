import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { generateToken } from '../middleware/auth'

const prisma = new PrismaClient()

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ 
        message: 'Email ve şifre gerekli' 
      })
      return
    }

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        permissions: true,
        tenant: {
          select: {
            id: true,
            name: true,
            slug: true,
            isActive: true
          }
        },
        hotel: {
          select: {
            id: true,
            name: true,
            isActive: true
          }
        }
      }
    })

    if (!user) {
      res.status(401).json({ 
        message: 'Geçersiz email veya şifre' 
      })
      return
    }

    if (!user.isActive) {
      res.status(403).json({ 
        message: 'Hesabınız aktif değil' 
      })
      return
    }

    if (!user.tenant.isActive) {
      res.status(403).json({ 
        message: 'İşletme hesabı aktif değil' 
      })
      return
    }

    if (!user.hotel.isActive) {
      res.status(403).json({ 
        message: 'Otel hesabı aktif değil' 
      })
      return
    }

    // Şifreyi kontrol et
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      res.status(401).json({ 
        message: 'Geçersiz email veya şifre' 
      })
      return
    }

    // Son giriş zamanını güncelle
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })

    // Token oluştur
    const token = generateToken(user.id)

    // Kullanıcı bilgilerini döndür (şifre hariç)
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      permissions: user.permissions.map((p: any) => p.pageName),
      tenant: {
        id: user.tenant.id,
        name: user.tenant.name,
        slug: user.tenant.slug
      },
      hotel: {
        id: user.hotel.id,
        name: user.hotel.name
      }
    }

    res.json({
      message: 'Giriş başarılı',
      token,
      user: userResponse
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export async function getCurrentUser(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ 
        message: 'Kullanıcı bilgisi bulunamadı' 
      })
      return
    }

    // Kullanıcının güncel bilgilerini al
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        permissions: true,
        tenant: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        hotel: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!user) {
      res.status(404).json({ 
        message: 'Kullanıcı bulunamadı' 
      })
      return
    }

    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      permissions: user.permissions.map((p: any) => p.pageName),
      tenant: {
        id: user.tenant.id,
        name: user.tenant.name,
        slug: user.tenant.slug
      },
      hotel: {
        id: user.hotel.id,
        name: user.hotel.name
      }
    }

    res.json(userResponse)
  } catch (error) {
    console.error('Get current user error:', error)
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}
