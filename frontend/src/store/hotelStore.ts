// Hotel Store - Zustand state management
import { create } from 'zustand';
import { Room, Guest, MenuItem, Staff, Business, Package, Cart } from '@/types';

interface HotelState {
  // Hotel bilgileri
  hotelName: string;
  hotelAddress: string;
  hotelPhone: string;
  
  // Data arrays
  rooms: Room[];
  guests: Guest[];
  menu: MenuItem[];
  staff: Staff[];
  business: Business | null;
  packages: Package[];
  
  // Cart and language
  cart: Cart;
  currentLanguage: string;
  
  // Actions
  setHotelInfo: (info: { name: string; address: string; phone: string }) => void;
  addRoom: (room: Room) => void;
  addGuest: (guest: Guest) => void;
  setMenu: (menu: MenuItem[]) => void;
  setStaff: (staff: Staff[]) => void;
  setBusiness: (business: Business) => void;
  updateBusiness: (updates: Partial<Business>) => void;
  setPackages: (packages: Package[]) => void;
  getCartItemCount: () => number;
  setCurrentLanguage: (language: string) => void;
}

export const useHotelStore = create<HotelState>((set, get) => ({
  // Initial state
  hotelName: 'RoomXQR Hotel',
  hotelAddress: 'İstanbul, Türkiye',
  hotelPhone: '+90 212 123 45 67',
  rooms: [],
  guests: [],
  menu: [],
  staff: [],
  business: null,
  packages: [],
  cart: { items: [], totalAmount: 0 },
  currentLanguage: 'tr',
  
  // Actions
  setHotelInfo: (info) => set({
    hotelName: info.name,
    hotelAddress: info.address,
    hotelPhone: info.phone,
  }),
  addRoom: (room) => set((state) => ({
    rooms: [...state.rooms, room]
  })),
  addGuest: (guest) => set((state) => ({
    guests: [...state.guests, guest]
  })),
  setMenu: (menu) => set({ menu }),
  setStaff: (staff) => set({ staff }),
  setBusiness: (business) => set({ business }),
  updateBusiness: (updates) => set((state) => ({
    business: state.business ? { ...state.business, ...updates } : null
  })),
  setPackages: (packages) => set({ packages }),
  getCartItemCount: () => {
    const state = get();
    return state.cart.items.reduce((total, item) => total + item.quantity, 0);
  },
  setCurrentLanguage: (language) => set({ currentLanguage: language }),
}));

// Export for compatibility
export const hotelStore = {
  // Boş store for compatibility
};