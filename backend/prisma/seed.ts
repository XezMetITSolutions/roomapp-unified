import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Demo tenant oluştur
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      name: 'Demo İşletme',
      slug: 'demo',
      domain: 'demo.roomxqr.com',
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
  });

  console.log('✅ Tenant created:', tenant.name);

  // Demo hotel oluştur
  const hotel = await prisma.hotel.upsert({
    where: { id: 'demo-hotel' },
    update: {},
    create: {
      id: 'demo-hotel',
      name: 'Demo Otel',
      address: 'Demo Adres, İstanbul',
      phone: '+90 212 555 0123',
      email: 'info@demo-otel.com',
      website: 'https://demo-otel.com',
      isActive: true,
      tenantId: tenant.id
    }
  });

  console.log('✅ Hotel created:', hotel.name);

  // Demo kullanıcıları oluştur
  const users = [
    {
      id: 'admin-user',
      email: 'admin@hotel.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN' as const,
      permissions: ['dashboard', 'analytics', 'menu', 'users', 'announcements', 'qr-kod', 'notifications', 'settings', 'support']
    },
    {
      id: 'manager-user',
      email: 'manager@hotel.com',
      password: 'manager123',
      firstName: 'Manager',
      lastName: 'User',
      role: 'MANAGER' as const,
      permissions: ['dashboard', 'menu', 'announcements', 'qr-kod', 'notifications']
    },
    {
      id: 'reception-user',
      email: 'reception@hotel.com',
      password: 'reception123',
      firstName: 'Reception',
      lastName: 'User',
      role: 'RECEPTION' as const,
      permissions: ['dashboard', 'qr-kod', 'notifications']
    }
  ];

  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const user = await prisma.user.upsert({
      where: { id: userData.id },
      update: {},
      create: {
        id: userData.id,
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        isActive: true,
        tenantId: tenant.id,
        hotelId: hotel.id
      }
    });

    // Permissions'ları ayrı olarak oluştur
    await prisma.userPermission.createMany({
      data: userData.permissions.map(pageName => ({
        userId: user.id,
        pageName
      })),
      skipDuplicates: true
    });

    console.log(`✅ User created: ${user.email}`);
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
