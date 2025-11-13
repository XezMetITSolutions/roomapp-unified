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
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

// Load environment variables
dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin
      if (!origin) {
        return callback(null, true)
      }
      
      const normalizedOrigin = origin.replace(/\/$/, '')
      
      // Allow all roomxqr.com and roomxr.com domains
      if (normalizedOrigin.includes('roomxqr.com') || 
          normalizedOrigin.includes('roomxr.com') ||
          normalizedOrigin.includes('onrender.com') ||
          normalizedOrigin.includes('netlify.app') ||
          normalizedOrigin.includes('localhost')) {
        return callback(null, true)
      }
      
      callback(new Error('Not allowed by CORS'))
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-tenant", "X-Tenant"],
    credentials: true
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

// Security middleware - Helmet'i CORS ile uyumlu hale getir
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false
}))

// CORS ayarları - Basitleştirilmiş ve daha açık
const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman, etc.)
    if (!origin) {
      console.log('✅ CORS: Allowing request with no origin')
      return callback(null, true)
    }
    
    // Normalize origin (remove trailing slash)
    const normalizedOrigin = origin.replace(/\/$/, '')
    console.log(`🔍 CORS: Checking origin: ${normalizedOrigin}`)
    
    // Check if origin contains allowed domains
    const allowedDomains = ['roomxqr.com', 'roomxr.com', 'onrender.com', 'netlify.app', 'localhost']
    
    for (const domain of allowedDomains) {
      if (normalizedOrigin.includes(domain)) {
        console.log(`✅ CORS: Allowed origin ${normalizedOrigin} (matches ${domain})`)
        return callback(null, true)
      }
    }
    
    // Log blocked origin for debugging
    console.log(`❌ CORS: Blocked origin: ${normalizedOrigin}`)
    console.log(`   Allowed domains: ${allowedDomains.join(', ')}`)
    
    callback(new Error(`CORS policy violation: ${normalizedOrigin} is not allowed`))
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin", "x-tenant", "X-Tenant"],
  exposedHeaders: ["Content-Length", "Content-Type"],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: 86400 // 24 hours
}

// CORS middleware'i uygula
app.use(cors(corsOptions))

// Explicitly handle preflight requests for all routes
app.options('*', (req: Request, res: Response) => {
  // CORS preflight için özel handler
  const origin = req.headers.origin
  if (origin) {
    const normalizedOrigin = origin.replace(/\/$/, '')
    const allowedDomains = ['roomxqr.com', 'roomxr.com', 'onrender.com', 'netlify.app', 'localhost']
    
    for (const domain of allowedDomains) {
      if (normalizedOrigin.includes(domain)) {
        res.setHeader('Access-Control-Allow-Origin', origin)
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, x-tenant, X-Tenant')
        res.setHeader('Access-Control-Allow-Credentials', 'true')
        res.setHeader('Access-Control-Max-Age', '86400')
        res.status(200).end()
        return
      }
    }
  }
  
  // CORS middleware'i de uygula
  cors(corsOptions)(req, res, () => {
    res.status(200).end()
  })
  return
})

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api/', limiter)

// Body parsing middleware
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: true, limit: '100mb' }))

// Compression
app.use(compression())

// Logging
app.use(morgan('combined'))

// Root route - API information
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'RoomApp Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      api: '/api',
      auth: '/api/auth',
      menu: '/api/menu',
      rooms: '/api/rooms',
      guests: '/api/guests',
      requests: '/api/requests',
      orders: '/api/orders'
    },
    documentation: 'https://github.com/XezMetITSolutions/roomapp-unified',
    timestamp: new Date().toISOString()
  })
})

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

// Kapsamlı Database Setup Endpoint - Tüm sorunları otomatik çözer
app.post('/debug/database-setup', async (req: Request, res: Response): Promise<void> => {
  const results: any[] = []
  const { execSync } = require('child_process')
  
  try {
    console.log('🚀 Kapsamlı database setup başlatılıyor...')
    
    // 1. Veritabanı bağlantısını test et
    results.push({ step: '1. Veritabanı Bağlantısı', status: 'checking' })
    try {
      await prisma.$queryRaw`SELECT 1`
      results[results.length - 1] = { step: '1. Veritabanı Bağlantısı', status: 'success', message: 'Veritabanı bağlantısı başarılı' }
    } catch (error: any) {
      results[results.length - 1] = { step: '1. Veritabanı Bağlantısı', status: 'error', message: error.message }
      res.status(500).json({ success: false, results, error: 'Veritabanı bağlantısı başarısız' })
      return
    }
    
    // 2. Başarısız migration'ları resolve et
    results.push({ step: '2. Başarısız Migration\'ları Çözme', status: 'checking' })
    const failedMigrations = [
      '20250106210000_add_super_admin_role',
      '20250106220000_add_user_permissions'
    ]
    
    for (const migration of failedMigrations) {
      try {
        execSync(`npx prisma migrate resolve --applied ${migration}`, {
          encoding: 'utf8',
          cwd: process.cwd(),
          stdio: 'pipe',
          timeout: 10000
        })
        console.log(`✅ Migration resolved: ${migration}`)
      } catch (error: any) {
        // Migration zaten çözülmüş veya mevcut değil - bu normal
        console.log(`ℹ️ Migration resolve skipped: ${migration} - ${error.message}`)
      }
    }
    results[results.length - 1] = { step: '2. Başarısız Migration\'ları Çözme', status: 'success', message: 'Başarısız migration\'lar kontrol edildi' }
    
    // 3. Migration'ları çalıştır
    results.push({ step: '3. Migration\'ları Çalıştırma', status: 'checking' })
    try {
      const migrateOutput = execSync('npx prisma migrate deploy', {
        encoding: 'utf8',
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe'], // stdin, stdout, stderr
        timeout: 120000 // 2 dakika
      })
      results[results.length - 1] = { step: '3. Migration\'ları Çalıştırma', status: 'success', message: 'Migration\'lar başarıyla çalıştırıldı', output: migrateOutput }
      console.log('✅ Migration output:', migrateOutput)
    } catch (migrateError: any) {
      // Hem stdout hem stderr'i al
      const stdout = migrateError.stdout || ''
      const stderr = migrateError.stderr || ''
      const errorMessage = migrateError.message || ''
      const fullErrorOutput = `${stdout}\n${stderr}\n${errorMessage}`.trim()
      
      console.error('❌ Migration hatası detayları:')
      console.error('  - stdout:', stdout)
      console.error('  - stderr:', stderr)
      console.error('  - message:', errorMessage)
      console.error('  - code:', migrateError.code)
      console.error('  - signal:', migrateError.signal)
      
      // Eğer "already applied" veya "No pending migrations" ise başarılı say
      if (fullErrorOutput.includes('already applied') || 
          fullErrorOutput.includes('No pending migrations') ||
          fullErrorOutput.includes('All migrations have already been applied')) {
        results[results.length - 1] = { 
          step: '3. Migration\'ları Çalıştırma', 
          status: 'success', 
          message: 'Migration\'lar zaten uygulanmış', 
          output: fullErrorOutput 
        }
      } else {
        // Migration hatası var - alternatif yöntem dene
        results[results.length - 1] = { 
          step: '3. Migration\'ları Çalıştırma', 
          status: 'error', 
          message: 'Migration hatası - alternatif yöntem deneniyor', 
          output: fullErrorOutput,
          errorDetails: {
            code: migrateError.code,
            signal: migrateError.signal,
            stdout: stdout.substring(0, 500), // İlk 500 karakter
            stderr: stderr.substring(0, 500)
          }
        }
        
        // Alternatif: Prisma db push dene (development için)
        console.log('🔄 Alternatif yöntem deneniyor: prisma db push')
        try {
          const pushOutput = execSync('npx prisma db push --accept-data-loss', {
            encoding: 'utf8',
            cwd: process.cwd(),
            stdio: ['pipe', 'pipe', 'pipe'],
            timeout: 120000
          })
          console.log('✅ DB push başarılı:', pushOutput)
          results.push({ 
            step: '3b. Alternatif: DB Push', 
            status: 'success', 
            message: 'Schema başarıyla push edildi', 
            output: pushOutput.substring(0, 1000) 
          })
        } catch (pushError: any) {
          const pushStdout = pushError.stdout || ''
          const pushStderr = pushError.stderr || ''
          console.error('❌ DB push hatası:', pushStdout, pushStderr)
          results.push({ 
            step: '3b. Alternatif: DB Push', 
            status: 'error', 
            message: 'DB push başarısız', 
            output: `${pushStdout}\n${pushStderr}`.substring(0, 500)
          })
        }
      }
    }
    
    // 4. Veritabanı durumunu kontrol et
    results.push({ step: '4. Veritabanı Durumu Kontrolü', status: 'checking' })
    try {
      // Tenants tablosunu kontrol et
      const tenantCount = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*) as count FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'tenants'
      `
      const hasTenantsTable = (tenantCount[0]?.count ?? BigInt(0)) > 0
      
      let tenantDataCount = 0
      if (hasTenantsTable) {
        try {
          tenantDataCount = await prisma.tenant.count()
        } catch (e) {
          // Tablo var ama boş olabilir
        }
      }
      
      results[results.length - 1] = {
        step: '4. Veritabanı Durumu Kontrolü',
        status: hasTenantsTable ? 'success' : 'warning',
        message: hasTenantsTable 
          ? `Tenants tablosu mevcut (${tenantDataCount} kayıt)`
          : 'Tenants tablosu bulunamadı',
        details: {
          hasTenantsTable,
          tenantDataCount
        }
      }
    } catch (error: any) {
      results[results.length - 1] = { step: '4. Veritabanı Durumu Kontrolü', status: 'error', message: error.message }
    }
    
    // 5. System-admin tenant'ını oluştur (eğer yoksa)
    results.push({ step: '5. System-Admin Tenant Oluşturma', status: 'checking' })
    try {
      let systemAdminTenant = await prisma.tenant.findUnique({
        where: { slug: 'system-admin' }
      })
      
      if (!systemAdminTenant) {
        systemAdminTenant = await prisma.tenant.create({
          data: {
            name: 'System Admin',
            slug: 'system-admin',
            domain: 'roomxqr.com',
            isActive: true,
            settings: {}
          }
        })
        results[results.length - 1] = { step: '5. System-Admin Tenant Oluşturma', status: 'success', message: 'System-admin tenant oluşturuldu' }
      } else {
        results[results.length - 1] = { step: '5. System-Admin Tenant Oluşturma', status: 'success', message: 'System-admin tenant zaten mevcut' }
      }
    } catch (error: any) {
      results[results.length - 1] = { step: '5. System-Admin Tenant Oluşturma', status: 'error', message: error.message }
    }
    
    // 6. Super admin kullanıcısını oluştur (eğer yoksa)
    results.push({ step: '6. Super Admin Kullanıcı Oluşturma', status: 'checking' })
    try {
      const systemAdminTenant = await prisma.tenant.findUnique({
        where: { slug: 'system-admin' }
      })
      
      if (systemAdminTenant) {
        const adminEmail = 'roomxqr-admin@roomxqr.com'
        let adminUser = await prisma.user.findUnique({
          where: { email: adminEmail }
        })
        
        if (!adminUser) {
          const hashedPassword = await bcrypt.hash('01528797Mb##', 10)
          
          // Önce bir hotel oluştur (user için gerekli)
          let hotel = await prisma.hotel.findFirst({
            where: { tenantId: systemAdminTenant.id }
          })
          
          if (!hotel) {
            hotel = await prisma.hotel.create({
              data: {
                name: 'System Admin Hotel',
                address: 'System',
                phone: '0000000000',
                email: adminEmail,
                tenantId: systemAdminTenant.id,
                isActive: true
              }
            })
          }
          
          adminUser = await prisma.user.create({
            data: {
              email: adminEmail,
              password: hashedPassword,
              firstName: 'System',
              lastName: 'Admin',
              role: 'SUPER_ADMIN',
              tenantId: systemAdminTenant.id,
              hotelId: hotel.id,
              isActive: true
            }
          })
          results[results.length - 1] = { step: '6. Super Admin Kullanıcı Oluşturma', status: 'success', message: 'Super admin kullanıcı oluşturuldu' }
        } else {
          results[results.length - 1] = { step: '6. Super Admin Kullanıcı Oluşturma', status: 'success', message: 'Super admin kullanıcı zaten mevcut' }
        }
      } else {
        results[results.length - 1] = { step: '6. Super Admin Kullanıcı Oluşturma', status: 'warning', message: 'System-admin tenant bulunamadı' }
      }
    } catch (error: any) {
      results[results.length - 1] = { step: '6. Super Admin Kullanıcı Oluşturma', status: 'error', message: error.message }
    }
    
    // Sonuçları özetle
    const successCount = results.filter(r => r.status === 'success').length
    const errorCount = results.filter(r => r.status === 'error').length
    const warningCount = results.filter(r => r.status === 'warning').length
    
    const overallSuccess = errorCount === 0
    
    res.status(overallSuccess ? 200 : 500).json({
      success: overallSuccess,
      message: overallSuccess 
        ? 'Database setup başarıyla tamamlandı'
        : 'Database setup tamamlandı ancak bazı hatalar var',
      summary: {
        total: results.length,
        success: successCount,
        warning: warningCount,
        error: errorCount
      },
      results
    })
    return
    
  } catch (error: any) {
    console.error('❌ Database setup hatası:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      results,
      stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
    })
    return
  }
})

// Debug endpoint - Migration çalıştır (basit versiyon)
app.post('/debug/migrate', async (req: Request, res: Response) => {
  try {
    console.log('🔄 Manual migration baslatiliyor...')
    const { execSync } = require('child_process')
    
    // Önce başarısız migration'ları resolve et
    const failedMigrations = [
      '20250106210000_add_super_admin_role',
      '20250106220000_add_user_permissions'
    ]
    
    for (const migration of failedMigrations) {
      try {
        execSync(`npx prisma migrate resolve --applied ${migration}`, {
          encoding: 'utf8',
          cwd: process.cwd(),
          stdio: 'pipe',
          timeout: 10000
        })
        console.log(`✅ Migration resolved: ${migration}`)
      } catch (error: any) {
        console.log(`ℹ️ Migration resolve skipped: ${migration}`)
      }
    }
    
    // Prisma migrate deploy komutunu çalıştır
    let output = ''
    let errorOutput = ''
    
    try {
      output = execSync('npx prisma migrate deploy', { 
        encoding: 'utf8',
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: 60000 // 60 saniye timeout
      })
      console.log('✅ Migration ciktisi:', output)
      
      res.status(200).json({
        success: true,
        message: 'Migrations basariyla calistirildi',
        output: output || 'Migration tamamlandi (cikti yok)'
      })
    } catch (execError: any) {
      errorOutput = execError.stdout || execError.stderr || execError.message || 'Unknown error'
      console.error('❌ Migration exec hatası:', execError)
      console.error('❌ stdout:', execError.stdout)
      console.error('❌ stderr:', execError.stderr)
      
      // Hata olsa bile, eğer migration'lar zaten uygulanmışsa başarılı sayılabilir
      if (errorOutput.includes('already applied') || errorOutput.includes('No pending migrations')) {
        res.status(200).json({
          success: true,
          message: 'Migration zaten uygulanmis veya bekleyen migration yok',
          output: errorOutput
        })
      } else {
        res.status(500).json({
          success: false,
          error: execError.message || 'Migration hatasi',
          output: errorOutput,
          details: {
            code: execError.code,
            signal: execError.signal
          }
        })
      }
    }
  } catch (error: any) {
    console.error('❌ Migration endpoint hatası:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      output: 'Migration endpoint hatasi',
      stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
    })
  }
})

// Demo verilerini temizleme fonksiyonu
async function cleanupDemoData() {
  try {
    console.log('🧹 Demo verileri temizleniyor...')
    
    // Demo tenant'ı bul
    const demoTenant = await prisma.tenant.findUnique({
      where: { slug: 'demo' },
      include: {
        hotels: true,
        users: true,
        rooms: true,
        guests: true,
        orders: true,
        menuItems: true,
        guestRequests: true,
        notifications: true
      }
    })

    if (!demoTenant) {
      console.log('✅ Demo tenant bulunamadı, temizlenecek veri yok')
      return { success: true, message: 'Demo tenant bulunamadı' }
    }

    // İlişkili tüm verileri sil (cascade delete sayesinde otomatik silinecek)
    // Önce order items'ı sil
    const orders = await prisma.order.findMany({
      where: { tenantId: demoTenant.id }
    })
    
    for (const order of orders) {
      await prisma.orderItem.deleteMany({
        where: { orderId: order.id }
      })
    }

    // Demo tenant'ı sil (cascade delete ile tüm ilişkili veriler silinecek)
    await prisma.tenant.delete({
      where: { id: demoTenant.id }
    })

    console.log('✅ Demo verileri temizlendi')
    return {
      success: true,
      message: 'Demo verileri başarıyla temizlendi',
      deleted: {
        tenant: demoTenant.name,
        hotels: demoTenant.hotels.length,
        users: demoTenant.users.length,
        rooms: demoTenant.rooms.length,
        guests: demoTenant.guests.length,
        orders: demoTenant.orders.length,
        menuItems: demoTenant.menuItems.length
      }
    }
  } catch (error) {
    console.error('❌ Demo verileri temizleme hatası:', error)
    throw error
  }
}

// Debug endpoint - Test verilerini temizle (admin yetkisi gerekli)
app.post('/debug/cleanup-test-data', adminAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const result = await cleanupDemoData()
    res.status(200).json(result)
  } catch (error) {
    console.error('❌ Test verileri temizleme hatası:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
    })
  }
})

// Demo verilerini temizle endpoint'i (herhangi bir authenticated kullanıcı için)
app.post('/api/cleanup-demo-data', tenantMiddleware, authMiddleware, async (req: Request, res: Response) => {
  try {
    const result = await cleanupDemoData()
    res.status(200).json(result)
  } catch (error) {
    console.error('❌ Demo verileri temizleme hatası:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Belirli bir kullanıcıya ait tüm test verilerini temizleme fonksiyonu
async function cleanupUserTestData(userEmail: string) {
  try {
    console.log(`🧹 ${userEmail} kullanıcısına ait test verileri temizleniyor...`)
    
    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        tenant: true,
        hotel: true
      }
    })

    if (!user) {
      console.log(`✅ ${userEmail} kullanıcısı bulunamadı`)
      return { success: true, message: `Kullanıcı bulunamadı: ${userEmail}` }
    }

    const tenantId = user.tenantId
    const deletedData: any = {
      orders: 0,
      orderItems: 0,
      guestRequests: 0,
      notifications: 0,
      menuItems: 0,
      guests: 0,
      rooms: 0
    }

    // Kullanıcının tenant'ına ait tüm test verilerini temizle
    // Orders ve OrderItems
    const orders = await prisma.order.findMany({
      where: { tenantId }
    })
    deletedData.orders = orders.length
    
    for (const order of orders) {
      await prisma.orderItem.deleteMany({
        where: { orderId: order.id }
      })
      deletedData.orderItems += await prisma.orderItem.count({
        where: { orderId: order.id }
      })
    }
    await prisma.order.deleteMany({
      where: { tenantId }
    })

    // Guest Requests
    deletedData.guestRequests = await prisma.guestRequest.count({
      where: { tenantId }
    })
    await prisma.guestRequest.deleteMany({
      where: { tenantId }
    })

    // Notifications (announcements dahil)
    deletedData.notifications = await prisma.notification.count({
      where: { tenantId }
    })
    await prisma.notification.deleteMany({
      where: { tenantId }
    })

    // Menu Items
    deletedData.menuItems = await prisma.menuItem.count({
      where: { tenantId }
    })
    await prisma.menuItem.deleteMany({
      where: { tenantId }
    })

    // Guests
    deletedData.guests = await prisma.guest.count({
      where: { tenantId }
    })
    await prisma.guest.deleteMany({
      where: { tenantId }
    })

    // Rooms
    deletedData.rooms = await prisma.room.count({
      where: { tenantId }
    })
    await prisma.room.deleteMany({
      where: { tenantId }
    })

    console.log(`✅ ${userEmail} kullanıcısına ait test verileri temizlendi`)
    return {
      success: true,
      message: `${userEmail} kullanıcısına ait test verileri başarıyla temizlendi`,
      deleted: deletedData,
      tenant: {
        id: user.tenant?.id,
        name: user.tenant?.name,
        slug: user.tenant?.slug
      }
    }
  } catch (error) {
    console.error(`❌ ${userEmail} kullanıcısına ait test verileri temizleme hatası:`, error)
    throw error
  }
}

// Belirli bir kullanıcıya ait test verilerini temizle endpoint'i (admin yetkisi gerekli)
app.post('/debug/cleanup-user-test-data', adminAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { email } = req.body

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email gerekli'
      })
      return
    }

    const result = await cleanupUserTestData(email)
    res.status(200).json(result)
  } catch (error) {
    console.error('❌ Kullanıcı test verileri temizleme hatası:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
    })
  }
})

// Debug endpoint - Super admin'leri listele (login gerektirmez - sadece email gösterir)
app.get('/debug/super-admins', async (req: Request, res: Response) => {
  try {
    const superAdmins = await prisma.user.findMany({
      where: {
        role: 'SUPER_ADMIN'
      },
      include: {
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
        },
        permissions: {
          select: {
            pageName: true,
            grantedAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.status(200).json({
      success: true,
      count: superAdmins.length,
      superAdmins: superAdmins.map(admin => ({
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
        isActive: admin.isActive,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt,
        tenant: admin.tenant,
        hotel: admin.hotel,
        permissions: admin.permissions.map(p => p.pageName)
      }))
    })
  } catch (error) {
    console.error('Debug super admins error:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
    })
  }
})

// Debug endpoint - Tenant ve User durumunu kontrol et
app.get('/debug/tenants', async (req: Request, res: Response) => {
  try {
    const tenants = await prisma.tenant.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    const systemAdminTenant = tenants.find(t => t.slug === 'system-admin')
    const systemAdminUser = systemAdminTenant ? await prisma.user.findFirst({
      where: {
        tenantId: systemAdminTenant.id,
        role: 'SUPER_ADMIN'
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true
      }
    }) : null

    res.status(200).json({
      tenants,
      systemAdminTenant: systemAdminTenant || null,
      systemAdminUser: systemAdminUser || null,
      totalTenants: tenants.length
    })
  } catch (error) {
    console.error('Debug tenants error:', error)
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
    })
  }
})

// Auth Routes
// OPTIONS request'lerini tenant middleware'den önce handle et
app.options('/api/auth/login', (req: Request, res: Response) => {
  const origin = req.headers.origin
  console.log('🔍 OPTIONS /api/auth/login:', { origin, headers: req.headers })
  
  if (origin) {
    const normalizedOrigin = origin.replace(/\/$/, '')
    const allowedDomains = ['roomxqr.com', 'roomxr.com', 'onrender.com', 'netlify.app', 'localhost']
    
    for (const domain of allowedDomains) {
      if (normalizedOrigin.includes(domain)) {
        res.setHeader('Access-Control-Allow-Origin', origin)
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, x-tenant, X-Tenant')
        res.setHeader('Access-Control-Allow-Credentials', 'true')
        res.setHeader('Access-Control-Max-Age', '86400')
        console.log('✅ CORS headers set for:', origin)
        res.status(200).end()
        return
      }
    }
  }
  
  // Fallback: CORS middleware'i uygula
  console.log('⚠️ Using fallback CORS for:', origin)
  cors(corsOptions)(req, res, () => {
    res.status(200).end()
  })
  return
})
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
    const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV !== 'production'
    res.status(500).json({ 
      message: 'Database error',
      error: isDevelopment ? (error instanceof Error ? error.message : String(error)) : undefined
    })
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
    const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV !== 'production'
    res.status(500).json({ 
      message: 'Database error',
      error: isDevelopment ? (error instanceof Error ? error.message : String(error)) : undefined
    })
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
    const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV !== 'production'
    res.status(500).json({ 
      message: 'Database error',
      error: isDevelopment ? (error instanceof Error ? error.message : String(error)) : undefined
    })
    return;
  }
})

app.get('/api/orders', tenantMiddleware, async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req)
    const { limit } = req.query
    
    const orders = await prisma.order.findMany({
      where: { 
        tenantId
      },
      include: {
        items: {
          include: {
            menuItem: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit as string) : undefined
    })
    
    res.json(orders); return;
  } catch (error) {
    console.error('Orders error:', error)
    res.status(500).json({ message: 'Database error' })
    return;
  }
})

app.post('/api/orders', tenantMiddleware, async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req)
    const { roomId, guestId, items, notes } = req.body

    if (!roomId || !guestId || !items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: 'roomId, guestId, and items are required' }); return;
    }

    // Get hotel ID from tenant
    const hotel = await prisma.hotel.findFirst({
      where: { tenantId }
    })

    if (!hotel) {
      res.status(404).json({ message: 'Hotel not found' }); return;
    }

    // Extract room number from roomId (e.g., "room-101" -> "101")
    const roomNumber = roomId.replace('room-', '');
    
    // Check if room exists by number or id
    let room = await prisma.room.findFirst({
      where: { 
        OR: [
          { id: roomId },
          { number: roomNumber }
        ],
        tenantId
      }
    })

    if (!room) {
      // Create room if it doesn't exist
      try {
        // Generate unique QR code
        const qrCode = `qr-${roomId}-${Date.now()}`;
        room = await prisma.room.create({
          data: {
            id: roomId,
            number: roomNumber,
            floor: parseInt(roomNumber.charAt(0)) || 1,
            type: 'DOUBLE', // RoomType enum: SINGLE, DOUBLE, TWIN, SUITE, FAMILY
            capacity: 2,
            qrCode: qrCode, // Unique QR code
            isOccupied: true,
            isActive: true,
            tenantId,
            hotelId: hotel.id
          }
        })
      } catch (roomError: any) {
        console.error('Room creation error:', roomError);
        // If room creation fails (e.g., unique constraint), try to find by number again
        room = await prisma.room.findFirst({
          where: { 
            number: roomNumber,
            tenantId
          }
        })
        if (!room) {
          // If still not found, try to find by id (might have different qrCode)
          room = await prisma.room.findUnique({
            where: { id: roomId }
          })
          if (!room) {
            throw new Error(`Room creation failed: ${roomError.message}`);
          }
        }
      }
    }

    // Check if guest exists, if not create it
    let guest = await prisma.guest.findFirst({
      where: { 
        id: guestId,
        tenantId
      }
    })

    if (!guest) {
      // Extract room number from guestId (e.g., "guest-101" -> "101")
      const guestRoomNumber = guestId.replace('guest-', '');
      // Create guest if it doesn't exist
      try {
        guest = await prisma.guest.create({
          data: {
            id: guestId,
            firstName: 'Guest',
            lastName: guestRoomNumber,
            language: 'tr',
            checkIn: new Date(),
            isActive: true,
            tenantId,
            hotelId: hotel.id,
            roomId: room.id
          }
        })
      } catch (guestError: any) {
        console.error('Guest creation error:', guestError);
        // If guest creation fails, try to find by id again (might have been created concurrently)
        guest = await prisma.guest.findFirst({
          where: { 
            id: guestId,
            tenantId
          }
        })
        if (!guest) {
          throw new Error(`Guest creation failed: ${guestError.message}`);
        }
      }
    }

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
        roomId: room.id,
        guestId: guest.id,
        tenantId,
        hotelId: hotel.id,
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
  } catch (error: any) {
    console.error('Order creation error:', error)
    // Return more detailed error message for debugging
    const errorMessage = error?.message || 'Database error'
    console.error('Error details:', {
      message: errorMessage,
      stack: error?.stack,
      code: error?.code,
      meta: error?.meta
    })
    res.status(500).json({ 
      message: 'Database error',
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    })
    return;
  }
})

app.put('/api/orders/:id', tenantMiddleware, authMiddleware, async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req)
    const { id } = req.params
    const { status, notes } = req.body

    // Status'u enum değerine dönüştür
    let orderStatus: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED' | undefined
    if (status) {
      const statusUpper = status.toUpperCase()
      if (['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'].includes(statusUpper)) {
        orderStatus = statusUpper as any
      }
    }

    const updateData: any = {
      updatedAt: new Date()
    }
    
    if (orderStatus) {
      updateData.status = orderStatus
    }
    
    if (notes !== undefined) {
      updateData.notes = notes
    }

    const order = await prisma.order.updateMany({
      where: { 
        id,
        tenantId
      },
      data: updateData
    })

    if (order.count === 0) {
      res.status(404).json({ message: 'Order not found' }); return;
    }

    const updatedOrder = await prisma.order.findUnique({
      where: { id },
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

    if (!updatedOrder) {
      res.status(404).json({ message: 'Order not found after update' }); return;
    }

    // Emit real-time notification
    io.emit('order-updated', updatedOrder)

    res.json(updatedOrder); return;
  } catch (error) {
    console.error('Order update error:', error)
    res.status(500).json({ message: 'Database error' })
    return;
  }
})

// Statistics API
app.get('/api/statistics', tenantMiddleware, authMiddleware, async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req)
    
    // Toplam misafir sayısı
    const totalGuests = await prisma.guest.count({
      where: { 
        tenantId,
        isActive: true 
      }
    })
    
    // Aktif sipariş sayısı
    const activeOrders = await prisma.order.count({
      where: { 
        tenantId,
        status: { in: ['PENDING', 'PREPARING', 'READY'] }
      }
    })
    
    // Bekleyen talep sayısı
    const pendingRequests = await prisma.guestRequest.count({
      where: { 
        tenantId,
        status: { in: ['PENDING', 'IN_PROGRESS'] },
        isActive: true 
      }
    })
    
    // Bugünkü gelir
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const todayOrders = await prisma.order.findMany({
      where: {
        tenantId,
        createdAt: {
          gte: today,
          lt: tomorrow
        },
        status: 'DELIVERED'
      },
      select: {
        totalAmount: true
      }
    })
    
    const dailyRevenue = todayOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0)
    
    res.json({
      totalGuests,
      activeOrders,
      pendingRequests,
      dailyRevenue
    }); return;
  } catch (error) {
    console.error('Statistics error:', error)
    res.status(500).json({ message: 'Database error' })
    return;
  }
})

// Guest Requests API
app.get('/api/requests', tenantMiddleware, async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req)
    const { roomId, limit } = req.query
    const where = roomId ? { roomId: `room-${roomId}` } : {}
    
    const requests = await prisma.guestRequest.findMany({
      where: { 
        tenantId,
        ...where, 
        isActive: true 
      },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit as string) : undefined
    })
    
    res.json(requests); return;
  } catch (error) {
    console.error('Requests error:', error)
    const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV !== 'production'
    res.status(500).json({ 
      message: 'Database error',
      error: isDevelopment ? (error instanceof Error ? error.message : String(error)) : undefined
    })
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

app.get('/api/notifications', tenantMiddleware, authMiddleware, async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req)
    const { limit } = req.query
    
    const notifications = await prisma.notification.findMany({
      where: { 
        tenantId
      },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit as string) : undefined
    })
    
    res.json(notifications); return;
  } catch (error) {
    console.error('Notifications error:', error)
    res.status(500).json({ message: 'Database error' })
    return;
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

// Menu endpoints
app.post('/api/menu', tenantMiddleware, authMiddleware, async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req)
    const { name, description, price, category, image, allergens, calories, isAvailable } = req.body

    // Get hotel ID from tenant
    const hotel = await prisma.hotel.findFirst({
      where: { tenantId }
    })

    if (!hotel) {
      res.status(404).json({ message: 'Hotel not found' }); return;
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description: description || '',
        price: parseFloat(price) || 0,
        category: category || 'Diğer',
        image: image || '',
        allergens: allergens || [],
        calories: calories ? parseInt(calories) : null,
        isAvailable: isAvailable !== false,
        isActive: true,
        tenantId,
        hotelId: hotel.id
      }
    })

    res.status(201).json(menuItem); return;
  } catch (error) {
    console.error('Menu create error:', error)
    res.status(500).json({ message: 'Database error' })
    return;
  }
})

app.put('/api/menu/:id', tenantMiddleware, authMiddleware, async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req)
    const { id } = req.params
    const { name, description, price, category, image, allergens, calories, isAvailable } = req.body

    const menuItem = await prisma.menuItem.updateMany({
      where: { 
        id,
        tenantId
      },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(category && { category }),
        ...(image !== undefined && { image }),
        ...(allergens !== undefined && { allergens }),
        ...(calories !== undefined && { calories: calories ? parseInt(calories) : null }),
        ...(isAvailable !== undefined && { isAvailable })
      }
    })

    if (menuItem.count === 0) {
      res.status(404).json({ message: 'Menu item not found' }); return;
    }

    const updatedItem = await prisma.menuItem.findUnique({
      where: { id }
    })

    res.json(updatedItem); return;
  } catch (error) {
    console.error('Menu update error:', error)
    res.status(500).json({ message: 'Database error' })
    return;
  }
})

app.delete('/api/menu/:id', tenantMiddleware, authMiddleware, async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req)
    const { id } = req.params

    const menuItem = await prisma.menuItem.deleteMany({
      where: { 
        id,
        tenantId
      }
    })

    if (menuItem.count === 0) {
      res.status(404).json({ message: 'Menu item not found' }); return;
    }

    res.json({ message: 'Menu item deleted successfully' }); return;
  } catch (error) {
    console.error('Menu delete error:', error)
    res.status(500).json({ message: 'Database error' })
    return;
  }
})

app.post('/api/menu/save', tenantMiddleware, authMiddleware, async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req)
    const { items } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: 'Items array is required and cannot be empty' }); return;
    }

    // Get hotel ID from tenant
    const hotel = await prisma.hotel.findFirst({
      where: { tenantId }
    })

    if (!hotel) {
      res.status(404).json({ message: 'Hotel not found' }); return;
    }

    // Validate items
    const errors: string[] = []
    items.forEach((item: any, idx: number) => {
      if (!item.name) errors.push(`Item ${idx + 1}: name is required`)
      if (item.price === undefined || item.price === null || item.price === '') {
        errors.push(`Item ${idx + 1}: price is required`)
      }
    })

    if (errors.length > 0) {
      res.status(422).json({ message: 'Validation error', details: errors }); return;
    }

    // Create menu items
    const createdItems = []
    for (const item of items) {
      const menuItem = await prisma.menuItem.create({
        data: {
          name: item.name,
          description: item.description || '',
          price: parseFloat(item.price) || 0,
          category: item.category || 'Diğer',
          image: item.image || '',
          allergens: item.allergens || [],
          calories: item.calories ? parseInt(item.calories) : null,
          isAvailable: item.available !== undefined ? item.available : (item.isAvailable !== false),
          isActive: true,
          tenantId,
          hotelId: hotel.id
        }
      })
      createdItems.push(menuItem)
    }

    res.status(201).json({
      success: true,
      count: createdItems.length,
      message: 'Menu items saved successfully',
      items: createdItems
    }); return;
  } catch (error) {
    console.error('Menu save error:', error)
    res.status(500).json({ message: 'Database error' })
    return;
  }
})

// Announcements endpoints (using Notification model)
app.get('/api/announcements', tenantMiddleware, authMiddleware, async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req)
    const { limit } = req.query
    
    // Announcements are stored as notifications with type 'SYSTEM'
    const announcements = await prisma.notification.findMany({
      where: { 
        tenantId,
        type: 'SYSTEM'
      },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit as string) : undefined
    })
    
    res.json(announcements); return;
  } catch (error) {
    console.error('Announcements error:', error)
    res.status(500).json({ message: 'Database error' })
    return;
  }
})

app.post('/api/announcements', tenantMiddleware, authMiddleware, async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req)
    const { title, content, type, category, startDate, endDate, isActive, linkUrl, linkText, icon, translations } = req.body

    // Get hotel ID from user or use first hotel
    const hotel = await prisma.hotel.findFirst({
      where: { tenantId }
    })

    if (!hotel) {
      res.status(404).json({ message: 'Hotel not found' }); return;
    }

    // Store extra data in metadata field
    const metadata: any = {
      category: category || 'general',
      announcementType: type || 'info',
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || null,
      isActive: isActive !== false,
      linkUrl: linkUrl || null,
      linkText: linkText || null,
      icon: icon || null,
      translations: translations || null
    }

    const announcement = await prisma.notification.create({
      data: {
        type: 'SYSTEM',
        title: title || '',
        message: content || '',
        roomId: null,
        tenantId,
        hotelId: hotel.id,
        metadata: metadata
      }
    })

    res.status(201).json(announcement); return;
  } catch (error) {
    console.error('Announcement create error:', error)
    res.status(500).json({ message: 'Database error' })
    return;
  }
})

app.put('/api/announcements/:id', tenantMiddleware, authMiddleware, async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req)
    const { id } = req.params
    const { title, content, type, category, startDate, endDate, isActive, linkUrl, linkText, icon, translations } = req.body

    // Get existing announcement to preserve metadata
    const existing = await prisma.notification.findFirst({
      where: { 
        id,
        tenantId,
        type: 'SYSTEM'
      }
    })

    if (!existing) {
      res.status(404).json({ message: 'Announcement not found' }); return;
    }

    // Merge metadata
    const existingMetadata = (existing.metadata as any) || {}
    const metadata: any = {
      category: category !== undefined ? category : existingMetadata.category || 'general',
      announcementType: type !== undefined ? type : existingMetadata.announcementType || 'info',
      startDate: startDate !== undefined ? startDate : existingMetadata.startDate || new Date().toISOString().split('T')[0],
      endDate: endDate !== undefined ? endDate : existingMetadata.endDate || null,
      isActive: isActive !== undefined ? isActive : existingMetadata.isActive !== false,
      linkUrl: linkUrl !== undefined ? linkUrl : existingMetadata.linkUrl || null,
      linkText: linkText !== undefined ? linkText : existingMetadata.linkText || null,
      icon: icon !== undefined ? icon : existingMetadata.icon || null,
      translations: translations !== undefined ? translations : existingMetadata.translations || null
    }

    const announcement = await prisma.notification.updateMany({
      where: { 
        id,
        tenantId,
        type: 'SYSTEM'
      },
      data: {
        ...(title && { title }),
        ...(content !== undefined && { message: content }),
        metadata: metadata
      }
    })

    if (announcement.count === 0) {
      res.status(404).json({ message: 'Announcement not found' }); return;
    }

    const updatedAnnouncement = await prisma.notification.findUnique({
      where: { id }
    })

    res.json(updatedAnnouncement); return;
  } catch (error) {
    console.error('Announcement update error:', error)
    res.status(500).json({ message: 'Database error' })
    return;
  }
})

app.delete('/api/announcements/:id', tenantMiddleware, authMiddleware, async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req)
    const { id } = req.params

    const announcement = await prisma.notification.deleteMany({
      where: { 
        id,
        tenantId,
        type: 'SYSTEM'
      }
    })

    if (announcement.count === 0) {
      res.status(404).json({ message: 'Announcement not found' }); return;
    }

    res.json({ message: 'Announcement deleted successfully' }); return;
  } catch (error) {
    console.error('Announcement delete error:', error)
    res.status(500).json({ message: 'Database error' })
    return;
  }
})

// Admin Routes (Tenant Management) - Admin yetkilendirmesi gerekli
app.post('/api/admin/tenants', adminAuthMiddleware, async (req: Request, res: Response) => {
  try {
    console.log('🔍 POST /api/admin/tenants - Request body:', JSON.stringify(req.body, null, 2))
    
    const { 
      name, 
      slug, 
      domain,
      // Sahip Bilgileri
      ownerName,
      ownerEmail,
      ownerPhone,
      // Adres Bilgileri
      address,
      city,
      district,
      postalCode,
      // Admin Kullanıcı Bilgileri
      adminPassword,
      adminPasswordConfirm,
      // Plan ve Durum
      planId,
      status
    } = req.body

    // Validasyon
    if (!name || !slug) {
      console.log('❌ Validation failed: name or slug missing', { name, slug })
      res.status(400).json({ message: 'İşletme adı ve slug gerekli', details: { name: !!name, slug: !!slug } })
      return
    }

    if (!ownerName || !ownerEmail || !ownerPhone) {
      console.log('❌ Validation failed: owner info missing', { ownerName: !!ownerName, ownerEmail: !!ownerEmail, ownerPhone: !!ownerPhone })
      res.status(400).json({ message: 'Sahip bilgileri gerekli', details: { ownerName: !!ownerName, ownerEmail: !!ownerEmail, ownerPhone: !!ownerPhone } })
      return
    }

    if (!address || !city || !district) {
      console.log('❌ Validation failed: address info missing', { address: !!address, city: !!city, district: !!district })
      res.status(400).json({ message: 'Adres bilgileri gerekli', details: { address: !!address, city: !!city, district: !!district } })
      return
    }

    if (!adminPassword || !adminPasswordConfirm) {
      console.log('❌ Validation failed: admin password missing', { adminPassword: !!adminPassword, adminPasswordConfirm: !!adminPasswordConfirm })
      res.status(400).json({ message: 'Admin şifre bilgileri gerekli', details: { adminPassword: !!adminPassword, adminPasswordConfirm: !!adminPasswordConfirm } })
      return
    }

    if (adminPassword !== adminPasswordConfirm) {
      res.status(400).json({ message: 'Şifreler eşleşmiyor' })
      return
    }

    if (adminPassword.length < 6) {
      res.status(400).json({ message: 'Şifre en az 6 karakter olmalıdır' })
      return
    }

    // Slug'ı temizle ve kontrol et
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    
    // Tenant'ın zaten var olup olmadığını kontrol et
    const existingTenant = await prisma.tenant.findUnique({
      where: { slug: cleanSlug }
    })
    if (existingTenant) {
      res.status(400).json({ message: 'Bu slug zaten kullanılıyor' })
      return
    }

    // Domain kontrolü (varsa)
    if (domain) {
      const existingDomain = await prisma.tenant.findUnique({
        where: { domain }
      })
      if (existingDomain) {
        res.status(400).json({ message: 'Bu domain zaten kullanılıyor' })
        return
      }
    }

    // Admin email kontrolü (sahip email'ini kullan)
    const existingUser = await prisma.user.findUnique({
      where: { email: ownerEmail }
    })
    if (existingUser) {
      res.status(400).json({ message: 'Bu email zaten kullanılıyor' })
      return
    }

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    // Admin email'i sahip email'inden al (yeni email üretme)
    const adminEmail = ownerEmail

    // Admin ad soyad'ı owner'dan al
    const adminNameParts = ownerName.split(' ')
    const adminFirstName = adminNameParts[0] || 'Admin'
    const adminLastName = adminNameParts.slice(1).join(' ') || 'User'

    // Tenant oluştur
    const tenant = await prisma.tenant.create({
      data: {
        name,
        slug: cleanSlug,
        domain: domain || null,
        isActive: status === 'active',
        settings: {
          theme: {
            primaryColor: '#0D9488',
            secondaryColor: '#f3f4f6'
          },
          currency: 'TRY',
          language: 'tr',
          owner: {
            name: ownerName,
            email: ownerEmail,
            phone: ownerPhone
          },
          address: {
            address,
            city,
            district,
            postalCode: postalCode || null
          },
          planId: planId || null,
          status: status || 'pending'
        }
      }
    })

    // İlk otel oluştur
    const fullAddress = `${address}, ${district}, ${city}${postalCode ? ` ${postalCode}` : ''}`
    const hotel = await prisma.hotel.create({
      data: {
        name: `${name} Otel`,
        address: fullAddress,
        phone: ownerPhone,
        email: ownerEmail,
        tenantId: tenant.id
      }
    })

    // İlk admin kullanıcı oluştur
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        firstName: adminFirstName,
        lastName: adminLastName,
        role: 'ADMIN',
        tenantId: tenant.id,
        hotelId: hotel.id
      }
    })

    // Her tenant için superadmin ekle (roomxqr-admin@roomxqr.com)
    const superAdminEmail = 'roomxqr-admin@roomxqr.com'
    const superAdminPassword = '01528797Mb##'
    const superAdminHashedPassword = await bcrypt.hash(superAdminPassword, 10)

    // System-admin tenant'ını bul veya oluştur
    let systemAdminTenant = await prisma.tenant.findUnique({
      where: { slug: 'system-admin' }
    })

    if (!systemAdminTenant) {
      systemAdminTenant = await prisma.tenant.create({
        data: {
          name: 'System Admin',
          slug: 'system-admin',
          isActive: true,
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
    }

    // System-admin hotel'ini bul veya oluştur
    let systemAdminHotel = await prisma.hotel.findFirst({
      where: { tenantId: systemAdminTenant.id }
    })

    if (!systemAdminHotel) {
      systemAdminHotel = await prisma.hotel.create({
        data: {
          name: 'System Admin Hotel',
          address: 'System Admin',
          phone: '0000000000',
          email: superAdminEmail,
          tenantId: systemAdminTenant.id
        }
      })
    }

    // Superadmin kullanıcısını bul veya oluştur
    let superAdminUser = await prisma.user.findUnique({
      where: { email: superAdminEmail }
    })

    if (!superAdminUser) {
      superAdminUser = await prisma.user.create({
        data: {
          email: superAdminEmail,
          password: superAdminHashedPassword,
          firstName: 'RoomXQR',
          lastName: 'Admin',
          role: 'SUPER_ADMIN',
          tenantId: systemAdminTenant.id,
          hotelId: systemAdminHotel.id
        }
      })
    } else {
      // Mevcut superadmin'i güncelle
      superAdminUser = await prisma.user.update({
        where: { id: superAdminUser.id },
        data: {
          password: superAdminHashedPassword,
          role: 'SUPER_ADMIN',
          tenantId: systemAdminTenant.id,
          hotelId: systemAdminHotel.id
        }
      })
    }

    res.status(201).json({
      message: 'İşletme başarıyla oluşturuldu',
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        domain: tenant.domain,
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
      },
      superAdmin: {
        id: superAdminUser.id,
        email: superAdminUser.email,
        name: `${superAdminUser.firstName} ${superAdminUser.lastName}`
      }
    })
    return
  } catch (error) {
    console.error('Tenant creation error:', error)
    console.error('Error details:', error instanceof Error ? error.message : String(error))
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    res.status(500).json({ 
      message: 'Veritabanı hatası',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    })
    return
  }
})

app.get('/api/admin/tenants', adminAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const tenants = await prisma.tenant.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        domain: true,
        isActive: true,
        settings: true,
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

// ÖNEMLİ: Daha spesifik route'lar önce tanımlanmalı
// Tenant'ın admin kullanıcısını getir (PUT /api/admin/tenants/:id'den önce olmalı)
app.get('/api/admin/tenants/:id/admin-user', adminAuthMiddleware, async (req: Request, res: Response) => {
  try {
    console.log('🔍 GET /api/admin/tenants/:id/admin-user endpoint called', { id: req.params.id })
    const { id } = req.params

    if (!id) {
      console.log('❌ Tenant ID missing')
      res.status(400).json({ message: 'Tenant ID gerekli' })
      return
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id }
    })

    if (!tenant) {
      res.status(404).json({ message: 'Tenant bulunamadı' })
      return
    }

    // Tenant'ın admin kullanıcısını bul
    const adminUser = await prisma.user.findFirst({
      where: {
        tenantId: id,
        role: 'ADMIN'
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLogin: true
      }
    })

    if (!adminUser) {
      res.status(404).json({ message: 'Admin kullanıcı bulunamadı' })
      return
    }

    res.json({
      adminUser
    })
    return
  } catch (error) {
    console.error('Get admin user error:', error)
    res.status(500).json({ message: 'Veritabanı hatası' })
    return
  }
})

// Tenant'ın admin kullanıcı şifresini güncelle
app.put('/api/admin/tenants/:id/admin-user/password', adminAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { password, passwordConfirm } = req.body

    if (!id) {
      res.status(400).json({ message: 'Tenant ID gerekli' })
      return
    }

    if (!password || !passwordConfirm) {
      res.status(400).json({ message: 'Şifre ve şifre tekrarı gerekli' })
      return
    }

    if (password !== passwordConfirm) {
      res.status(400).json({ message: 'Şifreler eşleşmiyor' })
      return
    }

    if (password.length < 6) {
      res.status(400).json({ message: 'Şifre en az 6 karakter olmalıdır' })
      return
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id }
    })

    if (!tenant) {
      res.status(404).json({ message: 'Tenant bulunamadı' })
      return
    }

    // Tenant'ın admin kullanıcısını bul
    const adminUser = await prisma.user.findFirst({
      where: {
        tenantId: id,
        role: 'ADMIN'
      }
    })

    if (!adminUser) {
      res.status(404).json({ message: 'Admin kullanıcı bulunamadı' })
      return
    }

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 10)

    // Admin kullanıcı şifresini güncelle
    const updatedUser = await prisma.user.update({
      where: { id: adminUser.id },
      data: {
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true
      }
    })

    res.json({
      message: 'Admin kullanıcı şifresi başarıyla güncellendi',
      adminUser: updatedUser
    })
    return
  } catch (error) {
    console.error('Update admin user password error:', error)
    res.status(500).json({ message: 'Veritabanı hatası' })
    return
  }
})

// Tenant güncelleme endpoint'i
app.put('/api/admin/tenants/:id', adminAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { 
      name, 
      slug, 
      domain, 
      isActive,
      // Sahip Bilgileri
      ownerName,
      ownerEmail,
      ownerPhone,
      // Adres Bilgileri
      address,
      city,
      district,
      postalCode,
      // Plan ve Durum
      planId,
      status
    } = req.body

    if (!id) {
      res.status(400).json({ message: 'Tenant ID gerekli' })
      return
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id }
    })

    if (!tenant) {
      res.status(404).json({ message: 'Tenant bulunamadı' })
      return
    }

    // Slug kontrolü (eğer değiştiriliyorsa)
    if (slug && slug !== tenant.slug) {
      const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
      const existingTenant = await prisma.tenant.findUnique({
        where: { slug: cleanSlug }
      })
      if (existingTenant) {
        res.status(400).json({ message: 'Bu slug zaten kullanılıyor' })
        return
      }
    }

    // Domain kontrolü (eğer değiştiriliyorsa)
    if (domain !== undefined && domain !== tenant.domain) {
      if (domain) {
        const existingDomain = await prisma.tenant.findUnique({
          where: { domain }
        })
        if (existingDomain) {
          res.status(400).json({ message: 'Bu domain zaten kullanılıyor' })
          return
        }
      }
    }

    // Mevcut settings'i al
    const currentSettings = (tenant.settings as any) || {}
    
    // Settings'i güncelle
    const updatedSettings = {
      ...currentSettings,
      ...(ownerName || ownerEmail || ownerPhone ? {
        owner: {
          ...(currentSettings.owner || {}),
          ...(ownerName && { name: ownerName }),
          ...(ownerEmail && { email: ownerEmail }),
          ...(ownerPhone && { phone: ownerPhone })
        }
      } : {}),
      ...(address || city || district || postalCode !== undefined ? {
        address: {
          ...(currentSettings.address || {}),
          ...(address && { address }),
          ...(city && { city }),
          ...(district && { district }),
          ...(postalCode !== undefined && { postalCode: postalCode || null })
        }
      } : {}),
      ...(planId !== undefined && { planId: planId || null }),
      ...(status !== undefined && { status: status || 'pending' })
    }

    const updatedTenant = await prisma.tenant.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') }),
        ...(domain !== undefined && { domain: domain || null }),
        ...(isActive !== undefined && { isActive }),
        ...(Object.keys(updatedSettings).length > 0 && { settings: updatedSettings })
      }
    })

    res.json({
      message: 'İşletme başarıyla güncellendi',
      tenant: updatedTenant
    })
    return
  } catch (error) {
    console.error('Tenant update error:', error)
    res.status(500).json({ message: 'Veritabanı hatası' })
    return
  }
})

// Tenant silme endpoint'i
app.delete('/api/admin/tenants/:id', adminAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    if (!id) {
      res.status(400).json({ message: 'Tenant ID gerekli' })
      return
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id }
    })

    if (!tenant) {
      res.status(404).json({ message: 'Tenant bulunamadı' })
      return
    }

    // Tenant'ı sil (cascade ile ilişkili veriler de silinecek)
    await prisma.tenant.delete({
      where: { id }
    })

    res.json({
      message: 'İşletme başarıyla silindi'
    })
    return
  } catch (error) {
    console.error('Tenant delete error:', error)
    res.status(500).json({ message: 'Veritabanı hatası' })
    return
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

// Hotel Info endpoints - Otel bilgilerini yönet
app.get('/api/hotel/info', tenantMiddleware, async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req)
    
    // Get hotel from tenant
    const hotel = await prisma.hotel.findFirst({
      where: { tenantId }
    })
    
    if (!hotel) {
      res.status(404).json({ message: 'Hotel not found' }); return;
    }
    
    // Get hotel info from settings or return defaults
    const settings = hotel.settings as any || {}
    const hotelInfo = {
      wifi: settings.wifi || {
        networkName: 'HotelLuxury_Guest',
        password: 'Luxury2024!',
        speed: '100 Mbps',
        supportPhone: '+90 212 555 0199'
      },
      hours: settings.hours || {
        reception: '24 Saat',
        restaurant: '06:00 - 23:00',
        bar: '18:00 - 02:00',
        spa: '08:00 - 22:00'
      },
      dining: settings.dining || {
        breakfast: '06:00-10:00',
        lunch: '12:00-15:00',
        dinner: '18:00-22:00',
        roomService: '24 saat',
        towelChange: 'günlük',
        techSupport: '24 saat'
      },
      amenities: settings.amenities || [
        'Ücretsiz WiFi',
        'Otopark',
        'Fitness Center',
        'Yüzme Havuzu',
        'Spa & Wellness',
        'Çocuk Oyun Alanı'
      ],
      contacts: settings.contacts || {
        reception: '+90 212 555 0100',
        security: '+90 212 555 0101',
        concierge: '+90 212 555 0102'
      }
    }
    
    res.json(hotelInfo); return;
  } catch (error) {
    console.error('Get hotel info error:', error);
    res.status(500).json({ message: 'Database error' }); return;
  }
})

app.put('/api/hotel/info', tenantMiddleware, authMiddleware, async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req)
    const { wifi, hours, dining, amenities, contacts } = req.body
    
    // Get hotel from tenant
    const hotel = await prisma.hotel.findFirst({
      where: { tenantId }
    })
    
    if (!hotel) {
      res.status(404).json({ message: 'Hotel not found' }); return;
    }
    
    // Update hotel settings
    const currentSettings = (hotel.settings as any) || {}
    const updatedSettings = {
      ...currentSettings,
      wifi: wifi || currentSettings.wifi,
      hours: hours || currentSettings.hours,
      dining: dining || currentSettings.dining,
      amenities: amenities || currentSettings.amenities,
      contacts: contacts || currentSettings.contacts
    }
    
    await prisma.hotel.update({
      where: { id: hotel.id },
      data: {
        settings: updatedSettings
      }
    })
    
    res.json({ message: 'Hotel info updated successfully', hotelInfo: updatedSettings }); return;
  } catch (error) {
    console.error('Update hotel info error:', error);
    res.status(500).json({ message: 'Database error' }); return;
  }
})

// Tüm mevcut özellikleri listele
// Database Restore Endpoints
const uploadsDir = path.join(process.cwd(), 'uploads', 'backups')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Backup dosyası yükleme endpoint'i
app.post('/api/admin/database/upload-backup', adminAuthMiddleware, async (req: Request, res: Response) => {
  try {
    // Basit multipart/form-data desteği - dosyayı base64 olarak gönder
    const { backup, filename } = req.body

    if (!backup) {
      res.status(400).json({ message: 'Backup dosyası gerekli' })
      return
    }

    // Base64'ten buffer'a çevir
    const fileBuffer = Buffer.from(backup, 'base64')
    const fileId = uuidv4()
    const filePath = path.join(uploadsDir, `${fileId}.backup`)

    // Dosyayı kaydet
    fs.writeFileSync(filePath, fileBuffer)

    console.log(`✅ Backup dosyası yüklendi: ${filePath} (${fileBuffer.length} bytes)`)

    res.json({
      success: true,
      fileId,
      filename: filename || 'backup.backup',
      size: fileBuffer.length,
      message: 'Backup dosyası başarıyla yüklendi'
    })
    return
  } catch (error) {
    console.error('Backup upload error:', error)
    res.status(500).json({ 
      message: 'Backup dosyası yüklenirken hata oluştu',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    })
    return
  }
})

// Database restore endpoint'i
app.post('/api/admin/database/restore', adminAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { fileId } = req.body

    if (!fileId) {
      res.status(400).json({ message: 'File ID gerekli' })
      return
    }

    const filePath = path.join(uploadsDir, `${fileId}.backup`)

    if (!fs.existsSync(filePath)) {
      res.status(404).json({ message: 'Backup dosyası bulunamadı' })
      return
    }

    // Render.com'da pg_restore komutunu çalıştırmak zor olabilir
    // Bu yüzden kullanıcıya restore talimatlarını göster
    const fileStats = fs.statSync(filePath)
    
    console.log(`🔄 Database restore isteği: ${filePath} (${fileStats.size} bytes)`)

    // Not: Render.com'da pg_restore komutunu çalıştırmak için
    // ya lokal bir script kullanılmalı ya da backup SQL formatına çevrilmeli
    // Şimdilik kullanıcıya talimatları göster
    
    res.json({
      success: true,
      message: 'Backup dosyası hazır. Restore işlemi için manuel komut gerekli.',
      instructions: {
        method1: 'Lokal PostgreSQL ile restore edin',
        method2: 'Backup dosyasını SQL formatına çevirin',
        filePath: filePath,
        fileSize: fileStats.size
      }
    })
    return
  } catch (error) {
    console.error('Database restore error:', error)
    res.status(500).json({ 
      message: 'Database restore işlemi sırasında hata oluştu',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    })
    return
  }
})

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

// Demo tenant oluşturma fonksiyonu (seed yerine)
async function createDemoTenant() {
  try {
    // Demo tenant'ı kontrol et
    let tenant = await prisma.tenant.findUnique({
      where: { slug: 'demo' }
    })

    if (!tenant) {
      console.log('🌱 Demo tenant oluşturuluyor...')

      // Demo tenant oluştur
      tenant = await prisma.tenant.create({
        data: {
          name: 'Demo İşletme',
          slug: 'demo',
          domain: 'demo.roomxr.com',
          isActive: true,
          settings: {
            theme: {
              primaryColor: '#D4AF37',
              secondaryColor: '#f3f4f6'
            },
            currency: 'TRY',
            language: 'tr'
          }
        }
      })

      console.log('✅ Demo tenant oluşturuldu:', tenant.name)
    } else {
      console.log('✅ Demo tenant zaten mevcut')
    }

    // Demo hotel oluştur
    let hotel = await prisma.hotel.findFirst({
      where: { tenantId: tenant.id }
    })

    if (!hotel) {
      hotel = await prisma.hotel.create({
        data: {
          name: 'Demo Otel',
          address: 'Demo Adres, İstanbul',
          phone: '+90 212 555 0123',
          email: 'info@demo-otel.com',
          website: 'https://demo-otel.com',
          isActive: true,
          tenantId: tenant.id
        }
      })

      console.log('✅ Demo hotel oluşturuldu:', hotel.name)
    }

    // Test kullanıcılarını oluştur
    const testUsers = [
      {
        email: 'admin@hotel.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN' as const
      },
      {
        email: 'manager@hotel.com',
        password: 'manager123',
        firstName: 'Manager',
        lastName: 'User',
        role: 'MANAGER' as const
      },
      {
        email: 'reception@hotel.com',
        password: 'reception123',
        firstName: 'Reception',
        lastName: 'User',
        role: 'RECEPTION' as const
      }
    ]

    for (const userData of testUsers) {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      })

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 10)
        await prisma.user.create({
          data: {
            email: userData.email,
            password: hashedPassword,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
            tenantId: tenant.id,
            hotelId: hotel!.id
          }
        })
        console.log(`✅ Test kullanıcı oluşturuldu: ${userData.email}`)
      } else {
        // Mevcut kullanıcının şifresini güncelle
        const hashedPassword = await bcrypt.hash(userData.password, 10)
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            password: hashedPassword,
            tenantId: tenant.id,
            hotelId: hotel!.id
          }
        })
        console.log(`✅ Test kullanıcı güncellendi: ${userData.email}`)
      }
    }

    return tenant
  } catch (error) {
    console.error('❌ Demo tenant oluşturma hatası:', error)
    // Hata olsa bile devam et
    return null
  }
}

// Migration kontrolü ve çalıştırma
async function runMigrations() {
  try {
    console.log('🔄 Database migrations kontrol ediliyor...')
    // Prisma migration'larını programatik olarak çalıştır
    const { execSync } = require('child_process')
    try {
      execSync('npx prisma migrate deploy', { 
        stdio: 'inherit',
        cwd: process.cwd()
      })
      console.log('✅ Migrations basariyla calistirildi')
    } catch (migrateError) {
      console.error('⚠️ Migration calistirma hatasi (devam ediliyor):', migrateError)
      // Migration hatası olsa bile devam et - belki zaten çalıştırılmış
    }
  } catch (error) {
    console.error('❌ Migration fonksiyonu hatasi:', error)
    // Migration hatası olsa bile devam et
  }
}

// Start server
server.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL}`)
  console.log(`🗄️ Database: ${process.env.DATABASE_URL?.split('@')[1]}`)
  
  // Migration'ları çalıştır (eğer çalıştırılmamışsa)
  try {
    await runMigrations()
  } catch (error) {
    console.error('❌ Migration çalıştırma hatası:', error)
  }
  
  // Super admin oluştur
  try {
    await createSuperAdmin()
    console.log('✅ Super admin hazır')
  } catch (error) {
    console.error('❌ Super admin oluşturma hatası:', error)
  }

  // Demo tenant ve test kullanıcıları oluştur (devre dışı - kullanıcılar kendi verilerini kullanacak)
  // try {
  //   await createDemoTenant()
  //   console.log('✅ Demo tenant ve test kullanıcıları hazır')
  // } catch (error) {
  //   console.error('❌ Demo tenant oluşturma hatası:', error)
  // }
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully')
  await prisma.$disconnect()
  server.close(() => {
    console.log('Process terminated')
  })
})
