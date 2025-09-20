import { sampleRooms } from '@/lib/sampleData';
import GuestInterfaceClient from './GuestInterfaceClient';

export async function generateStaticParams() {
  // Export all possible roomId values for static export
  return sampleRooms.map(room => ({ roomId: room.id }));
}

export default function GuestInterface({ params }: { params: { roomId: string } }) {
  return <GuestInterfaceClient roomId={params.roomId} />;
}
