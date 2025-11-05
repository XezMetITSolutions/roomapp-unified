import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { tenantMiddleware, getTenantId } from './middleware/tenant'
import { authMiddleware, requirePermission } from './middleware/auth'
import { adminAuthMiddleware, createSuperAdmin } from './middleware/adminAuth'
import { login, getCurrentUser } from './controllers/auth'
import { getUsers, createUser, updateUser, updateUserPermissions, deleteUser } from './controllers/users'

// Load environment variables
dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "http://localhost:3000",
      "https://roomxqr-frontend.onrender.com"
    ],
    methods: ["GET", "POST"]
  }
})

const PORT = process.env.PORT || 3001
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: ['query', 'info', 'warn', 'error']
})

// Connection pool ayarları ve retry logic
const connectWithRetry = async (retries = 10) => {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$connect()
      console.log('✅ Database connected successfully')
      return
    } catch (error) {
      console.error(`❌ Database connection attempt ${i + 1}/${retries} failed:`, error)
      if (i === retries - 1) {
        console.error('❌ All database connection attempts failed')
        throw error
      }
      // Exponential backoff: 2s, 4s, 8s, 16s, 32s, 64s, 128s, 256s, 512s
      const delay = Math.min(2000 * Math.pow(2, i), 30000)
      console.log(`⏳ Waiting ${delay}ms before next attempt...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

// Connect to database with retry (non-blocking)
connectWithRetry().catch((error) => {
  console.error('❌ Failed to connect to database:', error)
  console.log('⚠️ Server will continue without database connection')
  // Don't exit, let the server start and retry later
})

// Types
interface RequestItem {
  menuItemId: string
  quantity: number
  price: number
  notes?: string
}

// Security middleware
app.use(helmet())
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true)
    
    // Allow localhost and specific domains
    const allowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "http://localhost:3000",
      "https://roomxqr-frontend.onrender.com",
      "https://roomxqr.com"
    ]
    
    // Allow subdomains of roomxqr.com
    if (origin.endsWith('.roomxqr.com')) {
      return callback(null, true)
    }
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    
    callback(new Error('CORS policy violation'))
  },
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api/', limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Compression
app.use(compression())

// Logging
app.use(morgan('combined'))

// Health check
app.get('/health', async (req: Request, res: Response) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    res.status(200).json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'Connected',
      environment: process.env.NODE_ENV || 'development'
    })
  } catch (error) {
    res.status(503).json({ 
      status: 'ERROR', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'Disconnected',
      environment: process.env.NODE_ENV || 'development',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Auth Routes
app.post('/api/auth/login', tenantMiddleware, login)
app.get('/api/auth/me', tenantMiddleware, authMiddleware, getCurrentUser)

// User Management Routes (Protected)
app.get('/api/users', tenantMiddleware, authMiddleware, requirePermission('users'), getUsers)
app.post('/api/users', tenantMiddleware, authMiddleware, requirePermission('users'), createUser)
app.put('/api/users/:id', tenantMiddleware, authMiddleware, requirePermission('users'), updateUser)
app.put('/api/users/:id/permissions', tenantMiddleware, authMiddleware, requirePermission('users'), updateUserPermissions)
app.delete('/api/users/:id', tenantMiddleware, authMiddleware, requirePermission('users'), deleteUser)

// API Routes
app.get('/api/menu', tenantMiddleware, async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req)
    const menuItems = await prisma.menuItem.findMany({
      where: { 
        tenantId,
        isActive: true, 
        isAvailable: true 
      },
      orderBy: { name: 'asc' }
    })
    res.json({ menuItems }); return;
  } catch (error) {
    console.error('Menu error:', error)
    res.status(500).json({ message: 'Database error' })
    return;
  }
})

app.get('/api/rooms', tenantMiddleware, async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req)
    const rooms = await prisma.room.findMany({
      where: { 
        tenantId,
        isActive: true 
      },
      include: {
        guests: {
          where: { isActive: true },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            checkIn: true
          }
        }
      },
      orderBy: { number: 'asc' }
    })
    res.json({ rooms }); return;
  } catch (error) {
    console.error('Rooms error:', error)
    res.status(500).json({ message: 'Database error' })
    return;
  }
})

app.get('/api/guests', tenantMiddleware, async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req)
    const guests = await prisma.guest.findMany({
      where: { 
        tenantId,
        isActive: true 
      },
      include: {
        room: {
          select: {
            number: true,
            floor: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ guests }); return;
  } catch (error) {
    console.error('Guests error:', error)
    res.status(500).json({ message: 'Database error' })
    return;
  }
})

app.post('/api/orders', tenantMiddleware, async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req)
    const { roomId, guestId, items, notes } = req.body

    // Calculate total amount
    let totalAmount = 0
    for (const item of items) {
      totalAmount += item.price * item.quantity
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        roomId,
        guestId,
        tenantId,
        hotelId: 'default-hotel-id', // You'll need to get this from request
        totalAmount,
        notes,
        items: {
          create: (items as RequestItem[]).map((item: RequestItem) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
            notes: item.notes
          }))
        }
      },
      include: {
        items: {
          include: {
            menuItem: {
              select: {
                name: true,
                price: true
              }
            }
          }
        }
      }
    })

    // Emit real-time notification
    io.emit('new-order', order)

    res.status(201).json({ message: 'Order created successfully', order }); return;
  } catch (error) {
    console.error('Order creation error:', error)
    res.status(500).json({ message: 'Database error' })
    return;
  }
})

// Guest Requests API
app.get('/api/requests', tenantMiddleware, async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req)
    const { roomId } = req.query
    const where = roomId ? { roomId: `room-${roomId}` } : {}
    
    const requests = await prisma.guestRequest.findMany({
      where: { 
        tenantId,
        ...where, 
        isActive: true 
      },
      orderBy: { createdAt: 'desc' }
    })
    
    res.json(requests); return;
  } catch (error) {
    console.error('Requests error:', error)
    res.status(500).json({ message: 'Database error' })
    return;
  }
})

app.post('/api/requests', tenantMiddleware, async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req)
    const { roomId, type, priority, status, description, notes } = req.body

    const request = await prisma.guestRequest.create({
      data: {
        roomId,
        type,
        priority,
        status,
        description,
        notes,
        tenantId,
        hotelId: 'default-hotel-id'
      }
    })

    // Emit real-time notification
    io.emit('new-request', request)

    res.status(201).json(request); return;
  } catch (error) {
    console.error('Request creation error:', error)
    res.status(500).json({ message: 'Database error' })
    return;
  }
})

app.patch('/api/requests/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status, notes } = req.body

    const request = await prisma.guestRequest.update({
      where: { id },
      data: { status, notes, updatedAt: new Date() }
    })

    // Emit real-time notification
    io.emit('request-updated', request)

    res.json(request); return;
  } catch (error) {
    console.error('Request update error:', error)
    res.status(500).json({ message: 'Database error' })
    return;
  }
})

// Guest Check-in/Check-out endpoints
app.post('/api/guests/checkin', tenantMiddleware, async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req)
    const { roomId, firstName, lastName, email, phone, language } = req.body

    // Check if room exists
    const room = await prisma.room.findFirst({
      where: { 
        id: roomId,
        tenantId,
        isActive: true
      }
    })

    if (!room) {
      return res.status(404).json({ message: 'Room not found' })
    }

    // Create guest
    const guest = await prisma.guest.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        language: language || 'tr',
        checkIn: new Date(),
        tenantId,
        hotelId: 'default-hotel-id', // You'll need to get this from request
        roomId: room.id
      }
    })

    // Update room status
    await prisma.room.update({
      where: { id: room.id },
      data: { 
        isOccupied: true,
        qrCode: `room-${room.number}-${firstName.toLowerCase()}-${lastName.toLowerCase()}`
      }
    })

    // Generate QR code with guest name
    const qrCode = `room-${room.number}-${firstName.toLowerCase()}-${lastName.toLowerCase()}`

    res.status(201).json({ 
      message: 'Guest checked in successfully', 
      guest,
      qrCode 
    })
    return
  } catch (error) {
    console.error('Guest check-in error:', error)
    res.status(500).json({ message: 'Database error' })
    return
  }
})

app.post('/api/guests/checkout', tenantMiddleware, async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req)
    const { roomId } = req.body

    // Find active guest for this room
    const guest = await prisma.guest.findFirst({
      where: {
        roomId,
        tenantId,
        isActive: true,
        checkOut: null
      }
    })

    if (guest) {
      // Update guest check-out
      await prisma.guest.update({
        where: { id: guest.id },
        data: { 
          checkOut: new Date(),
          isActive: false
        }
      })
    }

    // Update room status and reset QR code
    const room = await prisma.room.findFirst({
      where: { 
        id: roomId,
        tenantId,
        isActive: true
      }
    })

    if (room) {
      await prisma.room.update({
        where: { id: room.id },
        data: { 
          isOccupied: false,
          qrCode: `room-${room.number}`
        }
      })
    }

    res.status(200).json({ 
      message: 'Guest checked out successfully',
      qrCode: `room-${room?.number || 'unknown'}`
    })
  } catch (error) {
    console.error('Guest check-out error:', error)
    res.status(500).json({ message: 'Database error' })
    return
  }
})

// Generate guest-specific QR code
app.post('/api/rooms/:roomId/generate-guest-qr', tenantMiddleware, async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req)
    const { roomId } = req.params
    const { guestName } = req.body

    const room = await prisma.room.findFirst({
      where: { 
        id: roomId,
        tenantId,
        isActive: true
      }
    })

    if (!room) {
      return res.status(404).json({ message: 'Room not found' })
    }

    const qrCode = guestName 
      ? `room-${room.number}-${guestName.replace(/\s+/g, '-').toLowerCase()}`
      : `room-${room.number}`

    // Update room QR code
    await prisma.room.update({
      where: { id: room.id },
      data: { qrCode }
    })

    res.status(200).json({ qrCode })
    return
  } catch (error) {
    console.error('QR generation error:', error)
    res.status(500).json({ message: 'Database error' })
    return
  }
})

// CRM Integration - Get guest data by room
app.get('/api/crm/guest/:roomId', tenantMiddleware, async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req)
    const { roomId } = req.params

    // Find active guest for this room
    const guest = await prisma.guest.findFirst({
      where: {
        roomId,
        tenantId,
        isActive: true,
        checkOut: null
      },
      include: {
        room: {
          select: {
            number: true
          }
        }
      }
    })

    if (!guest) {
      return res.status(404).json({ message: 'No active guest found for this room' })
    }

    res.status(200).json({
      id: guest.id,
      name: guest.firstName,
      surname: guest.lastName,
      email: guest.email,
      phone: guest.phone,
      checkIn: guest.checkIn,
      checkOut: guest.checkOut,
      roomNumber: guest.room.number,
      guestCount: 1 // You can add guest count logic here
    })
    return
  } catch (error) {
    console.error('CRM guest fetch error:', error)
    res.status(500).json({ message: 'Database error' })
    return
  }
})

app.post('/api/notifications', tenantMiddleware, async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req)
    const { type, title, message, roomId } = req.body

    const notification = await prisma.notification.create({
      data: {
        type,
        title,
        message,
        roomId,
        tenantId,
        hotelId: 'default-hotel-id' // You'll need to get this from request
      }
    })

    // Emit real-time notification
    io.emit('new-notification', notification)

    res.status(201).json({ message: 'Notification sent successfully', notification }); return;
  } catch (error) {
    console.error('Notification error:', error)
    res.status(500).json({ message: 'Database error' })
    return;
  }
})

// Admin Routes (Tenant Management) - Admin yetkilendirmesi gerekli
app.post('/api/admin/tenants', adminAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, slug, adminEmail, adminPassword, adminFirstName, adminLastName } = req.body

    // Slug'ı temizle ve kontrol et
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    // Tenant'ın zaten var olup olmadığını kontrol et
    const existingTenant = await prisma.tenant.findUnique({
      where: { slug: cleanSlug }
    })
    if (existingTenant) {
      res.status(400).json({ message: 'Bu slug zaten kullanılıyor' }); return;
    }
    // Tenant oluştur
    const tenant = await prisma.tenant.create({
      data: {
        name,
        slug: cleanSlug,
        settings: {
          theme: {
            primaryColor: '#0D9488',
            secondaryColor: '#f3f4f6'
          },
          currency: 'TRY',
          language: 'tr'
        }
      }
    })
    // İlk otel oluştur
    const hotel = await prisma.hotel.create({
      data: {
        name: `${name} Otel`,
        address: 'Adres bilgisi güncellenmeli',
        phone: 'Telefon bilgisi güncellenmeli',
        email: adminEmail,
        tenantId: tenant.id
      }
    })
    // İlk admin kullanıcı oluştur
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        password: adminPassword, // Production'da hash'lenmeli
        firstName: adminFirstName,
        lastName: adminLastName,
        role: 'ADMIN',
        tenantId: tenant.id,
        hotelId: hotel.id
      }
    })
    res.status(201).json({
      message: 'Tenant başarıyla oluşturuldu',
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        url: `https://${tenant.slug}.roomxqr.com`
      },
      hotel: {
        id: hotel.id,
        name: hotel.name
      },
      admin: {
        id: adminUser.id,
        email: adminUser.email,
        name: `${adminUser.firstName} ${adminUser.lastName}`
      }
    }); return;
  } catch (error) {
    console.error('Tenant creation error:', error); res.status(500).json({ message: 'Database error' }); return;
  }
})

app.get('/api/admin/tenants', adminAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const tenants = await prisma.tenant.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            users: true,
            hotels: true,
            orders: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ tenants }); return;
  } catch (error) {
    console.error('Tenants list error:', error); res.status(500).json({ message: 'Database error' }); return;
  }
})

// Tenant özellik yönetimi API'leri
app.get('/api/admin/tenants/:id/features', adminAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    const features = await prisma.tenantFeature.findMany({
      where: { tenantId: id },
      select: {
        id: true,
        featureKey: true,
        enabled: true,
        config: true,
        createdAt: true,
        updatedAt: true
      }
    })

    res.json({ features }); return;
  } catch (error) {
    console.error('Get tenant features error:', error); res.status(500).json({ message: 'Database error' }); return;
  }
})

app.post('/api/admin/tenants/:id/features', adminAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { featureKey, enabled, config } = req.body

    if (!id || typeof id !== 'string') {
      res.status(400).json({ message: 'Tenant ID gerekli' }); return;
    }

    if (!featureKey || typeof featureKey !== 'string') {
      res.status(400).json({ message: 'Feature key gerekli' }); return;
    }

    // TypeScript'e değerlerin string olduğunu garanti et
    const validId: string = id
    const validFeatureKey: string = featureKey

    // Tenant'ın var olup olmadığını kontrol et
    const tenant = await prisma.tenant.findUnique({
      where: { id: validId }
    })

    if (!tenant) {
      res.status(404).json({ message: 'Tenant bulunamadı' }); return;
    }

    // Özelliği oluştur veya güncelle
    const feature = await prisma.tenantFeature.upsert({
      where: {
        tenantId_featureKey: {
          tenantId: validId,
          featureKey: validFeatureKey
        }
      },
      update: {
        enabled: enabled ?? false,
        config: config || null
      },
      create: {
        tenantId: validId,
        featureKey: validFeatureKey,
        enabled: enabled ?? false,
        config: config || null
      }
    })

    res.json({ 
      message: 'Özellik başarıyla güncellendi',
      feature 
    }); return;
  } catch (error) {
    console.error('Update tenant feature error:', error); res.status(500).json({ message: 'Database error' }); return;
  }
})

app.put('/api/admin/tenants/:id/features/:featureKey', adminAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { id, featureKey } = req.params as { id: string; featureKey: string }
    const { enabled, config } = req.body

    const feature = await prisma.tenantFeature.update({
      where: {
        tenantId_featureKey: {
          tenantId: id,
          featureKey: featureKey
        }
      },
      data: {
        enabled: enabled,
        config: config || null
      }
    })

    res.json({ 
      message: 'Özellik başarıyla güncellendi',
      feature 
    }); return;
  } catch (error) {
    console.error('Update tenant feature error:', error); res.status(500).json({ message: 'Database error' }); return;
  }
})

app.delete('/api/admin/tenants/:id/features/:featureKey', adminAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { id, featureKey } = req.params as { id: string; featureKey: string }

    await prisma.tenantFeature.delete({
      where: {
        tenantId_featureKey: {
          tenantId: id,
          featureKey: featureKey
        }
      }
    })

    res.json({ message: 'Özellik başarıyla silindi' }); return;
  } catch (error) {
    console.error('Delete tenant feature error:', error); res.status(500).json({ message: 'Database error' }); return;
  }
})

// Toplu özellik güncelleme
app.post('/api/admin/features/bulk-update', adminAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { tenantIds, featureKey, enabled, config } = req.body

    if (!tenantIds || !Array.isArray(tenantIds) || !featureKey) {
      res.status(400).json({ message: 'Geçersiz parametreler' }); return;
    }

    const results = []
    
    for (const tenantId of tenantIds) {
      try {
        const feature = await prisma.tenantFeature.upsert({
          where: {
            tenantId_featureKey: {
              tenantId: tenantId,
              featureKey: featureKey
            }
          },
          update: {
            enabled: enabled,
            config: config || null
          },
          create: {
            tenantId: tenantId,
            featureKey: featureKey,
            enabled: enabled,
            config: config || null
          }
        })
        
        results.push({ tenantId, success: true, feature })
      } catch (error) {
        results.push({ tenantId, success: false, error: (error as Error).message })
      }
    }

    res.json({ 
      message: 'Toplu güncelleme tamamlandı',
      results 
    }); return;
  } catch (error) {
    console.error('Bulk update features error:', error); res.status(500).json({ message: 'Database error' }); return;
  }
})

// Tüm mevcut özellikleri listele
app.get('/api/admin/features/available', adminAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const availableFeatures = [
      {
        key: 'qr-menu',
        name: 'QR Menü',
        description: 'QR kod ile menü erişimi',
        category: 'temel'
      },
      {
        key: 'multi-language',
        name: 'Çoklu Dil Desteği',
        description: 'Birden fazla dil desteği',
        category: 'temel'
      },
      {
        key: 'analytics',
        name: 'Analitik',
        description: 'Detaylı analitik raporlar',
        category: 'gelişmiş'
      },
      {
        key: 'custom-branding',
        name: 'Özel Markalama',
        description: 'Logo ve tema özelleştirmesi',
        category: 'gelişmiş'
      },
      {
        key: 'api-access',
        name: 'API Erişimi',
        description: 'REST API erişimi',
        category: 'gelişmiş'
      },
      {
        key: 'priority-support',
        name: 'Öncelikli Destek',
        description: '7/24 öncelikli müşteri desteği',
        category: 'destek'
      },
      {
        key: 'custom-integrations',
        name: 'Özel Entegrasyonlar',
        description: 'Üçüncü parti sistem entegrasyonları',
        category: 'gelişmiş'
      },
      {
        key: 'advanced-notifications',
        name: 'Gelişmiş Bildirimler',
        description: 'SMS, email ve push bildirimleri',
        category: 'gelişmiş'
      },
      {
        key: 'multi-hotel',
        name: 'Çoklu Otel',
        description: 'Birden fazla otel yönetimi',
        category: 'gelişmiş'
      },
      {
        key: 'backup-restore',
        name: 'Yedekleme ve Geri Yükleme',
        description: 'Otomatik veri yedekleme',
        category: 'güvenlik'
      }
    ]

    res.json({ features: availableFeatures }); return;
  } catch (error) {
    console.error('Get available features error:', error); res.status(500).json({ message: 'Database error' }); return;
  }
})

// Socket.IO
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  
  socket.on('join-room', (roomId: string) => {
    socket.join(`room-${roomId}`)
    console.log(`Socket ${socket.id} joined room ${roomId}`)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

// Error handling
app.use((err: unknown, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  void _next // mark as used to satisfy lint
  console.error(err instanceof Error ? err.stack : String(err))
  res.status(500).json({ message: 'Something went wrong!' })
})

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' })
})

// Start server
server.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL}`)
  console.log(`🗄️ Database: ${process.env.DATABASE_URL?.split('@')[1]}`)
  
  // Super admin oluştur
  try {
    await createSuperAdmin()
    console.log('✅ Super admin hazır')
  } catch (error) {
    console.error('❌ Super admin oluşturma hatası:', error)
  }
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully')
  await prisma.$disconnect()
  server.close(() => {
    console.log('Process terminated')
  })
})
