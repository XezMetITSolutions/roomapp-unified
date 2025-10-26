"use client";

import { sampleRooms } from '@/lib/sampleData';
import GuestInterfaceClient from './GuestInterfaceClient';
import { NotificationProvider } from '@/contexts/NotificationContext';

export default function GuestInterface({ params }: { params: { roomId: string } }) {
  return (
    <NotificationProvider roomId={`room-${params.roomId}`}>
      <GuestInterfaceClient roomId={`room-${params.roomId}`} />
    </NotificationProvider>
  );
}
