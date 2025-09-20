'use client';

import { useState, useEffect } from 'react';
import { useHotelStore } from '@/store/hotelStore';
import { sampleOrders, sampleMenu } from '@/lib/sampleData';
import { translate } from '@/lib/translations';
import { Language, Order, MenuItem } from '@/types';
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
  Plus,
  Edit,
  Eye,
  Timer
} from 'lucide-react';

export default function KitchenPanel() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('tr');
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [menu, setMenu] = useState<MenuItem[]>(sampleMenu);
  const [filter, setFilter] = useState<'all' | 'pending' | 'preparing' | 'ready'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showMenuModal, setShowMenuModal] = useState(false);

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = order.roomId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => 
        menu.find(m => m.id === item.menuItemId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesFilter && matchesSearch;
  });

  const handleOrderStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            status: newStatus,
            ...(newStatus === 'ready' && { deliveryTime: new Date() })
          }
        : order
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <AlertCircle className="w-4 h-4" />;
      case 'preparing': return <Play className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
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

  const getMenuItemName = (menuItemId: string) => {
    const menuItem = menu.find(m => m.id === menuItemId);
    return menuItem?.name || 'Bilinmeyen Ürün';
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
              <button
                onClick={() => setShowMenuModal(true)}
                className="bg-hotel-gold text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Menü Yönetimi</span>
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

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="hotel-card p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {orders.filter(o => o.status === 'pending').length}
            </h3>
            <p className="text-gray-600">Bekleyen Siparişler</p>
                      </div>
          <div className="hotel-card p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Play className="w-6 h-6 text-orange-600" />
                                </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {orders.filter(o => o.status === 'preparing').length}
                                </h3>
            <p className="text-gray-600">Hazırlanan Siparişler</p>
                                      </div>
          <div className="hotel-card p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {orders.filter(o => o.status === 'ready').length}
            </h3>
            <p className="text-gray-600">Hazır Siparişler</p>
                                </div>
          <div className="hotel-card p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Timer className="w-6 h-6 text-blue-600" />
                                  </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {orders.filter(o => o.status === 'delivered').length}
            </h3>
            <p className="text-gray-600">Teslim Edilen</p>
                            </div>
                          </div>

        {/* Filters and Search */}
        <div className="hotel-card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
                                  <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Oda numarası veya ürün ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                />
                                    </div>
                                      </div>
            <div className="flex space-x-2">
              {[
                { id: 'all', label: 'Tümü', count: orders.length },
                { id: 'pending', label: 'Bekleyen', count: orders.filter(o => o.status === 'pending').length },
                { id: 'preparing', label: 'Hazırlanan', count: orders.filter(o => o.status === 'preparing').length },
                { id: 'ready', label: 'Hazır', count: orders.filter(o => o.status === 'ready').length }
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
                         order.status === 'ready' ? 'HAZIR' :
                         order.status === 'delivered' ? 'TESLİM EDİLDİ' : 'İPTAL'}
                      </span>
                    </span>
                    <span className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleString('tr-TR')}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                      <h4 className="font-medium text-gray-900 mb-2">Sipariş Detayları:</h4>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              {item.quantity}x {getMenuItemName(item.menuItemId)}
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
                          <span>Tahmini Süre:</span>
                          <span className="font-medium text-gray-900">
                            {calculateTotalPreparationTime(order)} dk
                          </span>
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
                  {order.status === 'pending' && (
                        <button
                      onClick={() => handleOrderStatusChange(order.id, 'preparing')}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm flex items-center space-x-2"
                        >
                      <Play className="w-4 h-4" />
                      <span>Hazırlığa Başla</span>
                        </button>
                      )}
                  
                  {order.status === 'preparing' && (
                        <button
                      onClick={() => handleOrderStatusChange(order.id, 'ready')}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center space-x-2"
                        >
                      <CheckCircle className="w-4 h-4" />
                      <span>Hazır Olarak İşaretle</span>
                        </button>
                      )}
                  
                  {order.status === 'ready' && (
                        <button
                      onClick={() => handleOrderStatusChange(order.id, 'delivered')}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center space-x-2"
                        >
                      <CheckCircle className="w-4 h-4" />
                      <span>Teslim Edildi</span>
                        </button>
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sipariş Bulunamadı</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Arama kriterlerinize uygun sipariş bulunamadı.' : 'Henüz hiç sipariş bulunmuyor.'}
            </p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
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
                          {item.quantity}x {getMenuItemName(item.menuItemId)}
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
            </div>
          </div>
        </div>
      )}

      {/* Menu Management Modal */}
      {showMenuModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Menü Yönetimi</h3>
            
            <div className="space-y-4">
              {menu.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>{item.price}₺</span>
                      <span>{item.preparationTime} dk</span>
                      <span className="capitalize">{item.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setMenu(prev => prev.map(m => 
                          m.id === item.id ? { ...m, available: !m.available } : m
                        ));
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.available ? 'Mevcut' : 'Mevcut Değil'}
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowMenuModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Kapat
              </button>
            </div>
        </div>
      </div>
      )}
    </div>
  );
}