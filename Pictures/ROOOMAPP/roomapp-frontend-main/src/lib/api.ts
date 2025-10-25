const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://roomxqr-backend.onrender.com'

class ApiClient {
  private baseURL: string
  private currentTenant: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  // Tenant bilgisini ayarla (middleware'den gelecek)
  setTenant(tenant: string | null) {
    this.currentTenant = tenant
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    // Tenant bilgisini header'a ekle
    if (this.currentTenant) {
      headers['x-tenant'] = this.currentTenant
    }

    const response = await fetch(url, { ...options, headers })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    return response.json()
  }

  // Menu endpoints
  async getMenuItems() {
    return this.request('/api/menu')
  }

  // Room endpoints
  async getRooms() {
    return this.request('/api/rooms')
  }

  // Health check
  async healthCheck() {
    return this.request('/health')
  }

  // Order endpoints
  async createOrder(orderData: any) {
    return this.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    })
  }

  // Guest endpoints
  async getGuests() {
    return this.request('/api/guests')
  }

  async createGuest(guestData: any) {
    return this.request('/api/guests', {
      method: 'POST',
      body: JSON.stringify(guestData)
    })
  }

  // Notification endpoints
  async sendNotification(notificationData: any) {
    return this.request('/api/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData)
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
