import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Request tipini genişlet
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      tenant?: {
        id: string
        name: string
        slug: string
      }
    }
  }
}

export async function tenantMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // x-tenant header'ından tenant slug'ını al
    const tenantSlug = req.headers['x-tenant'] as string
    
    if (!tenantSlug) {
      res.status(400).json({ 
        message: 'Tenant bilgisi bulunamadı. x-tenant header gerekli.' 
      })
      return
    }

    // Tenant'ı veritabanından bul
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true
      }
    })

    if (!tenant) {
      res.status(404).json({ 
        message: 'Tenant bulunamadı.' 
      })
      return
    }

    if (!tenant.isActive) {
      res.status(403).json({ 
        message: 'Tenant aktif değil.' 
      })
      return
    }

    // Request'e tenant bilgisini ekle
    req.tenant = {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug
    }

    next()
    return
  } catch (error) {
    console.error('Tenant middleware error:', error)
    res.status(500).json({ message: 'Sunucu hatası' })
    return
  }
}

// Tenant ID'sini almak için helper fonksiyon
export function getTenantId(req: Request): string {
  if (!req.tenant) {
    throw new Error('Tenant bilgisi bulunamadı')
  }
  return req.tenant.id
}
