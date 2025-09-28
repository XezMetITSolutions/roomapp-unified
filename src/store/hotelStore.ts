// Hotel Store - Zustand state management
import { create } from 'zustand';
import { Room, Guest, MenuItem, Staff } from '@/types';

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
  
  // Actions
  setHotelInfo: (info: { name: string; address: string; phone: string }) => void;
  addRoom: (room: Room) => void;
  addGuest: (guest: Guest) => void;
  setMenu: (menu: MenuItem[]) => void;
  setStaff: (staff: Staff[]) => void;
}

export const useHotelStore = create<HotelState>((set) => ({
  // Initial state
  hotelName: 'RoomApp Hotel',
  hotelAddress: 'İstanbul, Türkiye',
  hotelPhone: '+90 212 123 45 67',
  rooms: [],
  guests: [],
  menu: [],
  staff: [],
  
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
}));

// Export for compatibility
export const hotelStore = {
  // Boş store for compatibility
};