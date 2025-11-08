// Demo API Service - Demo tenant için API çağrıları
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://roomxqr-backend.onrender.com';

// Demo tenant için API çağrısı yapan helper fonksiyon
export async function demoApiCall(endpoint: string, options: RequestInit = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'x-tenant': 'demo', // Demo tenant
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Demo API Service
export class DemoApiService {
  // Misafir talepleri
  static async getGuestRequests(roomId?: string): Promise<any[]> {
    try {
      const endpoint = roomId ? `/api/requests?roomId=${roomId}` : '/api/requests';
      return await demoApiCall(endpoint);
    } catch (error) {
      console.error('Error fetching demo requests:', error);
      return [];
    }
  }

  static async getStatistics(): Promise<any> {
    try {
      return await demoApiCall('/api/statistics');
    } catch (error) {
      console.error('Error fetching demo statistics:', error);
      return {};
    }
  }

  static async updateRequestStatus(requestId: string, status: string, notes?: string): Promise<any> {
    try {
      return await demoApiCall(`/api/requests/${requestId}`, {
        method: 'PUT',
        body: JSON.stringify({ status, notes })
      });
    } catch (error) {
      console.error('Error updating demo request:', error);
      throw error;
    }
  }

  static async createGuestRequest(request: any): Promise<any> {
    try {
      return await demoApiCall('/api/requests', {
        method: 'POST',
        body: JSON.stringify(request)
      });
    } catch (error) {
      console.error('Error creating demo request:', error);
      throw error;
    }
  }

  static async sendNotificationToGuest(roomId: string, message: string, type: string): Promise<any> {
    try {
      return await demoApiCall('/api/notifications', {
        method: 'POST',
        body: JSON.stringify({ roomId, message, type })
      });
    } catch (error) {
      console.error('Error sending demo notification:', error);
      throw error;
    }
  }

  static async changeRoom(fromRoomId: string, toRoomId: string, roomInfo: any): Promise<any> {
    try {
      return await demoApiCall('/api/rooms/change', {
        method: 'POST',
        body: JSON.stringify({ fromRoomId, toRoomId, roomInfo })
      });
    } catch (error) {
      console.error('Error changing demo room:', error);
      throw error;
    }
  }

  static async checkInGuest(roomId: string, guestData: any): Promise<any> {
    try {
      return await demoApiCall('/api/rooms/checkin', {
        method: 'POST',
        body: JSON.stringify({ roomId, guestData })
      });
    } catch (error) {
      console.error('Error checking in demo guest:', error);
      throw error;
    }
  }

  static async checkOutGuest(roomId: string): Promise<any> {
    try {
      return await demoApiCall(`/api/rooms/${roomId}/checkout`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Error checking out demo guest:', error);
      throw error;
    }
  }

  static async updatePaymentStatus(paymentId: string, status: string): Promise<any> {
    try {
      return await demoApiCall(`/api/payments/${paymentId}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
    } catch (error) {
      console.error('Error updating demo payment:', error);
      throw error;
    }
  }

  static async clearRoomRequests(roomId: string): Promise<any> {
    try {
      return await demoApiCall(`/api/rooms/${roomId}/requests`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error clearing demo room requests:', error);
      throw error;
    }
  }

  static async resetRoomQR(roomId: string): Promise<any> {
    try {
      return await demoApiCall(`/api/rooms/${roomId}/qr/reset`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Error resetting demo room QR:', error);
      throw error;
    }
  }
}

