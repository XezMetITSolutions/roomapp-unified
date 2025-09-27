// Sample Data for development and testing

export const sampleRooms = [
  { id: '101', type: 'standard', status: 'occupied' },
  { id: '102', type: 'deluxe', status: 'occupied' },
  { id: '103', type: 'standard', status: 'available' },
  { id: '201', type: 'suite', status: 'occupied' },
  { id: '202', type: 'standard', status: 'maintenance' },
];

export const sampleGuests = [
  { id: '1', name: 'Ahmet', surname: 'Yılmaz', roomId: '101', checkIn: '2025-09-25', checkOut: '2025-09-28' },
  { id: '2', name: 'Fatma', surname: 'Demir', roomId: '102', checkIn: '2025-09-26', checkOut: '2025-09-29' },
  { id: '3', name: 'Mehmet', surname: 'Kaya', roomId: '201', checkIn: '2025-09-27', checkOut: '2025-09-30' },
];

export const sampleRequests = [
  {
    id: '1',
    roomId: 'room-101',
    type: 'housekeeping',
    priority: 'medium',
    status: 'pending',
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
    category: 'main',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    name: 'Margherita Pizza',
    description: 'Taze mozzarella, domates sosu ve fesleğen ile',
    price: 180,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
  },
];

export const sampleData = {
  rooms: sampleRooms,
  guests: sampleGuests,
  requests: sampleRequests,
  menuItems: sampleMenuItems,
};