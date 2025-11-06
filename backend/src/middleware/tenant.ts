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
    
    console.log('🔍 Tenant middleware:', { 
      tenantSlug, 
      method: req.method, 
      path: req.path,
      headers: Object.keys(req.headers)
    })
    
    if (!tenantSlug) {
      console.log('❌ Tenant slug bulunamadı')
      res.status(400).json({ 
        message: 'Tenant bilgisi bulunamadı. x-tenant header gerekli.' 
      })
      return
    }

    // Tenant'ı veritabanından bul
    console.log('🔍 Tenant aranıyor:', tenantSlug)
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true
      }
    })

    console.log('👤 Tenant bulundu:', tenant ? { id: tenant.id, name: tenant.name, slug: tenant.slug, isActive: tenant.isActive } : 'NOT FOUND')

    if (!tenant) {
      console.log('❌ Tenant bulunamadı:', tenantSlug)
      res.status(404).json({ 
        message: `Tenant bulunamadı: ${tenantSlug}` 
      })
      return
    }

    if (!tenant.isActive) {
      console.log('❌ Tenant aktif değil:', tenantSlug)
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

    console.log('✅ Tenant middleware başarılı:', tenant.slug)
    next()
    return
  } catch (error) {
    console.error('❌ Tenant middleware error:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    res.status(500).json({ 
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    })
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
