"use client";

import { useState, useEffect } from 'react';
import { 
  Crown, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  DollarSign,
  Calendar,
  Users,
  Star,
  TrendingUp,
  Save,
  AlertCircle
} from 'lucide-react';

export default function PlansManagement() {
  const [plans, setPlans] = useState([
    {
      id: '1',
      name: '6 Aylık Paket',
      description: 'En popüler seçenek! Orta vadeli taahhüt ile ideal fiyat/performans.',
      price: 430,
      originalPrice: 470,
      discount: 8,
      duration: 6,
      durationType: 'month',
      isPopular: true,
      isActive: true,
      features: [
        'Sınırsız QR Kod Üretimi',
        'Çoklu Dil Desteği (9 Dil)',
        'AI Görsel İyileştirme',
        'Detaylı Satış Raporları',
        'Mutfak & Resepsiyon Paneli',
        'Duyuru & Anket Sistemi',
        '7/24 Müşteri Desteği',
        'Otomatik Sistem Güncellemeleri',
        'Sosyal Medya Entegrasyonu',
        'Güvenli Ödeme Sistemi'
      ]
    },
    {
      id: '2',
      name: '1 Yıllık Paket',
      description: 'Uzun vadeli taahhüt ile maksimum tasarruf! En avantajlı seçenek.',
      price: 390,
      originalPrice: 470,
      discount: 17,
      duration: 12,
      durationType: 'month',
      isPopular: false,
      isActive: true,
      features: [
        'Sınırsız QR Kod Üretimi',
        'Çoklu Dil Desteği (9 Dil)',
        'AI Görsel İyileştirme',
        'Detaylı Satış Raporları',
        'Mutfak & Resepsiyon Paneli',
        'Duyuru & Anket Sistemi',
        '7/24 Müşteri Desteği',
        'Otomatik Sistem Güncellemeleri',
        'Sosyal Medya Entegrasyonu',
        'Güvenli Ödeme Sistemi'
      ]
    },
    {
      id: '3',
      name: 'Çoklu Şube Paketi',
      description: 'Otel zincirleri için özel! Merkezi yönetim ve kurumsal entegrasyon.',
      price: 350,
      originalPrice: 470,
      discount: 25,
      duration: null,
      durationType: 'custom',
      isPopular: false,
      isActive: true,
      features: [
        'Merkezi Şube Yönetimi',
        'Şubeler Arası Analiz',
        'Kurumsal API Entegrasyonu',
        'Sınırsız QR Kod Üretimi',
        'Çoklu Dil Desteği (9 Dil)',
        'AI Görsel İyileştirme',
        'Gelişmiş Raporlama',
        'Özel Markalama',
        'Dedicated Müşteri Temsilcisi',
        'Özel Eğitim Programı'
      ]
    }
  ]);

  const [pricing, setPricing] = useState({
    setupFee: 15000,
    trainingFee: 7500,
    minimumFee: 15000
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    discount: 0,
    duration: 6,
    durationType: 'month',
    isPopular: false,
    isActive: true,
    features: ['']
  });
  const [loading, setLoading] = useState(false);

  const handleCreatePlan = () => {
    // TODO: API call
    const plan = {
      ...newPlan,
      id: Date.now().toString(),
      features: newPlan.features.filter(f => f.trim() !== '')
    };
    setPlans([...plans, plan]);
    setShowCreateModal(false);
    setNewPlan({
      name: '',
      description: '',
      price: 0,
      originalPrice: 0,
      discount: 0,
      duration: 6,
      durationType: 'month',
      isPopular: false,
      isActive: true,
      features: ['']
    });
  };

  const handleEditPlan = (plan: any) => {
    setEditingPlan(plan);
    setNewPlan({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      originalPrice: plan.originalPrice,
      discount: plan.discount,
      duration: plan.duration || 6,
      durationType: plan.durationType || 'month',
      isPopular: plan.isPopular,
      isActive: plan.isActive,
      features: plan.features.length > 0 ? plan.features : ['']
    });
    setShowEditModal(true);
  };

  const handleUpdatePlan = () => {
    // TODO: API call
    setPlans(plans.map(p => p.id === editingPlan.id ? { ...editingPlan, ...newPlan, features: newPlan.features.filter(f => f.trim() !== '') } : p));
    setShowEditModal(false);
    setEditingPlan(null);
  };

  const handleDeletePlan = (id: string) => {
    if (confirm('Bu planı silmek istediğinize emin misiniz?')) {
      setPlans(plans.filter(p => p.id !== id));
    }
  };

  const handleToggleActive = (id: string) => {
    setPlans(plans.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  const handleUpdatePricing = () => {
    // TODO: API call
    setShowPricingModal(false);
  };

  const addFeature = () => {
    setNewPlan({ ...newPlan, features: [...newPlan.features, ''] });
  };

  const removeFeature = (index: number) => {
    setNewPlan({ ...newPlan, features: newPlan.features.filter((_, i) => i !== index) });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...newPlan.features];
    newFeatures[index] = value;
    setNewPlan({ ...newPlan, features: newFeatures });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plan Yönetimi</h1>
          <p className="text-gray-600 mt-1">Abonelik planlarını yönetin ve fiyatlandırmayı düzenleyin</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowPricingModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Fiyatlandırma Ayarları
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Yeni Plan
          </button>
        </div>
      </div>

      {/* Pricing Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Kurulum Ücreti</h3>
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{pricing.setupFee.toLocaleString('tr-TR')} TL</p>
          <p className="text-xs text-gray-500 mt-1">Tek seferlik ödeme</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Eğitim Ücreti</h3>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{pricing.trainingFee.toLocaleString('tr-TR')} TL</p>
          <p className="text-xs text-gray-500 mt-1">Tek seferlik ödeme</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Minimum Ücret</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{pricing.minimumFee.toLocaleString('tr-TR')} TL</p>
          <p className="text-xs text-gray-500 mt-1">Aylık minimum ödeme</p>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative ${
            plan.isPopular ? 'ring-2 ring-blue-500' : ''
          }`}
          >
            {plan.isPopular && (
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <Star className="w-3 h-3 mr-1" />
                  En Popüler
                </span>
              </div>
            )}

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <button
                  onClick={() => handleToggleActive(plan.id)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    plan.isActive ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      plan.isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <p className="text-sm text-gray-600">{plan.description}</p>
            </div>

            <div className="mb-4">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                <span className="ml-2 text-sm text-gray-600">TL</span>
                <span className="ml-2 text-sm text-gray-500">/oda/ay</span>
              </div>
              {plan.originalPrice > plan.price && (
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-400 line-through">{plan.originalPrice} TL</span>
                  <span className="ml-2 text-sm font-medium text-green-600">%{plan.discount} İndirim</span>
                </div>
              )}
              {plan.duration && (
                <p className="text-xs text-gray-500 mt-1">
                  {plan.duration} {plan.durationType === 'month' ? 'aylık' : 'yıllık'} peşin ödeme
                </p>
              )}
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Özellikler:</h4>
              <ul className="space-y-2">
                {plan.features.slice(0, 5).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
                {plan.features.length > 5 && (
                  <li className="text-xs text-gray-500">+{plan.features.length - 5} özellik daha</li>
                )}
              </ul>
            </div>

            <div className="flex space-x-2 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleEditPlan(plan)}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Edit className="w-4 h-4 mr-2" />
                Düzenle
              </button>
              <button
                onClick={() => handleDeletePlan(plan.id)}
                className="inline-flex items-center justify-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Plan Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Yeni Plan Ekle</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plan Adı *</label>
                  <input
                    type="text"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Örn: 6 Aylık Paket"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                  <textarea
                    value={newPlan.description}
                    onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Plan açıklaması"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat (TL) *</label>
                    <input
                      type="number"
                      value={newPlan.price}
                      onChange={(e) => setNewPlan({ ...newPlan, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Orijinal Fiyat (TL)</label>
                    <input
                      type="number"
                      value={newPlan.originalPrice}
                      onChange={(e) => setNewPlan({ ...newPlan, originalPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">İndirim (%)</label>
                    <input
                      type="number"
                      value={newPlan.discount}
                      onChange={(e) => setNewPlan({ ...newPlan, discount: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Süre</label>
                    <input
                      type="number"
                      value={newPlan.duration}
                      onChange={(e) => setNewPlan({ ...newPlan, duration: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Özellikler</label>
                  {newPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Özellik adı"
                      />
                      {newPlan.features.length > 1 && (
                        <button
                          onClick={() => removeFeature(index)}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addFeature}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Özellik Ekle
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newPlan.isPopular}
                      onChange={(e) => setNewPlan({ ...newPlan, isPopular: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">En Popüler</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newPlan.isActive}
                      onChange={(e) => setNewPlan({ ...newPlan, isActive: e.target.checked })}
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
                  onClick={handleCreatePlan}
                  disabled={!newPlan.name || !newPlan.price}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Oluştur
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Plan Düzenle</h3>
                <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plan Adı *</label>
                  <input
                    type="text"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                  <textarea
                    value={newPlan.description}
                    onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat (TL) *</label>
                    <input
                      type="number"
                      value={newPlan.price}
                      onChange={(e) => setNewPlan({ ...newPlan, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Orijinal Fiyat (TL)</label>
                    <input
                      type="number"
                      value={newPlan.originalPrice}
                      onChange={(e) => setNewPlan({ ...newPlan, originalPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Özellikler</label>
                  {newPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {newPlan.features.length > 1 && (
                        <button
                          onClick={() => removeFeature(index)}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addFeature}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Özellik Ekle
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newPlan.isPopular}
                      onChange={(e) => setNewPlan({ ...newPlan, isPopular: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">En Popüler</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newPlan.isActive}
                      onChange={(e) => setNewPlan({ ...newPlan, isActive: e.target.checked })}
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
                  onClick={handleUpdatePlan}
                  disabled={!newPlan.name || !newPlan.price}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Güncelle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Settings Modal */}
      {showPricingModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Fiyatlandırma Ayarları</h3>
                <button onClick={() => setShowPricingModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kurulum Ücreti (TL)</label>
                  <input
                    type="number"
                    value={pricing.setupFee}
                    onChange={(e) => setPricing({ ...pricing, setupFee: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Eğitim Ücreti (TL)</label>
                  <input
                    type="number"
                    value={pricing.trainingFee}
                    onChange={(e) => setPricing({ ...pricing, trainingFee: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Ücret (TL)</label>
                  <input
                    type="number"
                    value={pricing.minimumFee}
                    onChange={(e) => setPricing({ ...pricing, minimumFee: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-4">
                <button
                  onClick={() => setShowPricingModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  İptal
                </button>
                <button
                  onClick={handleUpdatePricing}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

