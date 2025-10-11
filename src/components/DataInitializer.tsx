'use client';

import { useEffect, useState } from 'react';
import { useHotelStore } from '@/store/hotelStore';
import { sampleRooms, sampleGuests, sampleMenu, sampleStaff } from '@/lib/sampleData';

export default function DataInitializer() {
  const { rooms, guests, menu, staff, addRoom, addGuest } = useHotelStore();
  const [menuLoaded, setMenuLoaded] = useState(false);
  useEffect(() => {
    // Initialize sample data if store is empty
    if (rooms && rooms.length === 0) {
      sampleRooms.forEach(room => addRoom(room));
    }
    if (guests && guests.length === 0) {
      sampleGuests.forEach(guest => addGuest(guest));
    }
    // MENU CACHE + API
    if (!menuLoaded) {
      (async () => {
        try {
          // Öncelik API
          const res = await fetch('/api/menu', { cache: 'no-store' });
          if (res.ok) {
            const json = await res.json();
            if (Array.isArray(json.menu) && json.menu.length > 0) {
              useHotelStore.setState(state => ({ ...state, menu: json.menu, staff: sampleStaff }));
              localStorage.setItem('menuCache', JSON.stringify(json.menu));
              setMenuLoaded(true);
              return;
            }
          }
        } catch {}

        // API başarısızsa localStorage
        const cachedMenu = typeof window !== 'undefined' ? localStorage.getItem('menuCache') : null;
        if (menu && menu.length === 0 && cachedMenu) {
          try {
            const parsedMenu = JSON.parse(cachedMenu);
            useHotelStore.setState(state => ({ ...state, menu: parsedMenu, staff: sampleStaff }));
            setMenuLoaded(true);
            return;
          } catch {}
        }

        // Son çare: sample
        if (menu && menu.length === 0) {
          useHotelStore.setState(state => ({ ...state, menu: sampleMenu, staff: sampleStaff }));
          localStorage.setItem('menuCache', JSON.stringify(sampleMenu));
        }
        setMenuLoaded(true);
      })();
    }
  }, [rooms, guests, menu, addRoom, addGuest, menuLoaded]);
  return null; // This component doesn't render anything
}