// API servis dosyası - Gerçek backend entegrasyonu için

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface GuestRequest {
  id: string;
  roomId: string;
  type: 'housekeeping' | 'maintenance' | 'concierge' | 'general';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  description: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationData {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  roomId?: string;
  requestId?: string;
  timestamp: string;
  read: boolean;
}

export interface RoomStatus {
  roomId: string;
  status: 'occupied' | 'vacant' | 'cleaning' | 'maintenance';
  guestName?: string;
  checkIn?: string;
  checkOut?: string;
}

// API çağrıları
export class ApiService {
  // Misafir talepleri
  static async getGuestRequests(roomId?: string): Promise<GuestRequest[]> {
    try {
      const url = roomId ? `${API_BASE_URL}/requests?roomId=${roomId}` : `${API_BASE_URL}/requests`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch requests');
      return await response.json();
    } catch (error) {
      console.error('Error fetching requests:', error);
      // Fallback: Mock data döndür
      return this.getMockRequests();
    }
  }

  static async createGuestRequest(request: Omit<GuestRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<GuestRequest> {
    try {
      const response = await fetch(`${API_BASE_URL}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      if (!response.ok) throw new Error('Failed to create request');
      return await response.json();
    } catch (error) {
      console.error('Error creating request:', error);
      // Fallback: Mock response döndür
      return {
        id: Date.now().toString(),
        ...request,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  }

  static async updateRequestStatus(requestId: string, status: GuestRequest['status'], notes?: string): Promise<GuestRequest> {
    try {
      const response = await fetch(`${API_BASE_URL}/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });
      if (!response.ok) throw new Error('Failed to update request');
      return await response.json();
    } catch (error) {
      console.error('Error updating request:', error);
      throw error;
    }
  }

  // Bildirimler
  static async getNotifications(roomId?: string): Promise<NotificationData[]> {
    try {
      const url = roomId ? `${API_BASE_URL}/notifications?roomId=${roomId}` : `${API_BASE_URL}/notifications`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      return await response.json();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  static async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: 'PATCH',
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Oda durumu
  static async getRoomStatus(roomId: string): Promise<RoomStatus> {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/status`);
      if (!response.ok) throw new Error('Failed to fetch room status');
      return await response.json();
    } catch (error) {
      console.error('Error fetching room status:', error);
      // Fallback: Mock data
      return {
        roomId,
        status: 'occupied',
        guestName: 'Misafir',
        checkIn: new Date().toISOString(),
      };
    }
  }

  // İstatistikler
  static async getStatistics(): Promise<{
    totalRequests: number;
    pendingRequests: number;
    completedToday: number;
    averageResponseTime: number;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/statistics`);
      if (!response.ok) throw new Error('Failed to fetch statistics');
      return await response.json();
    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Fallback: Mock data
      return {
        totalRequests: 45,
        pendingRequests: 8,
        completedToday: 12,
        averageResponseTime: 15, // dakika
      };
    }
  }

  // WebSocket bağlantısı (gerçek zamanlı güncellemeler için)
  static connectWebSocket(roomId: string, onMessage: (data: any) => void): WebSocket | null {
    try {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
      const ws = new WebSocket(`${wsUrl}/ws?roomId=${roomId}`);
      
      ws.onopen = () => console.log('WebSocket connected');
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      ws.onerror = (error) => console.error('WebSocket error:', error);
      ws.onclose = () => console.log('WebSocket disconnected');
      
      return ws;
    } catch (error) {
      console.error('Error connecting WebSocket:', error);
      return null;
    }
  }

  // Ödeme durumu güncelleme
  static async updatePaymentStatus(paymentId: string, status: 'paid' | 'pending'): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${paymentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) throw new Error('Failed to update payment status');
    } catch (error) {
      console.error('Error updating payment status:', error);
      // Mock başarılı yanıt
    }
  }

  // QR kod sıfırlama
  static async resetRoomQR(roomId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/reset-qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to reset room QR');
    } catch (error) {
      console.error('Error resetting room QR:', error);
      // Mock başarılı yanıt
    }
  }

  // Oda değişikliği
  static async changeRoom(fromRoomId: string, toRoomId: string, roomData: any): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/change`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromRoomId,
          toRoomId,
          roomData
        }),
      });
      
      if (!response.ok) throw new Error('Failed to change room');
    } catch (error) {
      console.error('Error changing room:', error);
      // Mock başarılı yanıt
    }
  }

  // Müşteriye bildirim gönderme
  static async sendNotificationToGuest(roomId: string, message: string, type: 'response' | 'update' | 'info' = 'response'): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/send-to-guest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId,
          message,
          type,
          timestamp: new Date().toISOString()
        }),
      });
      
      if (!response.ok) throw new Error('Failed to send notification to guest');
    } catch (error) {
      console.error('Error sending notification to guest:', error);
      // Mock başarılı yanıt - gerçek uygulamada burada hata yönetimi yapılabilir
    }
  }

  // Mock data (backend yokken kullanılır)
  private static getMockRequests(): GuestRequest[] {
    return [
      {
        id: '1',
        roomId: 'room-101',
        type: 'housekeeping',
        priority: 'medium',
        status: 'pending',
        description: 'Oda temizliği talep edildi',
        createdAt: new Date(Date.now() - 300000).toISOString(),
        updatedAt: new Date(Date.now() - 300000).toISOString(),
      },
      {
        id: '2',
        roomId: 'room-102',
        type: 'maintenance',
        priority: 'high',
        status: 'in_progress',
        description: 'Klima arızası',
        notes: 'Teknik ekip yolda',
        createdAt: new Date(Date.now() - 600000).toISOString(),
        updatedAt: new Date(Date.now() - 120000).toISOString(),
      },
      {
        id: '3',
        roomId: 'room-103',
        type: 'concierge',
        priority: 'low',
        status: 'completed',
        description: 'Restoran rezervasyonu',
        notes: 'Rezervasyon yapıldı',
        createdAt: new Date(Date.now() - 900000).toISOString(),
        updatedAt: new Date(Date.now() - 60000).toISOString(),
      },
    ];
  }
}

// WebSocket hook'u
export function useWebSocket(roomId: string) {
  const [ws, setWs] = React.useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);

  React.useEffect(() => {
    const websocket = ApiService.connectWebSocket(roomId, (data) => {
      console.log('WebSocket message received:', data);
      // Burada gelen mesajları işleyebiliriz
    });

    if (websocket) {
      setWs(websocket);
      setIsConnected(true);
    }

    return () => {
      if (websocket) {
        websocket.close();
        setIsConnected(false);
      }
    };
  }, [roomId]);

  return { ws, isConnected };
}

// React import'u (hook için)
import React from 'react';
