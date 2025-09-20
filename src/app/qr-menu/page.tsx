'use client';

import { useState, useEffect } from 'react';
import { useHotelStore } from '@/store/hotelStore';
import { sampleMenu } from '@/lib/sampleData';
import { translate } from '@/lib/translations';
import { Language, MenuItem, Order, OrderItem } from '@/types';
import { 
  QrCode, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Clock, 
  CreditCard,
  CheckCircle,
  Filter,
  Search,
  Star,
  Heart,
  Share2
} from 'lucide-react';

export default function QRMenuPage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('tr');
  const [menu, setMenu] = useState<MenuItem[]>(sampleMenu);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>('');

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
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && item.available;
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

  const handleCheckout = () => {
    // Generate order number
    const orderNum = `ORD-${Date.now().toString().slice(-6)}`;
    setOrderNumber(orderNum);
    setShowCheckout(true);
  };

  const handlePlaceOrder = () => {
    // Order placement logic here
    console.log('Sipariş verildi:', { orderNumber, cart, totalAmount: getTotalAmount() });
    
    // Clear cart and close checkout
    setCart([]);
    setShowCheckout(false);
    setShowCart(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-hotel-cream to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {translate('qr_menu_title', currentLanguage)}
                </h1>
                <p className="text-gray-600">
                  {translate('qr_menu_desc', currentLanguage)}
                </p>
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
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="hotel-card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Ürün ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                />
              </div>
            </div>
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
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {filteredMenu.length === 0 && (
          <div className="hotel-card p-12 text-center">
            <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ürün Bulunamadı</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Arama kriterlerinize uygun ürün bulunamadı.' : 'Bu kategoride ürün bulunmuyor.'}
            </p>
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
                    onClick={handleCheckout}
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

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sipariş Onayı</h3>
            
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-900">Sipariş Numarası: {orderNumber}</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Sipariş Özeti:</h4>
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.menuItemId} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.quantity}x {getMenuItemName(item.menuItemId)}
                      </span>
                      <span className="font-medium">{(item.price * item.quantity).toFixed(2)}₺</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Toplam Tutar:</span>
                  <span>{getTotalAmount().toFixed(2)}₺</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Ödeme Yöntemi:</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="payment" value="room_charge" defaultChecked className="text-hotel-gold" />
                    <span>Oda Hesabına Ekle</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="payment" value="cash" className="text-hotel-gold" />
                    <span>Nakit Ödeme</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="payment" value="card" className="text-hotel-gold" />
                    <span>Kart ile Ödeme</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCheckout(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handlePlaceOrder}
                className="flex-1 bg-hotel-gold text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Siparişi Ver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
