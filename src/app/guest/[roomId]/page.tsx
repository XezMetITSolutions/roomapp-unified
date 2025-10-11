'use client';

import { sampleRooms } from '@/lib/sampleData';
import GuestInterfaceClient from './GuestInterfaceClient';
import { NotificationProvider } from '@/contexts/NotificationContext';

export async function generateStaticParams() {
  // Export all possible roomId values for static export
  return sampleRooms.map(room => ({ roomId: room.id }));
}

export default function GuestInterface({ params }: { params: { roomId: string } }) {
  return (
    <NotificationProvider roomId={`room-${params.roomId}`}>
      <GuestInterfaceClient roomId={`room-${params.roomId}`} />
    </NotificationProvider>
  );
}
