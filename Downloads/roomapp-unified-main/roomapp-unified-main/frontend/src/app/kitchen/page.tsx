'use client';

import { useState, useEffect } from 'react';
import { useHotelStore } from '@/store/hotelStore';
import { sampleOrders, sampleMenu } from '@/lib/sampleData';
import { translate } from '@/lib/translations';
import { Language, Order, MenuItem } from '@/types';
import { ApiService } from '@/services/api';
import { 
  ChefHat, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Filter,
  Search,
  Eye,
  Timer,
  X
} from 'lucide-react';

export default function KitchenPanel() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('tr');
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [menu, setMenu] = useState<MenuItem[]>(sampleMenu);
  const [filter, setFilter] = useState<'all' | 'pending' | 'preparing' | 'delivered' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);

  // Bildirim sesi ├ºalma fonksiyonu
  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Ses ├ºal─▒namad─▒:', error);
    }
  };

  // Yemek sipari┼ƒlerini y├╝kle
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        // Yemek sipari┼ƒlerini al (type: 'food_order' olanlar)
        const requests = await ApiService.getGuestRequests();
        const foodOrders = requests
          .filter(req => req.type === 'food_order')
          .map(req => {
            // Description'dan sipari┼ƒ detaylar─▒n─▒ parse et
            const description = req.description || '';
            const items: Array<{
              menuItemId: string;
              name: string;
              quantity: number;
              price: number;
              specialRequests: string;
            }> = [];
            let totalAmount = 0;
            
            // "Yemek sipari┼ƒi: 2x Cheeseburger, 1x Margherita Pizza" format─▒n─▒ parse et
            if (description.includes('Yemek sipari┼ƒi:')) {
              const orderPart = description.split('Yemek sipari┼ƒi:')[1];
              if (orderPart) {
                const itemStrings = orderPart.split(',').map(s => s.trim());
                itemStrings.forEach(itemStr => {
                  const match = itemStr.match(/(\d+)x\s+(.+)/);
                  if (match) {
                    const quantity = parseInt(match[1]);
                    const itemName = match[2].trim();
                    // Men├╝den fiyat bul
                    const menuItem = menu.find(m => m.name === itemName);
                    const price = menuItem?.price || 0;
                    totalAmount += price * quantity;
                    
                    items.push({
                      menuItemId: menuItem?.id || itemName.toLowerCase().replace(/\s+/g, '-'),
                      name: itemName,
                      quantity: quantity,
                      price: price,
                      specialRequests: req.notes || ''
                    });
                  }
                });
              }
            }
            
            return {
              id: req.id,
              roomId: req.roomId.replace('room-', ''),
              status: req.status === 'pending' ? 'pending' : 
                     req.status === 'in_progress' ? 'preparing' :
                     req.status === 'completed' ? 'ready' : 'pending',
              items: items,
              totalAmount: totalAmount,
              paymentStatus: 'paid' as const,
              specialInstructions: req.notes || '',
              createdAt: new Date(req.createdAt),
              deliveryTime: req.status === 'completed' ? new Date() : undefined,
              guestId: req.roomId // Order tipi i├ºin gerekli
            } as Order;
          });
        
        // Mevcut sipari┼ƒlerle birle┼ƒtir (duplicate kontrol├╝ ile)
        setOrders(prev => {
          const existingIds = new Set(prev.map(order => order.id));
          const newOrders = foodOrders.filter(order => !existingIds.has(order.id));
          
          // Yeni sipari┼ƒ varsa ses ├ºal
          if (newOrders.length > 0) {
            playNotificationSound();
          }
          
          return [...prev, ...newOrders];
        });
      } catch (error) {
        console.error('Sipari┼ƒ y├╝kleme hatas─▒:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
    
    // Her 10 saniyede bir g├╝ncelle
    const interval = setInterval(loadOrders, 10000);
    return () => clearInterval(interval);
  }, [menu]);


  const filteredOrders = orders
    .filter(order => {
      const matchesFilter = filter === 'all' || order.status === filter;
      const matchesSearch = order.roomId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => 
          menu.find(m => m.id === item.menuItemId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      // Teslim edilen ve iptal edilen sipari┼ƒler en alta, di─ƒerleri duruma g├╢re s─▒rala
      if ((a.status === 'delivered' || a.status === 'cancelled') && 
          (b.status !== 'delivered' && b.status !== 'cancelled')) return 1;
      if ((b.status === 'delivered' || b.status === 'cancelled') && 
          (a.status !== 'delivered' && a.status !== 'cancelled')) return -1;
      
      // Ayn─▒ durumda olanlar i├ºin tarihe g├╢re s─▒rala (yeni olanlar ├╝stte)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleOrderStatusChange = async (orderId: string, newStatus: Order['status']) => {
    // ├ûnce local state'i g├╝ncelle
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            status: newStatus,
            ...(newStatus === 'delivered' && { deliveryTime: new Date() })
          }
        : order
    ));

    // M├╝┼ƒteriye bildirim g├╢nder
    const order = orders.find(o => o.id === orderId);
    if (order) {
      try {
        if (newStatus === 'preparing') {
          await ApiService.sendNotificationToGuest(
            `room-${order.roomId}`,
            `Sipari┼ƒiniz haz─▒rlanmaya ba┼ƒland─▒. Tahmini s├╝re: ${calculateTotalPreparationTime(order)} dakika.`,
            'info'
          );
        } else if (newStatus === 'delivered') {
          await ApiService.sendNotificationToGuest(
            `room-${order.roomId}`,
            `Sipari┼ƒiniz teslim edildi! Afiyet olsun.`,
            'info'
          );
        } else if (newStatus === 'cancelled') {
          await ApiService.sendNotificationToGuest(
            `room-${order.roomId}`,
            `Sipari┼ƒiniz iptal edildi. Resepsiyon ile ileti┼ƒime ge├ºebilirsiniz.`,
            'info'
          );
        }
      } catch (error) {
        console.error('Bildirim g├╢nderme hatas─▒:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <AlertCircle className="w-4 h-4" />;
      case 'preparing': return <Play className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <Pause className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const calculateTotalPreparationTime = (order: Order) => {
    return order.items.reduce((total, item) => {
      const menuItem = menu.find(m => m.id === item.menuItemId);
      return total + (menuItem?.preparationTime || 0);
    }, 0);
  };

  const getMenuItemName = (menuItemId: string, itemName?: string) => {
    // E─ƒer itemName varsa onu kullan (QR men├╝den gelen sipari┼ƒler i├ºin)
    if (itemName) {
      return itemName;
    }
    const menuItem = menu.find(m => m.id === menuItemId);
    return menuItem?.name || 'Bilinmeyen ├£r├╝n';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-hotel-cream to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-hotel-sage rounded-xl flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {translate('kitchen_panel_title', currentLanguage)}
                </h1>
                <p className="text-gray-600">
                  {translate('kitchen_panel_desc', currentLanguage)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={currentLanguage}
                onChange={(e) => setCurrentLanguage(e.target.value as Language)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1 bg-white"
              >
                <option value="tr">≡ƒç╣≡ƒç╖ T├╝rk├ºe</option>
                <option value="de">≡ƒç⌐≡ƒç¬ Deutsch</option>
              </select>
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
                  placeholder="Oda numaras─▒ veya ├╝r├╝n ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                />
                                    </div>
                                      </div>
            <div className="flex space-x-2">
              {[
                { id: 'all', label: 'T├╝m├╝', count: orders.length },
                { id: 'pending', label: 'Bekleyen', count: orders.filter(o => o.status === 'pending').length },
                { id: 'preparing', label: 'Haz─▒rlanan', count: orders.filter(o => o.status === 'preparing').length },
                { id: 'delivered', label: 'Teslim Edilen', count: orders.filter(o => o.status === 'delivered').length },
                { id: 'cancelled', label: '─░ptal Edilen', count: orders.filter(o => o.status === 'cancelled').length }
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
                  
        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="hotel-card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-lg font-semibold text-gray-900">
                      Oda {order.roomId}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span>
                        {order.status === 'pending' ? 'BEKLEMEDE' :
                         order.status === 'confirmed' ? 'ONAYLANDI' :
                         order.status === 'preparing' ? 'HAZIRLANIYOR' :
                         order.status === 'delivered' ? 'TESL─░M ED─░LD─░' : '─░PTAL'}
                      </span>
                    </span>
                    <span className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleString('tr-TR')}
                    </span>
                    {order.status === 'preparing' && (
                      <span className="text-sm text-orange-600 font-medium">
                        Haz─▒rl─▒k s├╝resi: {calculateTotalPreparationTime(order)} dk
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                      <h4 className="font-medium text-gray-900 mb-2">Sipari┼ƒ Detaylar─▒:</h4>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              {item.quantity}x {getMenuItemName(item.menuItemId, (item as any).name)}
                            </span>
                            <span className="font-medium text-gray-900">
                              {(item.price * item.quantity).toFixed(2)}Γé║
                            </span>
                          </div>
                        ))}
                      </div>
                  </div>
                  
                  <div>
                      <h4 className="font-medium text-gray-900 mb-2">Sipari┼ƒ Bilgileri:</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Toplam Tutar:</span>
                          <span className="font-medium text-gray-900">{order.totalAmount.toFixed(2)}Γé║</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tahmini S├╝re:</span>
                          <span className="font-medium text-gray-900">
                            {calculateTotalPreparationTime(order)} dk
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>├ûdeme Durumu:</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.paymentStatus === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.paymentStatus === 'paid' ? '├ûDEND─░' : 'BEKLEMEDE'}
                          </span>
                        </div>
                      </div>
                  </div>
                  </div>
                  
                  {order.specialInstructions && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <p className="text-sm font-medium text-blue-900">├ûzel Talimatlar:</p>
                      <p className="text-sm text-blue-700">{order.specialInstructions}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  {order.status === 'pending' && (
                        <button
                      onClick={() => handleOrderStatusChange(order.id, 'preparing')}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm flex items-center space-x-2"
                        >
                      <Play className="w-4 h-4" />
                      <span>Haz─▒rl─▒─ƒa Ba┼ƒla</span>
                        </button>
                      )}
                  
                  {order.status === 'preparing' && (
                    <div className="flex items-center space-x-2">
                        <button
                      onClick={() => handleOrderStatusChange(order.id, 'delivered')}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center space-x-2"
                        >
                      <CheckCircle className="w-4 h-4" />
                      <span>Haz─▒r</span>
                        </button>
                        <button
                      onClick={() => setCancelOrderId(order.id)}
                      className="bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-600 p-2 rounded-lg transition-colors"
                      title="─░ptal Et"
                        >
                      <X className="w-4 h-4" />
                        </button>
                    </div>
                      )}
                  
                  {order.status === 'delivered' && (
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium text-center">
                      Γ£à Teslim Edildi
                      <div className="text-xs mt-1">
                        {order.deliveryTime && (
                          <>Haz─▒rl─▒k s├╝resi: {Math.round((new Date(order.deliveryTime).getTime() - new Date(order.createdAt).getTime()) / 60000)} dk</>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {order.status === 'cancelled' && (
                    <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg text-sm font-medium text-center">
                      Γ¥î ─░ptal Edildi
                    </div>
                  )}
                  
                        <button
                    onClick={() => setSelectedOrder(order)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm flex items-center space-x-2"
                        >
                    <Eye className="w-4 h-4" />
                    <span>Detaylar</span>
                        </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="hotel-card p-12 text-center">
            <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sipari┼ƒ Bulunamad─▒</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Arama kriterlerinize uygun sipari┼ƒ bulunamad─▒.' : 'Hen├╝z hi├º sipari┼ƒ bulunmuyor.'}
            </p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
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
              Sipari┼ƒ Detaylar─▒ - Oda {selectedOrder.roomId}
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Sipari┼ƒ ├£r├╝nleri:</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {item.quantity}x {getMenuItemName(item.menuItemId, (item as any).name)}
                        </p>
                        {item.specialRequests && (
                          <p className="text-sm text-gray-600">{item.specialRequests}</p>
                        )}
                      </div>
                      <span className="font-medium text-gray-900">
                        {(item.price * item.quantity).toFixed(2)}Γé║
                      </span>
                    </div>
                  ))}
                  </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Toplam Tutar:</span>
                  <span>{selectedOrder.totalAmount.toFixed(2)}Γé║</span>
                </div>
              </div>
              
              {selectedOrder.specialInstructions && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">├ûzel Talimatlar:</h4>
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
            </div>
          </div>
        </div>
      )}


      {/* ─░ptal Onay Modal─▒ */}
      {cancelOrderId && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setCancelOrderId(null)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Sipari┼ƒ ─░ptal Et
            </h3>
            
            <p className="text-gray-700 mb-6">
              Bu sipari┼ƒi iptal etmek istedi─ƒinizden emin misiniz? ─░ptal edilen sipari┼ƒler geri al─▒namaz.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setCancelOrderId(null)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Vazge├º
              </button>
              <button
                onClick={() => {
                  handleOrderStatusChange(cancelOrderId, 'cancelled');
                  setCancelOrderId(null);
                }}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                ─░ptal Et
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
