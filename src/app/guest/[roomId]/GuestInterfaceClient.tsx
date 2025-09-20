'use client';

import { useState, useEffect } from 'react';
import { useHotelStore } from '@/store/hotelStore';
import { sampleMenu, sampleHotelInfo } from '@/lib/sampleData';
import { translate } from '@/lib/translations';
import { Language, MenuItem, OrderItem } from '@/types';
import { 
  Hotel, 
  Wifi, 
  Clock, 
  Phone, 
  MapPin, 
  Star,
  ShoppingCart,
  Plus,
  Minus,
  CheckCircle,
  AlertCircle,
  Heart,
  Share2
} from 'lucide-react';

interface GuestInterfaceClientProps {
  roomId: string;
}

export default function GuestInterfaceClient({ roomId }: GuestInterfaceClientProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('tr');
  const [activeTab, setActiveTab] = useState<'menu' | 'info' | 'requests'>('menu');
  const [menu, setMenu] = useState<MenuItem[]>(sampleMenu);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCart, setShowCart] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const { hotelInfo } = useHotelStore();

  const categories = [
    { id: 'all', name: 'Tümü', icon: '🍽️' },
    { id: 'breakfast', name: 'Kahvaltı', icon: '🥐' },
    { id: 'appetizer', name: 'Mezeler', icon: '🥗' },
    { id: 'main', name: 'Ana Yemekler', icon: '🍖' },
    { id: 'dessert', name: 'Tatlılar', icon: '🍰' },
    { id: 'beverage', name: 'İçecekler', icon: '🥤' }
  ];

  const filteredMenu = menu.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesCategory && item.available;
  });

  const addToCart = (menuItem: MenuItem) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.menuItemId === menuItem.id);
      if (existingItem) {
        return prev.map(item =>
          item.menuItemId === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, {
          menuItemId: menuItem.id,
          quantity: 1,
          price: menuItem.price
        }];
      }
    });
  };

  const removeFromCart = (menuItemId: string) => {
    setCart(prev => prev.filter(item => item.menuItemId !== menuItemId));
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
    } else {
      setCart(prev => prev.map(item =>
        item.menuItemId === menuItemId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getMenuItemName = (menuItemId: string) => {
    const menuItem = menu.find(m => m.id === menuItemId);
    return menuItem?.name || 'Bilinmeyen Ürün';
  };

  const handlePlaceOrder = () => {
    // Order placement logic here
    console.log('Sipariş verildi:', { roomId, cart, totalAmount: getTotalAmount() });
    setOrderPlaced(true);
    setCart([]);
    setShowCart(false);
    
    // Reset order placed status after 3 seconds
    setTimeout(() => setOrderPlaced(false), 3000);
  };

  const quickRequests = [
    { id: 'towels', label: 'Havlu', icon: '🧺' },
    { id: 'cleaning', label: 'Oda Temizliği', icon: '🧹' },
    { id: 'maintenance', label: 'Bakım', icon: '🔧' },
    { id: 'concierge', label: 'Konsiyerj', icon: '🎩' },
    { id: 'pillows', label: 'Ekstra Yastık', icon: '🛏️' },
    { id: 'blankets', label: 'Ekstra Battaniye', icon: '🛌' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-hotel-cream to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-hotel-navy rounded-xl flex items-center justify-center">
                <Hotel className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Oda {roomId}</h1>
                <p className="text-gray-600">Grand Hotel - Misafir Arayüzü</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCart(true)}
                className="relative bg-hotel-gold text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors flex items-center space-x-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Sepet ({getCartItemCount()})</span>
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartItemCount()}
                  </span>
                )}
              </button>
              <select
                value={currentLanguage}
                onChange={(e) => setCurrentLanguage(e.target.value as Language)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1 bg-white"
              >
                <option value="tr">🇹🇷 Türkçe</option>
                <option value="de">🇩🇪 Deutsch</option>
                <option value="en">🇺🇸 English</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'menu', label: 'Oda Servisi', icon: '🍽️' },
              { id: 'info', label: 'Otel Bilgileri', icon: 'ℹ️' },
              { id: 'requests', label: 'Hızlı Talepler', icon: '⚡' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-hotel-gold text-hotel-gold'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'menu' && (
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex space-x-2 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'bg-hotel-gold text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMenu.map((item) => (
                <div key={item.id} className="hotel-card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{item.preparationTime} dk</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>4.5</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-hotel-gold">{item.price}₺</div>
                      {item.allergens && item.allergens.length > 0 && (
                        <div className="text-xs text-red-600 mt-1">
                          {item.allergens.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => addToCart(item)}
                      className="flex-1 bg-hotel-navy text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Sepete Ekle</span>
                    </button>
                    <button className="ml-2 p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                    <button className="ml-1 p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'info' && (
          <div className="space-y-6">
            <div className="hotel-card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Otel Bilgileri</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">İletişim</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{hotelInfo.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{hotelInfo.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Wifi className="w-4 h-4 text-gray-500" />
                      <span>WiFi: {hotelInfo.wifiPassword}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Saatler</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Giriş:</span>
                      <span>{hotelInfo.checkInTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Çıkış:</span>
                      <span>{hotelInfo.checkOutTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kahvaltı:</span>
                      <span>{hotelInfo.breakfastTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Öğle Yemeği:</span>
                      <span>{hotelInfo.lunchTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Akşam Yemeği:</span>
                      <span>{hotelInfo.dinnerTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hotel-card p-6">
              <h3 className="font-semibold text-gray-700 mb-4">Otel Kuralları</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {hotelInfo.rules.map((rule, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-hotel-gold mt-1">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hotel-card p-6">
              <h3 className="font-semibold text-gray-700 mb-4">Acil Durum İletişim</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="font-medium text-red-900">Resepsiyon</div>
                  <div className="text-red-700">{hotelInfo.emergencyContacts.reception}</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-900">Güvenlik</div>
                  <div className="text-blue-700">{hotelInfo.emergencyContacts.security}</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-900">Medikal</div>
                  <div className="text-green-700">{hotelInfo.emergencyContacts.medical}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div className="hotel-card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Hızlı Talepler</h2>
              <p className="text-gray-600 mb-6">İhtiyacınız olan hizmetler için tek tıkla talep oluşturun.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {quickRequests.map((request) => (
                  <button
                    key={request.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                  >
                    <div className="text-3xl mb-2">{request.icon}</div>
                    <div className="text-sm font-medium text-gray-900">{request.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Sepetim</h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Sepetiniz boş</p>
                </div>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.menuItemId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{getMenuItemName(item.menuItemId)}</h4>
                        <p className="text-sm text-gray-600">{item.price}₺</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Toplam:</span>
                      <span>{getTotalAmount().toFixed(2)}₺</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handlePlaceOrder}
                    className="w-full bg-hotel-gold text-white py-3 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                  >
                    Siparişi Tamamla
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order Success Notification */}
      {orderPlaced && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5" />
          <span>Siparişiniz başarıyla alındı!</span>
        </div>
      )}
    </div>
  );
}
