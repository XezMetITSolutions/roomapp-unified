import { Room, Guest, MenuItem, Staff, Package, Business, HotelInfo } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { generateRoomQRCode } from './qrGenerator';

export const packages: Package[] = [
  {
    id: 'premium',
    name: 'Premium Paket',
    type: 'premium',
    price: 299,
    features: [
      '50 odaya kadar',
      'QR menü sistemi',
      'Çoklu dil desteği',
      'Temel analitikler',
      'E-posta desteği',
      'Mutfak paneli',
      'Resepsiyon paneli'
    ],
    maxRooms: 50,
    maxStaff: 20,
    includes: {
      qrMenu: true,
      analytics: true,
      multiLanguage: true,
      customBranding: false,
      apiAccess: false,
      prioritySupport: false,
      customIntegrations: false
    }
  },
  {
    id: 'kurumsal',
    name: 'Kurumsal Paket',
    type: 'kurumsal',
    price: 599,
    features: [
      'Sınırsız oda',
      'Gelişmiş QR menü sistemi',
      'Tüm dil desteği',
      'Gelişmiş analitikler',
      'Özel markalama',
      'API erişimi',
      'Öncelikli destek',
      'Özel entegrasyonlar',
      '7/24 telefon desteği'
    ],
    maxRooms: -1, // Sınırsız
    maxStaff: -1, // Sınırsız
    includes: {
      qrMenu: true,
      analytics: true,
      multiLanguage: true,
      customBranding: true,
      apiAccess: true,
      prioritySupport: true,
      customIntegrations: true
    }
  }
];

export const sampleBusiness: Business = {
  id: 'business-1',
  name: 'Grand Hotel',
  type: 'hotel',
  package: packages[0], // Premium paket
  rooms: [],
  staff: [],
  settings: {
    currency: 'TRY',
    timezone: 'Europe/Istanbul',
    language: 'tr',
    branding: {
      primaryColor: '#1e3a8a',
      secondaryColor: '#d4af37'
    }
  },
  subscription: {
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    status: 'active',
    autoRenew: true
  }
};

export const sampleRooms: Room[] = [
  {
    id: 'room-101',
    number: '101',
    floor: 1,
    type: 'standard',
    status: 'occupied',
    guestName: 'John Smith',
    checkIn: new Date('2024-09-10'),
    checkOut: new Date('2024-09-15'),
    qrCode: ''
  },
  {
    id: 'room-102',
    number: '102',
    floor: 1,
    type: 'standard',
    status: 'occupied',
    guestName: 'Maria Garcia',
    checkIn: new Date('2024-09-11'),
    checkOut: new Date('2024-09-14'),
    qrCode: ''
  },
  {
    id: 'room-201',
    number: '201',
    floor: 2,
    type: 'deluxe',
    status: 'occupied',
    guestName: 'Hans Mueller',
    checkIn: new Date('2024-09-09'),
    checkOut: new Date('2024-09-16'),
    qrCode: ''
  },
  {
    id: 'room-301',
    number: '301',
    floor: 3,
    type: 'suite',
    status: 'occupied',
    guestName: 'Sophie Dubois',
    checkIn: new Date('2024-09-12'),
    checkOut: new Date('2024-09-18'),
    qrCode: ''
  },
  {
    id: 'room-302',
    number: '302',
    floor: 3,
    type: 'suite',
    status: 'vacant',
    qrCode: ''
  }
];

// Generate QR codes for rooms
sampleRooms.forEach(room => {
  room.qrCode = generateRoomQRCode(room);
});

export const sampleGuests: Guest[] = [
  {
    id: 'guest-1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0123',
    roomId: 'room-101',
    language: 'en',
    checkIn: new Date('2024-09-10'),
    checkOut: new Date('2024-09-15')
  },
  {
    id: 'guest-2',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    phone: '+34-666-123456',
    roomId: 'room-102',
    language: 'es',
    checkIn: new Date('2024-09-11'),
    checkOut: new Date('2024-09-14')
  },
  {
    id: 'guest-3',
    name: 'Hans Mueller',
    email: 'hans.mueller@email.com',
    phone: '+49-30-12345678',
    roomId: 'room-201',
    language: 'de',
    checkIn: new Date('2024-09-09'),
    checkOut: new Date('2024-09-16')
  },
  {
    id: 'guest-4',
    name: 'Sophie Dubois',
    email: 'sophie.dubois@email.com',
    phone: '+33-1-23456789',
    roomId: 'room-301',
    language: 'fr',
    checkIn: new Date('2024-09-12'),
    checkOut: new Date('2024-09-18')
  }
];

export const sampleMenu: MenuItem[] = [
  // En Çok Beğenilen
  {
    id: 'menu-popular-1',
    name: 'Pain Au Chocolat',
    description: 'Taze fırından çıkmış çikolatalı kruvasan',
    price: 225.00,
    category: 'popular',
    available: true,
    preparationTime: 5,
    allergens: ['wheat', 'milk', 'eggs', 'nuts'],
    isPopular: true,
    likes: 3,
    dietaryInfo: ['wheat', 'milk', 'eggs', 'nuts'],
    badges: ['⭐']
  },
  {
    id: 'menu-popular-2',
    name: 'Avokadolu Poşe Yumurta',
    description: 'Beyaz Fırın yapımı kızarmış ekşi mayalı ekmek üzerine, avokado püresi ve poşe yumurta',
    price: 570.00,
    category: 'popular',
    available: true,
    preparationTime: 15,
    allergens: ['eggs', 'milk', 'wheat'],
    isPopular: true,
    likes: 2,
    dietaryInfo: ['eggs', 'milk', 'wheat'],
    badges: ['⭐']
  },
  {
    id: 'menu-popular-3',
    name: 'Avokadolu Poşe Yumurtalı Açık Croissant Tost',
    description: 'Beyaz Fırın yapımı croissant, avokado püresi, poşe yumurta, rakula, zeytinyağlı limon sosu, parmesan peyniri',
    price: 445.00,
    category: 'popular',
    available: true,
    preparationTime: 12,
    allergens: ['wheat', 'eggs', 'milk'],
    isPopular: true,
    likes: 1,
    isNew: true,
    dietaryInfo: ['wheat', 'eggs', 'milk'],
    badges: ['YENİ', '⭐']
  },

  // Kahvaltılar
  {
    id: 'menu-breakfast-1',
    name: 'Çılbır - Simit İle',
    description: 'Çırpılmış yoğurt, poşe yumurta, kırmızı toz biberli tereyağ, simit parçaları',
    price: 285.00,
    category: 'breakfast',
    available: true,
    preparationTime: 15,
    allergens: ['eggs', 'milk', 'wheat'],
    isNew: true,
    dietaryInfo: ['eggs', 'milk', 'wheat'],
    badges: ['YENİ', '⭐']
  },
  {
    id: 'menu-breakfast-2',
    name: 'Kaşar Peynirli',
    description: '* yumurta, CAGE FREE',
    price: 415.00,
    category: 'breakfast',
    available: true,
    preparationTime: 10,
    allergens: ['milk', 'eggs'],
    dietaryInfo: ['milk', 'eggs'],
    badges: ['⭐']
  },
  {
    id: 'menu-breakfast-3',
    name: 'Bal',
    description: 'Doğal çiçek balı',
    price: 45.00,
    category: 'breakfast',
    available: true,
    preparationTime: 2,
    allergens: []
  },
  {
    id: 'menu-breakfast-4',
    name: 'Serpme Kahvaltı',
    description: 'Taze peynirler, zeytin, domates, salatalık, yumurta, reçel ve bal',
    price: 145.00,
    category: 'breakfast',
    available: true,
    preparationTime: 15,
    allergens: ['dairy', 'eggs', 'gluten'],
    dietaryInfo: ['milk', 'eggs', 'wheat']
  },
  {
    id: 'menu-breakfast-5',
    name: 'Omlet',
    description: '3 yumurta ile hazırlanmış, tereyağında pişirilmiş omlet',
    price: 125.00,
    category: 'breakfast',
    available: true,
    preparationTime: 8,
    allergens: ['eggs', 'dairy'],
    dietaryInfo: ['eggs', 'milk']
  },

  // Fit Kahvaltı
  {
    id: 'menu-fit-1',
    name: 'Fit Kahvaltı Kasesi',
    description: 'Yunan yoğurdu, granola, taze meyveler, chia tohumu ve bal',
    price: 185.00,
    category: 'fit',
    available: true,
    preparationTime: 10,
    allergens: ['dairy', 'nuts'],
    dietaryInfo: ['milk', 'nuts']
  },
  {
    id: 'menu-fit-2',
    name: 'Avokado Toast',
    description: 'Tam buğday ekmeği, avokado püresi, cherry domates ve tuz',
    price: 165.00,
    category: 'fit',
    available: true,
    preparationTime: 8,
    allergens: ['gluten'],
    dietaryInfo: ['wheat']
  },

  // Mezeler
  {
    id: 'menu-4',
    name: 'Sezar Salata',
    description: 'Taze marul, parmesan peyniri, kruton ve sezar sosu',
    price: 28.00,
    category: 'appetizer',
    available: true,
    preparationTime: 10,
    allergens: ['dairy', 'gluten']
  },
  {
    id: 'menu-5',
    name: 'Bruschetta Üçlüsü',
    description: 'Üç çeşit: domates fesleğen, mantar ve zeytin tapenade',
    price: 24.00,
    category: 'appetizer',
    available: true,
    preparationTime: 15,
    allergens: ['gluten']
  },
  {
    id: 'menu-6',
    name: 'Karides Kokteyl',
    description: 'Taze karides, kokteyl sosu ve limon ile',
    price: 36.00,
    category: 'appetizer',
    available: true,
    preparationTime: 5,
    allergens: ['shellfish']
  },

  // Ana Yemekler
  {
    id: 'menu-7',
    name: 'Izgara Somon',
    description: 'Atlantik somonu, limon otu tereyağı ve sebze garnitürü ile',
    price: 57.00,
    category: 'main',
    available: true,
    preparationTime: 25,
    allergens: ['fish']
  },
  {
    id: 'menu-8',
    name: 'Dana Bonfile',
    description: 'Prime dana bonfile, kırmızı şarap sosu ve patates püresi',
    price: 70.00,
    category: 'main',
    available: true,
    preparationTime: 30,
    allergens: ['dairy']
  },
  {
    id: 'menu-9',
    name: 'Tavuk Parmigiana',
    description: 'Paneli tavuk göğsü, marinara sosu ve mozzarella peyniri',
    price: 48.00,
    category: 'main',
    available: true,
    preparationTime: 25,
    allergens: ['gluten', 'dairy']
  },
  {
    id: 'menu-10',
    name: 'Vejetaryen Makarna',
    description: 'Penne makarna, mevsimlik sebzeler, zeytinyağı ve otlar',
    price: 39.00,
    category: 'main',
    available: true,
    preparationTime: 20,
    allergens: ['gluten']
  },

  // Tatlılar
  {
    id: 'menu-11',
    name: 'Çikolata Lav Kek',
    description: 'Sıcak çikolata keki, erimiş merkez ve vanilyalı dondurma',
    price: 19.00,
    category: 'dessert',
    available: true,
    preparationTime: 15,
    allergens: ['dairy', 'eggs', 'gluten']
  },
  {
    id: 'menu-12',
    name: 'Tiramisu',
    description: 'Klasik İtalyan tatlısı, kahve ile ıslatılmış ladyfinger ve mascarpone',
    price: 17.00,
    category: 'dessert',
    available: true,
    preparationTime: 5,
    allergens: ['dairy', 'eggs', 'gluten']
  },
  {
    id: 'menu-13',
    name: 'Taze Meyve Tartı',
    description: 'Krema ile doldurulmuş hamur kabuğu ve mevsimlik meyveler',
    price: 15.00,
    category: 'dessert',
    available: true,
    preparationTime: 10,
    allergens: ['dairy', 'eggs', 'gluten']
  },

  // İçecekler
  {
    id: 'menu-14',
    name: 'Taze Sıkılmış Portakal Suyu',
    description: 'Saf portakal suyu, katkı maddesi yok',
    price: 9.00,
    category: 'beverage',
    available: true,
    preparationTime: 2
  },
  {
    id: 'menu-15',
    name: 'Premium Kahve',
    description: 'Arabica kahve çekirdekleri, taze demlenmiş',
    price: 7.00,
    category: 'beverage',
    available: true,
    preparationTime: 3
  },
  {
    id: 'menu-16',
    name: 'Ev Şarabı',
    description: 'Seçimimizden kırmızı veya beyaz şarap',
    price: 16.00,
    category: 'beverage',
    available: true,
    preparationTime: 2
  },
  {
    id: 'menu-17',
    name: 'Maden Suyu',
    description: 'Premium maden suyu',
    price: 6.00,
    category: 'beverage',
    available: true,
    preparationTime: 1
  },
  {
    id: 'menu-18',
    name: 'Yerel Bira',
    description: 'Yerel bira seçimi',
    price: 13.00,
    category: 'beverage',
    available: true,
    preparationTime: 2
  }
];

export const sampleStaff: Staff[] = [
  {
    id: 'staff-1',
    name: 'Mehmet Özkan',
    role: 'reception',
    email: 'mehmet.ozkan@grandhotel.com',
    phone: '+90 532 111 1111',
    shift: 'morning',
    active: true
  },
  {
    id: 'staff-2',
    name: 'Ayşe Demir',
    role: 'kitchen',
    email: 'ayse.demir@grandhotel.com',
    phone: '+90 532 222 2222',
    shift: 'afternoon',
    active: true
  },
  {
    id: 'staff-3',
    name: 'Fatma Kaya',
    role: 'housekeeping',
    email: 'fatma.kaya@grandhotel.com',
    phone: '+90 532 333 3333',
    shift: 'morning',
    active: true
  },
  {
    id: 'staff-4',
    name: 'Ahmet Yılmaz',
    role: 'concierge',
    email: 'ahmet.yilmaz@grandhotel.com',
    phone: '+90 532 444 4444',
    shift: 'afternoon',
    active: true
  },
  {
    id: 'staff-5',
    name: 'Zeynep Aktaş',
    role: 'manager',
    email: 'zeynep.aktas@grandhotel.com',
    phone: '+90 532 555 5555',
    shift: 'morning',
    active: true
  }
];

export const sampleOrders: any[] = [
  {
    id: 'order-1',
    roomId: 'room-101',
    guestId: 'guest-1',
    items: [
      { menuItemId: 'menu-1', quantity: 1, price: 45.00 },
      { menuItemId: 'menu-15', quantity: 2, price: 7.00 }
    ],
    totalAmount: 59.00,
    status: 'preparing',
    createdAt: new Date('2024-01-15T10:30:00'),
    paymentStatus: 'paid',
    paymentMethod: 'room_charge',
    specialInstructions: 'Kahve şekersiz olsun'
  },
  {
    id: 'order-2',
    roomId: 'room-201',
    guestId: 'guest-2',
    items: [
      { menuItemId: 'menu-7', quantity: 1, price: 57.00 },
      { menuItemId: 'menu-16', quantity: 1, price: 16.00 }
    ],
    totalAmount: 73.00,
    status: 'ready',
    createdAt: new Date('2024-01-15T12:15:00'),
    deliveryTime: new Date('2024-01-15T12:45:00'),
    paymentStatus: 'pending',
    paymentMethod: 'cash'
  },
  {
    id: 'order-3',
    roomId: 'room-301',
    guestId: 'guest-3',
    items: [
      { menuItemId: 'menu-4', quantity: 1, price: 28.00 },
      { menuItemId: 'menu-8', quantity: 1, price: 70.00 },
      { menuItemId: 'menu-12', quantity: 1, price: 17.00 }
    ],
    totalAmount: 115.00,
    status: 'pending',
    createdAt: new Date('2024-01-15T14:20:00'),
    paymentStatus: 'pending',
    paymentMethod: 'card'
  },
  {
    id: 'order-4',
    roomId: 'room-102',
    guestId: 'guest-4',
    items: [
      { menuItemId: 'menu-2', quantity: 2, price: 25.00 },
      { menuItemId: 'menu-14', quantity: 2, price: 9.00 }
    ],
    totalAmount: 68.00,
    status: 'delivered',
    createdAt: new Date('2024-01-15T08:45:00'),
    deliveryTime: new Date('2024-01-15T09:15:00'),
    paymentStatus: 'paid',
    paymentMethod: 'room_charge'
  }
];

export const sampleRequests: any[] = [
  {
    id: 'req-1',
    roomId: 'room-101',
    guestId: 'guest-1',
    type: 'housekeeping',
    category: 'temizlik',
    description: 'Oda temizliği talep ediyorum, ekstra havlu da getirebilir misiniz?',
    priority: 'medium',
    status: 'pending',
    createdAt: new Date('2024-01-15T10:30:00'),
    assignedTo: 'staff-3'
  },
  {
    id: 'req-2',
    roomId: 'room-201',
    guestId: 'guest-2',
    type: 'maintenance',
    category: 'bakım',
    description: 'Klima çalışmıyor, acil müdahale gerekiyor.',
    priority: 'urgent',
    status: 'in_progress',
    createdAt: new Date('2024-01-15T14:15:00'),
    assignedTo: 'staff-4',
    notes: 'Teknik ekibimiz yolda, 15 dakika içinde ulaşacak.'
  },
  {
    id: 'req-3',
    roomId: 'room-301',
    guestId: 'guest-3',
    type: 'concierge',
    category: 'konsiyerj',
    description: 'Havaalanına transfer rezervasyonu yapmak istiyorum.',
    priority: 'low',
    status: 'completed',
    createdAt: new Date('2024-01-15T09:00:00'),
    assignedTo: 'staff-4',
    completedAt: new Date('2024-01-15T09:30:00'),
    notes: 'Transfer rezervasyonu yapıldı, detaylar e-posta ile gönderildi.'
  },
  {
    id: 'req-4',
    roomId: 'room-102',
    guestId: 'guest-4',
    type: 'housekeeping',
    category: 'temizlik',
    description: 'Ekstra yastık ve battaniye istiyorum.',
    priority: 'low',
    status: 'pending',
    createdAt: new Date('2024-01-15T16:45:00'),
    assignedTo: 'staff-3'
  },
  {
    id: 'req-5',
    roomId: 'room-202',
    guestId: 'guest-5',
    type: 'maintenance',
    category: 'bakım',
    description: 'Banyo musluğu sızıntı yapıyor.',
    priority: 'high',
    status: 'in_progress',
    createdAt: new Date('2024-01-15T11:20:00'),
    assignedTo: 'staff-4',
    notes: 'Su vanası kapatıldı, tamirci çağrıldı.'
  },
  // Hızlı isteklerden örnekler
  {
    id: 'req-6',
    roomId: 'room-103',
    guestId: 'guest-6',
    type: 'housekeeping',
    category: 'temizlik',
    description: 'Havlu',
    priority: 'low',
    status: 'pending',
    createdAt: new Date('2024-01-15T17:30:00'),
    assignedTo: 'staff-3'
  },
  {
    id: 'req-7',
    roomId: 'room-104',
    guestId: 'guest-7',
    type: 'housekeeping',
    category: 'temizlik',
    description: 'Terlik',
    priority: 'low',
    status: 'pending',
    createdAt: new Date('2024-01-15T17:35:00'),
    assignedTo: 'staff-3'
  },
  {
    id: 'req-8',
    roomId: 'room-105',
    guestId: 'guest-8',
    type: 'housekeeping',
    category: 'temizlik',
    description: 'Diş Macunu',
    priority: 'low',
    status: 'pending',
    createdAt: new Date('2024-01-15T17:40:00'),
    assignedTo: 'staff-3'
  },
  {
    id: 'req-9',
    roomId: 'room-106',
    guestId: 'guest-9',
    type: 'housekeeping',
    category: 'temizlik',
    description: 'Yastık',
    priority: 'low',
    status: 'pending',
    createdAt: new Date('2024-01-15T17:45:00'),
    assignedTo: 'staff-3'
  },
  {
    id: 'req-10',
    roomId: 'room-107',
    guestId: 'guest-10',
    type: 'housekeeping',
    category: 'temizlik',
    description: 'Battaniye',
    priority: 'low',
    status: 'pending',
    createdAt: new Date('2024-01-15T17:50:00'),
    assignedTo: 'staff-3'
  },
  {
    id: 'req-11',
    roomId: 'room-108',
    guestId: 'guest-11',
    type: 'housekeeping',
    category: 'temizlik',
    description: 'Şampuan',
    priority: 'low',
    status: 'pending',
    createdAt: new Date('2024-01-15T17:55:00'),
    assignedTo: 'staff-3'
  },
  {
    id: 'req-12',
    roomId: 'room-109',
    guestId: 'guest-12',
    type: 'housekeeping',
    category: 'temizlik',
    description: 'Sabun',
    priority: 'low',
    status: 'pending',
    createdAt: new Date('2024-01-15T18:00:00'),
    assignedTo: 'staff-3'
  },
  {
    id: 'req-13',
    roomId: 'room-110',
    guestId: 'guest-13',
    type: 'housekeeping',
    category: 'temizlik',
    description: 'Su',
    priority: 'low',
    status: 'pending',
    createdAt: new Date('2024-01-15T18:05:00'),
    assignedTo: 'staff-3'
  }
];

export const sampleHotelInfo: HotelInfo = {
  name: 'Grand Hotel',
  address: 'Sultanahmet Mah. Divanyolu Cad. No:123, Fatih/İstanbul',
  phone: '+90 212 555 0123',
  email: 'info@grandhotel.com',
  wifiPassword: 'GrandHotel2024',
  checkInTime: '15:00',
  checkOutTime: '12:00',
  breakfastTime: '07:00 - 10:30',
  lunchTime: '12:00 - 15:00',
  dinnerTime: '18:00 - 22:00',
  poolHours: '06:00 - 22:00',
  gymHours: '24/7',
  spaHours: '09:00 - 21:00',
  rules: [
    'Odalarda sigara içmek yasaktır',
    'Sessizlik saatleri: 22:00 - 08:00',
    'Havuz alanı 22:00\'de kapanır',
    'Evcil hayvanlar önceden bildirim ile kabul edilir',
    'Oda başına maksimum 4 misafir'
  ],
  emergencyContacts: {
    reception: '+90 212 555 0123',
    security: '+90 212 555 0124',
    medical: '+90 212 555 0125'
  }
};
