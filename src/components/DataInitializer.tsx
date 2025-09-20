'use client';

import { useEffect } from 'react';
import { useHotelStore } from '@/store/hotelStore';
import { sampleRooms, sampleGuests, sampleMenu, sampleStaff } from '@/lib/sampleData';

export default function DataInitializer() {
  const { rooms, guests, menu, staff, addRoom, addGuest } = useHotelStore();

  useEffect(() => {
    // Initialize sample data if store is empty
    if (rooms.length === 0) {
      sampleRooms.forEach(room => addRoom(room));
    }
    
    if (guests.length === 0) {
      sampleGuests.forEach(guest => addGuest(guest));
    }
    
    // Initialize menu and staff data
    if (menu.length === 0) {
      useHotelStore.setState(state => ({
        ...state,
        menu: sampleMenu,
        staff: sampleStaff
      }));
    }
  }, [rooms.length, guests.length, menu.length, addRoom, addGuest]);

  return null; // This component doesn't render anything
}
