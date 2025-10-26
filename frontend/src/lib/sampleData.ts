// Sample Data for development and testing

export const sampleRooms = [
  { 
    id: '101', 
    number: '101',
    floor: 1,
    type: 'standard' as const, 
    status: 'occupied' as const,
    guestName: 'Ahmet Yılmaz',
    checkIn: new Date('2025-09-25'),
    checkOut: new Date('2025-09-28'),
    qrCode: 'room-101-qr'
  },
  { 
    id: '102', 
    number: '102',
    floor: 1,
    type: 'deluxe' as const, 
    status: 'occupied' as const,
    guestName: 'Fatma Demir',
    checkIn: new Date('2025-09-26'),
    checkOut: new Date('2025-09-29'),
    qrCode: 'room-102-qr'
  },
  { 
    id: '103', 
    number: '103',
    floor: 1,
    type: 'standard' as const, 
    status: 'vacant' as const,
    qrCode: 'room-103-qr'
  },
  { 
    id: '201', 
    number: '201',
    floor: 2,
    type: 'suite' as const, 
    status: 'occupied' as const,
    guestName: 'Mehmet Kaya',
    checkIn: new Date('2025-09-27'),
    checkOut: new Date('2025-09-30'),
    qrCode: 'room-201-qr'
  },
  { 
    id: '202', 
    number: '202',
    floor: 2,
    type: 'standard' as const, 
    status: 'maintenance' as const,
    qrCode: 'room-202-qr'
  },
];

export const sampleGuests = [
  { 
    id: '1', 
    name: 'Ahmet', 
    surname: 'Yılmaz',
    email: 'ahmet@example.com',
    phone: '+90 555 123 45 67',
    roomId: '101', 
    language: 'tr' as const,
    checkIn: new Date('2025-09-25'), 
    checkOut: new Date('2025-09-28') 
  },
  { 
    id: '2', 
    name: 'Fatma', 
    surname: 'Demir',
    email: 'fatma@example.com',
    phone: '+90 555 234 56 78',
    roomId: '102', 
    language: 'tr' as const,
    checkIn: new Date('2025-09-26'), 
    checkOut: new Date('2025-09-29') 
  },
  { 
    id: '3', 
    name: 'Mehmet', 
    surname: 'Kaya',
    email: 'mehmet@example.com',
    phone: '+90 555 345 67 89',
    roomId: '201', 
    language: 'tr' as const,
    checkIn: new Date('2025-09-27'), 
    checkOut: new Date('2025-09-30') 
  },
];

export const sampleRequests = [
  {
    id: '1',
    roomId: 'room-101',
    type: 'housekeeping',
    priority: 'medium',
    status: 'pending' as const,
    description: 'Oda temizliği talep edildi',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    roomId: 'room-102',
    type: 'maintenance',
    priority: 'urgent',
    status: 'in_progress',
    description: 'Klima arızası',
    createdAt: new Date().toISOString(),
  },
];

export const sampleMenuItems = [
  {
    id: '1',
    name: 'Cheeseburger',
    description: 'Sulu dana köftesi, cheddar peyniri, taze marul, domates ve özel sos ile',
    price: 210,
    category: 'main' as const,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    available: true,
    preparationTime: 15,
    allergens: ['gluten', 'dairy'],
    isNew: false,
    isPopular: true,
    likes: 42,
    badges: ['Chef\'s Choice'],
    dietaryInfo: ['Contains Gluten', 'Contains Dairy']
  },
  {
    id: '2',
    name: 'Margherita Pizza',
    description: 'Taze mozzarella, domates sosu ve fesleğen ile',
    price: 180,
    category: 'main' as const,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
    available: true,
    preparationTime: 20,
    allergens: ['gluten', 'dairy'],
    isNew: false,
    isPopular: true,
    likes: 38,
    badges: ['Vegetarian'],
    dietaryInfo: ['Vegetarian', 'Contains Gluten', 'Contains Dairy']
  },
];

export const sampleMenu = sampleMenuItems;

export const sampleStaff = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    role: 'reception' as const,
    email: 'ahmet@roomxqr.com',
    phone: '+90 555 123 45 67',
    shift: 'morning' as const,
    active: true
  },
  {
    id: '2',
    name: 'Fatma Demir',
    role: 'housekeeping' as const,
    email: 'fatma@roomxqr.com',
    phone: '+90 555 234 56 78',
    shift: 'afternoon' as const,
    active: true
  },
  {
    id: '3',
    name: 'Mehmet Kaya',
    role: 'kitchen' as const,
    email: 'mehmet@roomxqr.com',
    phone: '+90 555 345 67 89',
    shift: 'morning' as const,
    active: true
  }
];

export const sampleOrders = [
  {
    id: '1',
    roomId: '101',
    guestId: '1',
    items: [
      {
        menuItemId: '1',
        quantity: 2,
        price: 210,
        specialRequests: 'Az pişmiş'
      }
    ],
    totalAmount: 420,
    status: 'pending' as const,
    createdAt: new Date(),
    paymentStatus: 'pending' as const,
    paymentMethod: 'room_charge' as const
  }
];

export const packages = [
  {
    id: '1',
    name: 'Premium Paket',
    type: 'premium' as const,
    price: 299,
    features: ['QR Menü', 'Analytics', 'Çoklu Dil', 'Özel Marka'],
    maxRooms: 50,
    maxStaff: 20,
    includes: {
      qrMenu: true,
      analytics: true,
      multiLanguage: true,
      customBranding: true,
      apiAccess: true,
      prioritySupport: true,
      customIntegrations: false
    }
  }
];

export const sampleBusiness = {
  id: '1',
  name: 'RoomXQR Hotel',
  type: 'hotel' as const,
  package: packages[0],
  rooms: sampleRooms,
  staff: sampleStaff,
  settings: {
    currency: 'TRY',
    timezone: 'Europe/Istanbul',
    language: 'tr' as const,
    branding: {
      primaryColor: '#1e3a8a',
      secondaryColor: '#D4AF37'
    }
  },
  subscription: {
    startDate: new Date(),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    status: 'active',
    autoRenew: true
  }
};

export const sampleData = {
  rooms: sampleRooms,
  guests: sampleGuests,
  requests: sampleRequests,
  menuItems: sampleMenuItems,
};