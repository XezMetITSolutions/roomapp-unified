import { Room } from '@/types';

export interface QRData {
  roomId: string;
  roomNumber: string;
  hotelId: string;
  timestamp: number;
}

export function generateRoomQRData(room: Room): QRData {
  return {
    roomId: room.id,
    roomNumber: room.number,
    hotelId: 'grand-hotel-001',
    timestamp: Date.now()
  };
}

export function generateQRUrl(room: Room): string {
  const qrData = generateRoomQRData(room);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}/guest/${room.id}?data=${encodeURIComponent(JSON.stringify(qrData))}`;
}

export function validateQRData(data: string): QRData | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(data));
    if (parsed.roomId && parsed.roomNumber && parsed.hotelId && parsed.timestamp) {
      // Check if QR code is not older than 24 hours for security
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      if (Date.now() - parsed.timestamp < maxAge) {
        return parsed as QRData;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function generateRoomQRCode(room: Room): string {
  const url = generateQRUrl(room);
  return url;
}
