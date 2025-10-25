'use client';

import { NotificationProvider } from '@/contexts/NotificationContext';
import DataInitializer from '@/components/DataInitializer';

interface ClientProvidersProps {
  children: React.ReactNode;
  roomId?: string;
}

export default function ClientProviders({ children, roomId }: ClientProvidersProps) {
  return (
    <NotificationProvider roomId={roomId}>
      <DataInitializer />
      {children}
    </NotificationProvider>
  );
}
