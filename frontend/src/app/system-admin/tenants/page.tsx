"use client";

import { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Globe, 
  Calendar,
  Users,
  DollarSign,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Settings,
  ToggleLeft,
  ToggleRight,
  Save,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { adminApiClient } from '@/contexts/AdminAuthContext';

export default function TenantManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [showBulkFeatureModal, setShowBulkFeatureModal] = useState(false);
  const [tenants, setTenants] = useState<any[]>([]);
  const [availableFeatures, setAvailableFeatures] = useState<any[]>([]);
  const [tenantFeatures, setTenantFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTenants, setSelectedTenants] = useState<string[]>([]);
  const [bulkFeatureKey, setBulkFeatureKey] = useState('');
  const [bulkFeatureEnabled, setBulkFeatureEnabled] = useState(false);

  // Tenant'ları yükle
  useEffect(() => {
    loadTenants();
    loadAvailableFeatures();
  }, []);

  const loadTenants = async () => {
    try {
      setLoading(true);
      const data = await adminApiClient.getTenants();
      setTenants(data.tenants || []);
    } catch (error) {
      console.error('Error loading tenants:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableFeatures = async () => {
    try {
      const data = await adminApiClient.getAvailableFeatures();
      setAvailableFeatures(data.features || []);
    } catch (error) {
      console.error('Error loading available features:', error);
    }
  };

  const loadTenantFeatures = async (tenantId: string) => {
    try {
      const data = await adminApiClient.getTenantFeatures(tenantId);
      setTenantFeatures(data.features || []);
    } catch (error) {
      console.error('Error loading tenant features:', error);
    }
  };

  const toggleTenantFeature = async (tenantId: string, featureKey: string, enabled: boolean) => {
    try {
      await adminApiClient.updateTenantFeature(tenantId, featureKey, enabled);
      await loadTenantFeatures(tenantId);
      await loadTenants(); // Tenant listesini güncelle
    } catch (error) {
      console.error('Error toggling feature:', error);
    }
  };

  const bulkUpdateFeatures = async () => {
    if (!bulkFeatureKey || selectedTenants.length === 0) return;

    try {
      setLoading(true);
      await adminApiClient.bulkUpdateFeatures(selectedTenants, bulkFeatureKey, bulkFeatureEnabled);
      await loadTenants();
      setSelectedTenants([]);
      setShowBulkFeatureModal(false);
      setBulkFeatureKey('');
      setBulkFeatureEnabled(false);
    } catch (error) {
      console.error('Error bulk updating features:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTenantSelect = (tenantId: string, checked: boolean) => {
    if (checked) {
      setSelectedTenants([...selectedTenants, tenantId]);
    } else {
      setSelectedTenants(selectedTenants.filter(id => id !== tenantId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTenants(filteredTenants.map(tenant => tenant.id));
    } else {
      setSelectedTenants([]);
    }
  };

  // Filtreleme
  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tenant.isActive === (statusFilter === 'active');
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Aktif' : 'Pasif';
  };

  const handleViewTenant = (tenant: any) => {
    setSelectedTenant(tenant);
    setShowModal(true);
  };

  const handleManageFeatures = async (tenant: any) => {
    setSelectedTenant(tenant);
    await loadTenantFeatures(tenant.id);
    setShowFeatureModal(true);
  };

  const handleEditTenant = (tenant: any) => {
    // Edit functionality
    console.log('Edit tenant:', tenant);
  };

  const handleSuspendTenant = (tenant: any) => {
    // Suspend functionality
    console.log('Suspend tenant:', tenant);
  };

  const handleDeleteTenant = (tenant: any) => {
    // Delete functionality
    console.log('Delete tenant:', tenant);
  };

  const isFeatureEnabled = (featureKey: string) => {
    return tenantFeatures.some(f => f.featureKey === featureKey && f.enabled);
  };

  const getFeatureName = (featureKey: string) => {
    const feature = availableFeatures.find(f => f.key === featureKey);
    return feature ? feature.name : featureKey;
  };

  const getFeatureDescription = (featureKey: string) => {
    const feature = availableFeatures.find(f => f.key === featureKey);
    return feature ? feature.description : '';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">İşletme Yönetimi</h1>
            <p className="mt-2 text-sm text-gray-600">
              Tüm işletmeleri yönetin, özelliklerini kontrol edin ve toplu işlemler yapın
            </p>
        </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={() => setShowBulkFeatureModal(true)}
              disabled={selectedTenants.length === 0}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Settings className="w-4 h-4 mr-2" />
              Toplu Özellik Yönetimi
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Yeni İşletme
        </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="İşletme adı, slug veya domain ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tümü</option>
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tenant List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              İşletmeler ({filteredTenants.length})
            </h3>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedTenants.length === filteredTenants.length && filteredTenants.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Tümünü Seç</span>
          </div>
        </div>
      </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Yükleniyor...</p>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seç
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşletme
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İstatistikler
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Oluşturulma
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedTenants.includes(tenant.id)}
                        onChange={(e) => handleTenantSelect(tenant.id, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-blue-600" />
                          </div>
                      </div>
                        <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                          <div className="text-sm text-gray-500">{tenant.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(tenant.isActive)}`}>
                        {getStatusText(tenant.isActive)}
                    </span>
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-4">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-400 mr-1" />
                          {tenant._count?.users || 0}
                        </div>
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 text-gray-400 mr-1" />
                          {tenant._count?.hotels || 0}
                        </div>
                        <div className="flex items-center">
                          <Activity className="h-4 w-4 text-gray-400 mr-1" />
                          {tenant._count?.orders || 0}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(tenant.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewTenant(tenant)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleManageFeatures(tenant)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Settings className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditTenant(tenant)}
                          className="text-yellow-600 hover:text-yellow-900"
                      >
                          <Edit className="h-4 w-4" />
                      </button>
                        <button
                          onClick={() => handleDeleteTenant(tenant)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Tenant Detail Modal */}
      {showModal && selectedTenant && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">{selectedTenant.name}</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Slug</label>
                  <p className="text-sm text-gray-900">{selectedTenant.slug}</p>
                    </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Durum</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedTenant.isActive)}`}>
                    {getStatusText(selectedTenant.isActive)}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">İstatistikler</label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <div className="text-center">
                      <div className="text-lg font-semibold">{selectedTenant._count?.users || 0}</div>
                      <div className="text-xs text-gray-500">Kullanıcı</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{selectedTenant._count?.hotels || 0}</div>
                      <div className="text-xs text-gray-500">Otel</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{selectedTenant._count?.orders || 0}</div>
                      <div className="text-xs text-gray-500">Sipariş</div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Oluşturulma Tarihi</label>
                  <p className="text-sm text-gray-900">{new Date(selectedTenant.createdAt).toLocaleDateString('tr-TR')}</p>
                  </div>
                </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Kapat
                  </button>
                  <button
                  onClick={() => {
                    setShowModal(false);
                    handleManageFeatures(selectedTenant);
                  }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                  Özellikleri Yönet
                  </button>
                </div>
              </div>
            </div>
          </div>
      )}

      {/* Feature Management Modal */}
      {showFeatureModal && selectedTenant && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedTenant.name} - Özellik Yönetimi</h3>
                  <p className="text-sm text-gray-500">İşletmenin özelliklerini açıp kapatabilirsiniz</p>
                </div>
                <button
                  onClick={() => setShowFeatureModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableFeatures.map((feature) => {
                  const isEnabled = isFeatureEnabled(feature.key);
                  return (
                    <div key={feature.key} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{feature.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${
                            feature.category === 'temel' ? 'bg-green-100 text-green-800' :
                            feature.category === 'gelişmiş' ? 'bg-blue-100 text-blue-800' :
                            feature.category === 'destek' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {feature.category}
                          </span>
        </div>
                        <button
                          onClick={() => toggleTenantFeature(selectedTenant.id, feature.key, !isEnabled)}
                          className={`ml-4 flex items-center ${
                            isEnabled ? 'text-green-600' : 'text-gray-400'
                          }`}
                        >
                          {isEnabled ? (
                            <ToggleRight className="h-6 w-6" />
                          ) : (
                            <ToggleLeft className="h-6 w-6" />
                          )}
                        </button>
      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200 mt-6">
                <button
                  onClick={() => setShowFeatureModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Feature Management Modal */}
      {showBulkFeatureModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Toplu Özellik Yönetimi</h3>
                <button
                  onClick={() => setShowBulkFeatureModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seçili İşletmeler ({selectedTenants.length})
                  </label>
                  <div className="max-h-32 overflow-y-auto border rounded p-2">
                    {selectedTenants.map(tenantId => {
                      const tenant = tenants.find(t => t.id === tenantId);
                      return (
                        <div key={tenantId} className="text-sm text-gray-600 py-1">
                          {tenant?.name || tenantId}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Özellik</label>
                  <select
                    value={bulkFeatureKey}
                    onChange={(e) => setBulkFeatureKey(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Özellik seçin</option>
                    {availableFeatures.map(feature => (
                      <option key={feature.key} value={feature.key}>
                        {feature.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="bulkFeatureEnabled"
                        checked={bulkFeatureEnabled === true}
                        onChange={() => setBulkFeatureEnabled(true)}
                        className="mr-2"
                      />
                      Açık
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="bulkFeatureEnabled"
                        checked={bulkFeatureEnabled === false}
                        onChange={() => setBulkFeatureEnabled(false)}
                        className="mr-2"
                      />
                      Kapalı
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-4">
                <button
                  onClick={() => setShowBulkFeatureModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={bulkUpdateFeatures}
                  disabled={!bulkFeatureKey || selectedTenants.length === 0 || loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Güncelleniyor...' : 'Güncelle'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
