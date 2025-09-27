// Hotel Store - Zustand state management
import { create } from 'zustand';

interface HotelState {
  // Hotel bilgileri
  hotelName: string;
  hotelAddress: string;
  hotelPhone: string;
  
  // Actions
  setHotelInfo: (info: { name: string; address: string; phone: string }) => void;
}

export const useHotelStore = create<HotelState>((set) => ({
  // Initial state
  hotelName: 'RoomApp Hotel',
  hotelAddress: 'İstanbul, Türkiye',
  hotelPhone: '+90 212 123 45 67',
  
  // Actions
  setHotelInfo: (info) => set({
    hotelName: info.name,
    hotelAddress: info.address,
    hotelPhone: info.phone,
  }),
}));

// Export for compatibility
export const hotelStore = {
  // Boş store for compatibility
};