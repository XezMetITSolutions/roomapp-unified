'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ApiService, GuestRequest } from '@/services/api';
import { 
  User, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  Phone,
  Package,
  ChefHat,
  Filter,
  Search,
  Bell,
  X,
  Truck,
  MapPin
} from 'lucide-react';

interface Order {
  id: string;
  roomId: string;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  items: Array<{
    menuItemId: string;
    name?: string;
    quantity: number;
    price: number;
    specialRequests?: string;
    notes?: string;
  }>;
  totalAmount: number;
  paymentStatus: 'paid' | 'pending';
  specialInstructions?: string;
  notes?: string;
  createdAt: Date;
  deliveryTime?: Date;
  guestId: string;
}

export default function StaffPanel() {
  const { token, user } = useAuth();
  const [guestRequests, setGuestRequests] = useState<GuestRequest[]>([]);
  const [readyOrders, setReadyOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'all' | 'requests' | 'orders'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<GuestRequest | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // URL'den tenant slug'ını al
  const getTenantSlug = () => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const subdomain = hostname.split('.')[0];
      if (subdomain && subdomain !== 'www' && subdomain !== 'roomxqr' && subdomain !== 'roomxqr-backend') {
        return subdomain;
      }
    }
    return 'demo';
  };

  // Bildirim sesi
  const playNotificationSound = useCallback(() => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.05);
      
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
    } catch (error) {
      console.log('Ses çalınamadı:', error);
    }
  }, [soundEnabled]);

  // Misafir isteklerini yükle
  const loadGuestRequests = useCallback(async () => {
    if (!token) return;

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://roomxqr-backend.onrender.com';
      const tenantSlug = getTenantSlug();

      const response = await fetch(`${API_BASE_URL}/api/requests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-tenant': tenantSlug
        }
      });

      if (response.ok) {
        const data = await response.json();
        const requests = Array.isArray(data) ? data : (data.requests || []);
        
        // Sadece yemek siparişi olmayan istekleri al (yemek siparişleri mutfak panelinde)
        const nonFoodRequests = requests.filter((req: GuestRequest) => req.type !== 'food_order');
        
        setGuestRequests(prev => {
          const newRequests = nonFoodRequests.filter((newReq: GuestRequest) => 
            !prev.some(p => p.id === newReq.id)
          );
          
          if (newRequests.length > 0) {
            playNotificationSound();
          }
          
          return nonFoodRequests;
        });
      }
    } catch (error) {
      console.error('Misafir istekleri yükleme hatası:', error);
    }
  }, [token, playNotificationSound]);

  // Hazır yemek siparişlerini yükle
  const loadReadyOrders = useCallback(async () => {
    if (!token) return;

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://roomxqr-backend.onrender.com';
      const tenantSlug = getTenantSlug();

      // Siparişleri al
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-tenant': tenantSlug
        }
      });

      if (response.ok) {
        const data = await response.json();
        const orders = Array.isArray(data) ? data : (data.orders || []);
        
        // Sadece "ready" durumundaki siparişleri al
        const ready = orders.filter((order: any) => order.status === 'READY' || order.status === 'ready').map((order: any) => ({
          id: order.id,
          roomId: order.roomId?.replace('room-', '') || order.roomNumber || '',
          status: 'ready' as const,
          items: (order.items || order.orderItems || []).map((item: any) => ({
            menuItemId: item.menuItemId || item.id,
            name: item.menuItem?.name || item.name || 'Ürün',
            quantity: item.quantity || 1,
            price: Number(item.price || item.menuItem?.price || 0),
            specialRequests: item.notes || item.specialRequests,
            notes: item.notes
          })),
          totalAmount: Number(order.totalAmount || 0),
          paymentStatus: order.paymentStatus || 'paid',
          specialInstructions: order.notes || order.specialInstructions,
          notes: order.notes,
          createdAt: new Date(order.createdAt),
          deliveryTime: order.deliveryTime ? new Date(order.deliveryTime) : undefined,
          guestId: order.guestId || order.roomId
        }));
        
        setReadyOrders(prev => {
          const newOrders = ready.filter((newOrder: any) => 
            !prev.some(p => p.id === newOrder.id)
          );
          
          if (newOrders.length > 0) {
            playNotificationSound();
          }
          
          return ready;
        });
      }
    } catch (error) {
      console.error('Hazır siparişler yükleme hatası:', error);
    }
  }, [token, playNotificationSound]);

  // İlk yükleme
  useEffect(() => {
    if (token) {
      setIsLoading(true);
      Promise.all([loadGuestRequests(), loadReadyOrders()]).finally(() => {
        setIsLoading(false);
      });
    }
  }, [token, loadGuestRequests, loadReadyOrders]);

  // Periyodik güncelleme
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      loadGuestRequests();
      loadReadyOrders();
    }, 5000); // Her 5 saniyede bir güncelle

    return () => clearInterval(interval);
  }, [token, loadGuestRequests, loadReadyOrders]);

  // İstek durumunu güncelle
  const updateRequestStatus = async (requestId: string, status: string) => {
    if (!token) return;

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://roomxqr-backend.onrender.com';
      const tenantSlug = getTenantSlug();

      const response = await fetch(`${API_BASE_URL}/api/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-tenant': tenantSlug
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setGuestRequests(prev => 
          prev.map(req => req.id === requestId ? { ...req, status: status as any } : req)
        );
      }
    } catch (error) {
      console.error('İstek durumu güncelleme hatası:', error);
    }
  };

  // Sipariş durumunu güncelle (yemeği götürdü olarak işaretle)
  const markOrderAsDelivered = async (orderId: string) => {
    if (!token) return;

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://roomxqr-backend.onrender.com';
      const tenantSlug = getTenantSlug();

      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-tenant': tenantSlug
        },
        body: JSON.stringify({ status: 'DELIVERED' })
      });

      if (response.ok) {
        setReadyOrders(prev => prev.filter(order => order.id !== orderId));
      }
    } catch (error) {
      console.error('Sipariş durumu güncelleme hatası:', error);
    }
  };

  // Filtrelenmiş istekler
  const filteredRequests = guestRequests.filter(req => {
    const matchesSearch = 
      req.roomId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Filtrelenmiş siparişler
  const filteredOrders = readyOrders.filter(order => {
    const matchesSearch = 
      order.roomId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const getRequestTypeIcon = (type: string) => {
    switch (type) {
      case 'room_service': return <Package className="w-5 h-5 text-blue-600" />;
      case 'cleaning': return <User className="w-5 h-5 text-green-600" />;
      case 'maintenance': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'other': return <MessageSquare className="w-5 h-5 text-gray-600" />;
      default: return <MessageSquare className="w-5 h-5 text-gray-600" />;
    }
  };

  const getRequestTypeLabel = (type: string) => {
    switch (type) {
      case 'room_service': return 'Oda Servisi';
      case 'cleaning': return 'Temizlik';
      case 'maintenance': return 'Bakım';
      case 'other': return 'Diğer';
      default: return type;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-hotel-cream to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Personel Paneli</h1>
                <p className="text-gray-600">Misafir istekleri ve hazır yemek siparişleri</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-lg ${soundEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
                title={soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
              >
                {soundEnabled ? <Bell className="w-5 h-5" /> : <X className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters and Search */}
        <div className="hotel-card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Oda numarası veya içerik ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              {[
                { id: 'all', label: 'Tümü', count: filteredRequests.length + filteredOrders.length },
                { id: 'requests', label: 'İstekler', count: filteredRequests.length },
                { id: 'orders', label: 'Hazır Yemekler', count: filteredOrders.length },
              ].map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === filterOption.id
                      ? 'bg-hotel-gold text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filterOption.label} ({filterOption.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hotel-gold mx-auto"></div>
            <p className="mt-4 text-gray-600">Yükleniyor...</p>
          </div>
        )}

        {/* Misafir İstekleri */}
        {(filter === 'all' || filter === 'requests') && filteredRequests.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              <span>Misafir İstekleri</span>
            </h2>
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div key={request.id} className="hotel-card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-lg font-semibold text-gray-900">
                          Oda {request.roomId.replace('room-', '')}
                        </span>
                        {getRequestTypeIcon(request.type)}
                        <span className="text-sm text-gray-600">
                          {getRequestTypeLabel(request.type)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(request.priority || 'medium')}`}>
                          {request.priority === 'urgent' ? 'ACİL' : 
                           request.priority === 'high' ? 'YÜKSEK' : 
                           request.priority === 'medium' ? 'ORTA' : 'DÜŞÜK'}
                        </span>
                        <span className="text-sm text-gray-600">
                          {new Date(request.createdAt).toLocaleString('tr-TR')}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{request.description}</p>
                      
                      {request.notes && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                          <p className="text-sm text-blue-900">{request.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      {request.status === 'pending' && (
                        <button
                          onClick={() => updateRequestStatus(request.id, 'in_progress')}
                          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm flex items-center space-x-2"
                        >
                          <Clock className="w-4 h-4" />
                          <span>Başlat</span>
                        </button>
                      )}
                      
                      {request.status === 'in_progress' && (
                        <button
                          onClick={() => updateRequestStatus(request.id, 'completed')}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center space-x-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Tamamla</span>
                        </button>
                      )}
                      
                      {request.status === 'completed' && (
                        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium text-center">
                          ✅ Tamamlandı
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hazır Yemek Siparişleri */}
        {(filter === 'all' || filter === 'orders') && filteredOrders.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <ChefHat className="w-6 h-6 text-orange-600" />
              <span>Hazır Yemek Siparişleri</span>
            </h2>
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="hotel-card p-6 hover:shadow-lg transition-shadow border-l-4 border-orange-500">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-lg font-semibold text-gray-900">
                          Oda {order.roomId}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200 flex items-center space-x-1">
                          <ChefHat className="w-4 h-4" />
                          <span>HAZIR</span>
                        </span>
                        <span className="text-sm text-gray-600">
                          {order.createdAt.toLocaleString('tr-TR')}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Sipariş Detayları:</h4>
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-gray-700">
                                  {item.quantity}x {item.name || 'Ürün'}
                                </span>
                                <span className="font-medium text-gray-900">
                                  {(item.price * item.quantity).toFixed(2)}₺
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Sipariş Bilgileri:</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex justify-between">
                              <span>Toplam Tutar:</span>
                              <span className="font-medium text-gray-900">{order.totalAmount.toFixed(2)}₺</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Ödeme Durumu:</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                order.paymentStatus === 'paid' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.paymentStatus === 'paid' ? 'ÖDENDİ' : 'BEKLEMEDE'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {order.specialInstructions && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                          <p className="text-sm font-medium text-blue-900">Özel Talimatlar:</p>
                          <p className="text-sm text-blue-700">{order.specialInstructions}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => markOrderAsDelivered(order.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center space-x-2"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Yemeği Götürdüm</span>
                      </button>
                      
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm flex items-center space-x-2"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>Detaylar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Boş Durum */}
        {!isLoading && filteredRequests.length === 0 && filteredOrders.length === 0 && (
          <div className="hotel-card p-12 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Sonuç Bulunamadı' : 'Henüz İstek veya Sipariş Yok'}
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Arama kriterlerinize uygun istek veya sipariş bulunamadı.' 
                : 'Misafir istekleri ve hazır yemek siparişleri burada görünecek.'}
            </p>
          </div>
        )}
      </div>

      {/* İstek Detay Modal */}
      {selectedRequest && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedRequest(null)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              İstek Detayları - Oda {selectedRequest.roomId.replace('room-', '')}
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">İstek Türü:</h4>
                <p className="text-gray-700">{getRequestTypeLabel(selectedRequest.type)}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Açıklama:</h4>
                <p className="text-gray-700">{selectedRequest.description}</p>
              </div>
              
              {selectedRequest.notes && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Notlar:</h4>
                  <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{selectedRequest.notes}</p>
                </div>
              )}
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Öncelik:</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedRequest.priority || 'medium')}`}>
                  {selectedRequest.priority === 'urgent' ? 'ACİL' : 
                   selectedRequest.priority === 'high' ? 'YÜKSEK' : 
                   selectedRequest.priority === 'medium' ? 'ORTA' : 'DÜŞÜK'}
                </span>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Durum:</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  selectedRequest.status === 'in_progress' ? 'bg-orange-100 text-orange-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {selectedRequest.status === 'pending' ? 'BEKLEMEDE' :
                   selectedRequest.status === 'in_progress' ? 'İŞLEMDE' : 'TAMAMLANDI'}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setSelectedRequest(null)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sipariş Detay Modal */}
      {selectedOrder && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Sipariş Detayları - Oda {selectedOrder.roomId}
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Sipariş Ürünleri:</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {item.quantity}x {item.name || 'Ürün'}
                        </p>
                        {item.specialRequests && (
                          <p className="text-sm text-gray-600">{item.specialRequests}</p>
                        )}
                      </div>
                      <span className="font-medium text-gray-900">
                        {(item.price * item.quantity).toFixed(2)}₺
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Toplam Tutar:</span>
                  <span>{selectedOrder.totalAmount.toFixed(2)}₺</span>
                </div>
              </div>
              
              {selectedOrder.specialInstructions && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Özel Talimatlar:</h4>
                  <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">
                    {selectedOrder.specialInstructions}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Kapat
              </button>
              <button
                onClick={() => {
                  markOrderAsDelivered(selectedOrder.id);
                  setSelectedOrder(null);
                }}
                className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Yemeği Götürdüm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

