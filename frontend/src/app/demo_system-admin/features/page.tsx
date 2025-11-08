"use client";

import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Search,
  Filter,
  Save,
  AlertCircle,
  QrCode,
  Globe,
  Image,
  Zap,
  CreditCard,
  Smartphone,
  Bell,
  BarChart3,
  Shield,
  Settings
} from 'lucide-react';

export default function FeaturesManagement() {
  const [features, setFeatures] = useState([
    {
      id: '1',
      key: 'qr-code-system',
      name: 'QR Kod Sistemi',
      description: 'Her oda için özel QR kod ile misafirler anında menüye erişir',
      icon: 'QrCode',
      category: 'core',
      isActive: true,
      isPremium: false
    },
    {
      id: '2',
      key: 'multi-language',
      name: '9 Dil Desteği',
      description: 'AI destekli çeviri ile uluslararası misafirler için mükemmel deneyim',
      icon: 'Globe',
      category: 'core',
      isActive: true,
      isPremium: false
    },
    {
      id: '3',
      key: 'ai-image-enhancement',
      name: 'AI Görsel İyileştirme',
      description: 'Telefon çekimlerini profesyonel menü fotoğraflarına dönüştürün',
      icon: 'Image',
      category: 'premium',
      isActive: true,
      isPremium: true
    },
    {
      id: '4',
      key: 'real-time',
      name: 'Gerçek Zamanlı',
      description: 'Anlık bildirimler ve güncellemeler ile hızlı hizmet',
      icon: 'Zap',
      category: 'core',
      isActive: true,
      isPremium: false
    },
    {
      id: '5',
      key: 'integrated-payment',
      name: 'Entegre Ödeme',
      description: 'Güvenli ödeme sistemi ile oda servisi kolayca',
      icon: 'CreditCard',
      category: 'premium',
      isActive: true,
      isPremium: true
    },
    {
      id: '6',
      key: 'mobile-responsive',
      name: 'Mobil Uyumlu',
      description: 'Tüm cihazlarda mükemmel çalışan responsive tasarım',
      icon: 'Smartphone',
      category: 'core',
      isActive: true,
      isPremium: false
    },
    {
      id: '7',
      key: 'announcement-system',
      name: 'Duyuru Sistemi',
      description: 'Misafirlere özel kampanyalar ve duyurular gönderin',
      icon: 'Bell',
      category: 'premium',
      isActive: true,
      isPremium: true
    },
    {
      id: '8',
      key: 'detailed-analytics',
      name: 'Detaylı Analitik',
      description: 'Satış raporları ve müşteri davranış analizleri',
      icon: 'BarChart3',
      category: 'premium',
      isActive: true,
      isPremium: true
    },
    {
      id: '9',
      key: 'secure-system',
      name: 'Güvenli Sistem',
      description: 'Endüstri standardında güvenlik ve veri koruması',
      icon: 'Shield',
      category: 'core',
      isActive: true,
      isPremium: false
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState<any>(null);
  const [newFeature, setNewFeature] = useState({
    key: '',
    name: '',
    description: '',
    icon: 'Settings',
    category: 'core',
    isActive: true,
    isPremium: false
  });
  const [loading, setLoading] = useState(false);

  const iconMap: { [key: string]: any } = {
    QrCode,
    Globe,
    Image,
    Zap,
    CreditCard,
    Smartphone,
    Bell,
    BarChart3,
    Shield,
    Settings,
    Sparkles
  };

  const filteredFeatures = features.filter(feature => {
    const matchesSearch = feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || feature.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCreateFeature = () => {
    // TODO: API call
    const feature = {
      ...newFeature,
      id: Date.now().toString()
    };
    setFeatures([...features, feature]);
    setShowCreateModal(false);
    setNewFeature({
      key: '',
      name: '',
      description: '',
      icon: 'Settings',
      category: 'core',
      isActive: true,
      isPremium: false
    });
  };

  const handleEditFeature = (feature: any) => {
    setEditingFeature(feature);
    setNewFeature({
      key: feature.key,
      name: feature.name,
      description: feature.description,
      icon: feature.icon,
      category: feature.category,
      isActive: feature.isActive,
      isPremium: feature.isPremium
    });
    setShowEditModal(true);
  };

  const handleUpdateFeature = () => {
    // TODO: API call
    setFeatures(features.map(f => f.id === editingFeature.id ? { ...editingFeature, ...newFeature } : f));
    setShowEditModal(false);
    setEditingFeature(null);
  };

  const handleDeleteFeature = (id: string) => {
    if (confirm('Bu özelliği silmek istediğinize emin misiniz?')) {
      setFeatures(features.filter(f => f.id !== id));
    }
  };

  const handleToggleActive = (id: string) => {
    setFeatures(features.map(f => f.id === id ? { ...f, isActive: !f.isActive } : f));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Özellik Yönetimi</h1>
          <p className="text-gray-600 mt-1">Sistem özelliklerini yönetin ve düzenleyin</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Özellik
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Özellik ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tüm Kategoriler</option>
              <option value="core">Temel</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeatures.map((feature) => {
          const IconComponent = iconMap[feature.icon] || Settings;
          return (
            <div
              key={feature.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${
                    feature.category === 'premium' 
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
                      : 'bg-blue-100'
                  }`}>
                    <IconComponent className={`w-6 h-6 ${
                      feature.category === 'premium' ? 'text-white' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{feature.name}</h3>
                    {feature.isPremium && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                        Premium
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleToggleActive(feature.id)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    feature.isActive ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      feature.isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">{feature.description}</p>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span className="capitalize">{feature.category}</span>
                <span className="font-mono">{feature.key}</span>
              </div>

              <div className="flex space-x-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEditFeature(feature)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Düzenle
                </button>
                <button
                  onClick={() => handleDeleteFeature(feature.id)}
                  className="inline-flex items-center justify-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Feature Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Yeni Özellik Ekle</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Özellik Key *</label>
                  <input
                    type="text"
                    value={newFeature.key}
                    onChange={(e) => setNewFeature({ ...newFeature, key: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="qr-code-system"
                  />
                  <p className="text-xs text-gray-500 mt-1">URL'de kullanılacak benzersiz tanımlayıcı</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Özellik Adı *</label>
                  <input
                    type="text"
                    value={newFeature.name}
                    onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="QR Kod Sistemi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                  <textarea
                    value={newFeature.description}
                    onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Özellik açıklaması"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                    <select
                      value={newFeature.category}
                      onChange={(e) => setNewFeature({ ...newFeature, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="core">Temel</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">İkon</label>
                    <select
                      value={newFeature.icon}
                      onChange={(e) => setNewFeature({ ...newFeature, icon: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="QrCode">QR Kod</option>
                      <option value="Globe">Globe</option>
                      <option value="Image">Image</option>
                      <option value="Zap">Zap</option>
                      <option value="CreditCard">Credit Card</option>
                      <option value="Smartphone">Smartphone</option>
                      <option value="Bell">Bell</option>
                      <option value="BarChart3">Bar Chart</option>
                      <option value="Shield">Shield</option>
                      <option value="Settings">Settings</option>
                      <option value="Sparkles">Sparkles</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newFeature.isPremium}
                      onChange={(e) => setNewFeature({ ...newFeature, isPremium: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Premium Özellik</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newFeature.isActive}
                      onChange={(e) => setNewFeature({ ...newFeature, isActive: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Aktif</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  İptal
                </button>
                <button
                  onClick={handleCreateFeature}
                  disabled={!newFeature.key || !newFeature.name}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Oluştur
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Feature Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Özellik Düzenle</h3>
                <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Özellik Key *</label>
                  <input
                    type="text"
                    value={newFeature.key}
                    onChange={(e) => setNewFeature({ ...newFeature, key: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Özellik Adı *</label>
                  <input
                    type="text"
                    value={newFeature.name}
                    onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                  <textarea
                    value={newFeature.description}
                    onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                    <select
                      value={newFeature.category}
                      onChange={(e) => setNewFeature({ ...newFeature, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="core">Temel</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">İkon</label>
                    <select
                      value={newFeature.icon}
                      onChange={(e) => setNewFeature({ ...newFeature, icon: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="QrCode">QR Kod</option>
                      <option value="Globe">Globe</option>
                      <option value="Image">Image</option>
                      <option value="Zap">Zap</option>
                      <option value="CreditCard">Credit Card</option>
                      <option value="Smartphone">Smartphone</option>
                      <option value="Bell">Bell</option>
                      <option value="BarChart3">Bar Chart</option>
                      <option value="Shield">Shield</option>
                      <option value="Settings">Settings</option>
                      <option value="Sparkles">Sparkles</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newFeature.isPremium}
                      onChange={(e) => setNewFeature({ ...newFeature, isPremium: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Premium Özellik</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newFeature.isActive}
                      onChange={(e) => setNewFeature({ ...newFeature, isActive: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Aktif</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  İptal
                </button>
                <button
                  onClick={handleUpdateFeature}
                  disabled={!newFeature.key || !newFeature.name}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Güncelle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

