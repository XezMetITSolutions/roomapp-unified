import { create } from 'zustand';
import { Room, Guest, Request, Order, MenuItem, HotelInfo, Notification, Staff, Language, Package, Business, Payment, Cart, CartItem } from '@/types';
import { sampleMenu } from '@/lib/sampleData';

interface HotelStore {
  // State
  rooms: Room[];
  guests: Guest[];
  requests: Request[];
  orders: Order[];
  menu: MenuItem[];
  hotelInfo: HotelInfo;
  notifications: Notification[];
  staff: Staff[];
  currentLanguage: Language;
  business: Business | null;
  packages: Package[];
  payments: Payment[];
  cart: Cart;
  
  // Room management
  addRoom: (room: Room) => void;
  updateRoom: (roomId: string, updates: Partial<Room>) => void;
  getRoomByNumber: (roomNumber: string) => Room | undefined;
  
  // Guest management
  addGuest: (guest: Guest) => void;
  updateGuest: (guestId: string, updates: Partial<Guest>) => void;
  getGuestByRoom: (roomId: string) => Guest | undefined;
  
  // Request management
  addRequest: (request: Request) => void;
  updateRequest: (requestId: string, updates: Partial<Request>) => void;
  getRequestsByRoom: (roomId: string) => Request[];
  getPendingRequests: () => Request[];
  
  // Order management
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  getOrdersByRoom: (roomId: string) => Order[];
  getPendingOrders: () => Order[];
  
  // Menu management
  updateMenuItem: (itemId: string, updates: Partial<MenuItem>) => void;
  getMenuByCategory: (category: string) => MenuItem[];
  
  // Notification management
  addNotification: (notification: Notification) => void;
  markNotificationRead: (notificationId: string) => void;
  getUnreadNotifications: () => Notification[];
  
  // Language management
  setLanguage: (language: Language) => void;
  
  // Hotel info management
  updateHotelInfo: (updates: Partial<HotelInfo>) => void;
  
  // Business management
  setBusiness: (business: Business) => void;
  updateBusiness: (updates: Partial<Business>) => void;
  
  // Package management
  setPackages: (packages: Package[]) => void;
  getPackageById: (packageId: string) => Package | undefined;
  
  // Payment management
  addPayment: (payment: Payment) => void;
  updatePayment: (paymentId: string, updates: Partial<Payment>) => void;
  getPaymentsByOrder: (orderId: string) => Payment[];
  getPendingPayments: () => Payment[];
  
  // Cart management
  addToCart: (menuItem: MenuItem, quantity?: number, specialRequests?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartItemQuantity: (cartItemId: string, quantity: number) => void;
  updateCartItemSpecialRequests: (cartItemId: string, specialRequests: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

export const useHotelStore = create<HotelStore>((set, get) => ({
  // Initial state
  rooms: [],
  guests: [],
  requests: [],
  orders: [],
  menu: sampleMenu,
  hotelInfo: {
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
  },
  notifications: [],
  staff: [],
  currentLanguage: 'tr',
  business: null,
  packages: [],
  payments: [],
  cart: {
    items: [],
    totalAmount: 0,
    specialInstructions: ''
  },
  
  // Room management
  addRoom: (room) => set((state) => ({
    rooms: [...state.rooms, room]
  })),
  
  updateRoom: (roomId, updates) => set((state) => ({
    rooms: state.rooms.map(room => 
      room.id === roomId ? { ...room, ...updates } : room
    )
  })),
  
  getRoomByNumber: (roomNumber) => {
    return get().rooms.find(room => room.number === roomNumber);
  },
  
  // Guest management
  addGuest: (guest) => set((state) => ({
    guests: [...state.guests, guest]
  })),
  
  updateGuest: (guestId, updates) => set((state) => ({
    guests: state.guests.map(guest => 
      guest.id === guestId ? { ...guest, ...updates } : guest
    )
  })),
  
  getGuestByRoom: (roomId) => {
    return get().guests.find(guest => guest.roomId === roomId);
  },
  
  // Request management
  addRequest: (request) => set((state) => {
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      type: 'request',
      title: `New ${request.type} request`,
      message: `Room ${get().rooms.find(r => r.id === request.roomId)?.number}: ${request.description}`,
      roomId: request.roomId,
      priority: request.priority,
      read: false,
      createdAt: new Date(),
      actionRequired: true
    };
    
    return {
      requests: [...state.requests, request],
      notifications: [...state.notifications, notification]
    };
  }),
  
  updateRequest: (requestId, updates) => set((state) => ({
    requests: state.requests.map(request => 
      request.id === requestId ? { ...request, ...updates } : request
    )
  })),
  
  getRequestsByRoom: (roomId) => {
    return get().requests.filter(request => request.roomId === roomId);
  },
  
  getPendingRequests: () => {
    return get().requests.filter(request => 
      request.status === 'pending' || request.status === 'in_progress'
    );
  },
  
  // Order management
  addOrder: (order) => set((state) => {
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      type: 'order',
      title: 'New room service order',
      message: `Room ${get().rooms.find(r => r.id === order.roomId)?.number}: $${order.totalAmount.toFixed(2)}`,
      roomId: order.roomId,
      priority: 'medium',
      read: false,
      createdAt: new Date(),
      actionRequired: true
    };
    
    return {
      orders: [...state.orders, order],
      notifications: [...state.notifications, notification]
    };
  }),
  
  updateOrder: (orderId, updates) => set((state) => ({
    orders: state.orders.map(order => 
      order.id === orderId ? { ...order, ...updates } : order
    )
  })),
  
  getOrdersByRoom: (roomId) => {
    return get().orders.filter(order => order.roomId === roomId);
  },
  
  getPendingOrders: () => {
    return get().orders.filter(order => 
      order.status === 'pending' || order.status === 'confirmed' || order.status === 'preparing'
    );
  },
  
  // Menu management
  updateMenuItem: (itemId, updates) => set((state) => ({
    menu: state.menu.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    )
  })),
  
  getMenuByCategory: (category) => {
    return get().menu.filter(item => item.category === category && item.available);
  },
  
  // Notification management
  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, notification]
  })),
  
  markNotificationRead: (notificationId) => set((state) => ({
    notifications: state.notifications.map(notification => 
      notification.id === notificationId ? { ...notification, read: true } : notification
    )
  })),
  
  getUnreadNotifications: () => {
    return get().notifications.filter(notification => !notification.read);
  },
  
  // Language management
  setLanguage: (language) => set({ currentLanguage: language }),
  
  // Hotel info management
  updateHotelInfo: (updates) => set((state) => ({
    hotelInfo: { ...state.hotelInfo, ...updates }
  })),
  
  // Business management
  setBusiness: (business) => set({ business }),
  
  updateBusiness: (updates) => set((state) => ({
    business: state.business ? { ...state.business, ...updates } : null
  })),
  
  // Package management
  setPackages: (packages) => set({ packages }),
  
  getPackageById: (packageId) => {
    return get().packages.find(pkg => pkg.id === packageId);
  },
  
  // Payment management
  addPayment: (payment) => set((state) => ({
    payments: [...state.payments, payment]
  })),
  
  updatePayment: (paymentId, updates) => set((state) => ({
    payments: state.payments.map(payment => 
      payment.id === paymentId ? { ...payment, ...updates } : payment
    )
  })),
  
  getPaymentsByOrder: (orderId) => {
    return get().payments.filter(payment => payment.orderId === orderId);
  },
  
  getPendingPayments: () => {
    return get().payments.filter(payment => payment.status === 'pending');
  },
  
  // Cart management
  addToCart: (menuItem, quantity = 1, specialRequests = '') => set((state) => {
    const existingItem = state.cart.items.find(item => 
      item.menuItem.id === menuItem.id && item.specialRequests === specialRequests
    );
    
    if (existingItem) {
      const updatedItems = state.cart.items.map(item =>
        item.id === existingItem.id
          ? {
              ...item,
              quantity: item.quantity + quantity,
              totalPrice: (item.quantity + quantity) * menuItem.price
            }
          : item
      );
      
      const totalAmount = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
      
      return {
        cart: {
          ...state.cart,
          items: updatedItems,
          totalAmount
        }
      };
    } else {
      const newCartItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random()}`,
        menuItem,
        quantity,
        specialRequests,
        totalPrice: quantity * menuItem.price
      };
      
      const updatedItems = [...state.cart.items, newCartItem];
      const totalAmount = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
      
      return {
        cart: {
          ...state.cart,
          items: updatedItems,
          totalAmount
        }
      };
    }
  }),
  
  removeFromCart: (cartItemId) => set((state) => {
    const updatedItems = state.cart.items.filter(item => item.id !== cartItemId);
    const totalAmount = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    return {
      cart: {
        ...state.cart,
        items: updatedItems,
        totalAmount
      }
    };
  }),
  
  updateCartItemQuantity: (cartItemId, quantity) => set((state) => {
    if (quantity <= 0) {
      get().removeFromCart(cartItemId);
      return state;
    }
    
    const updatedItems = state.cart.items.map(item =>
      item.id === cartItemId
        ? {
            ...item,
            quantity,
            totalPrice: quantity * item.menuItem.price
          }
        : item
    );
    
    const totalAmount = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    return {
      ...state,
      cart: {
        ...state.cart,
        items: updatedItems,
        totalAmount
      }
    };
  }),
  
  updateCartItemSpecialRequests: (cartItemId, specialRequests) => set((state) => ({
    cart: {
      ...state.cart,
      items: state.cart.items.map(item =>
        item.id === cartItemId
          ? { ...item, specialRequests }
          : item
      )
    }
  })),
  
  clearCart: () => set((state) => ({
    cart: {
      items: [],
      totalAmount: 0,
      specialInstructions: ''
    }
  })),
  
  getCartTotal: () => {
    return get().cart.totalAmount;
  },
  
  getCartItemCount: () => {
    return get().cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}));
