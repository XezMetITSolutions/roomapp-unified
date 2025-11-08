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
  AlertCircle,
  ArrowLeft,
  Crown,
  Star
} from 'lucide-react';
import { adminApiClient } from '@/contexts/AdminAuthContext';

export default function TenantManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [showBulkFeatureModal, setShowBulkFeatureModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [newTenant, setNewTenant] = useState({
    name: '',
    slug: '',
    domain: '',
    isActive: true,
    // Sahip Bilgileri
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    // Adres Bilgileri
    address: '',
    city: '',
    district: '',
    postalCode: '',
    // Admin Kullanıcı Bilgileri
    adminUsername: '',
    adminPassword: '',
    adminPasswordConfirm: '',
    // Plan ve Durum
    planId: '',
    status: 'pending'
  });
  const [plans, setPlans] = useState([
    {
      id: '1',
      name: '6 Aylık Paket',
      price: 430,
      originalPrice: 470,
      discount: 8,
      duration: 6,
      durationType: 'month',
      isPopular: true,
      limits: {
        maxRooms: null,
        maxMenuItems: null,
        maxStaff: null
      }
    },
    {
      id: '2',
      name: '1 Yıllık Paket',
      price: 390,
      originalPrice: 470,
      discount: 17,
      duration: 12,
      durationType: 'month',
      isPopular: false,
      limits: {
        maxRooms: null,
        maxMenuItems: null,
        maxStaff: null
      }
    },
    {
      id: '3',
      name: 'Çoklu Şube Paketi',
      price: 350,
      originalPrice: 470,
      discount: 25,
      duration: null,
      durationType: 'custom',
      isPopular: false,
      limits: {
        maxRooms: null,
        maxMenuItems: null,
        maxStaff: null
      }
    }
  ]);
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

  const handleCreateTenant = async () => {
    if (!newTenant.name || !newTenant.slug) {
      alert('İşletme adı ve slug gerekli');
      return;
    }

    if (newTenant.adminPassword !== newTenant.adminPasswordConfirm) {
      alert('Şifreler eşleşmiyor');
      return;
    }

    if (newTenant.adminPassword && newTenant.adminPassword.length < 6) {
      alert('Şifre en az 6 karakter olmalıdır');
      return;
    }

    try {
      setLoading(true);
      await adminApiClient.createTenant(newTenant);
      await loadTenants();
      setShowCreateModal(false);
      setNewTenant({
        name: '',
        slug: '',
        domain: '',
        isActive: true,
        ownerName: '',
        ownerEmail: '',
        ownerPhone: '',
        address: '',
        city: '',
        district: '',
        postalCode: '',
        adminUsername: '',
        adminPassword: '',
        adminPasswordConfirm: '',
        planId: '',
        status: 'pending'
      });
    } catch (error) {
      console.error('Error creating tenant:', error);
      alert('İşletme oluşturulurken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const selectedPlan = plans.find(p => p.id === newTenant.planId);


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

  const handleEditTenant = async (tenant: any) => {
    setSelectedTenant(tenant);
    // Tenant bilgilerini form'a yükle
    // Settings'den owner ve address bilgilerini al
    const settings = tenant.settings || {};
    const owner = settings.owner || {};
    const address = settings.address || {};
    
    setNewTenant({
      name: tenant.name || '',
      slug: tenant.slug || '',
      domain: tenant.domain || '',
      isActive: tenant.isActive !== undefined ? tenant.isActive : true,
      ownerName: owner.name || '',
      ownerEmail: owner.email || '',
      ownerPhone: owner.phone || '',
      address: address.address || '',
      city: address.city || '',
      district: address.district || '',
      postalCode: address.postalCode || '',
      adminUsername: '',
      adminPassword: '',
      adminPasswordConfirm: '',
      planId: settings.planId || '',
      status: settings.status || (tenant.isActive ? 'active' : 'pending')
    });

    // Admin kullanıcı bilgilerini yükle
    try {
      const adminData = await adminApiClient.getTenantAdminUser(tenant.id);
      setAdminUser(adminData.adminUser);
      if (adminData.adminUser) {
        setNewTenant(prev => ({
          ...prev,
          adminUsername: adminData.adminUser.email || ''
        }));
      }
    } catch (error) {
      console.error('Error loading admin user:', error);
      setAdminUser(null);
    }

    setShowEditModal(true);
  };

  const handleUpdateTenant = async () => {
    if (!selectedTenant || !newTenant.name || !newTenant.slug) {
      alert('İşletme adı ve slug gerekli');
      return;
    }

    try {
      setLoading(true);
      await adminApiClient.updateTenant(selectedTenant.id, {
        name: newTenant.name,
        slug: newTenant.slug,
        domain: newTenant.domain || null,
        isActive: newTenant.status === 'active',
        // Sahip Bilgileri
        ownerName: newTenant.ownerName,
        ownerEmail: newTenant.ownerEmail,
        ownerPhone: newTenant.ownerPhone,
        // Adres Bilgileri
        address: newTenant.address,
        city: newTenant.city,
        district: newTenant.district,
        postalCode: newTenant.postalCode,
        // Plan ve Durum
        planId: newTenant.planId,
        status: newTenant.status
      });

      // Eğer şifre değiştirilmek isteniyorsa
      if (newTenant.adminPassword && newTenant.adminPasswordConfirm) {
        if (newTenant.adminPassword !== newTenant.adminPasswordConfirm) {
          alert('Şifreler eşleşmiyor');
          setLoading(false);
          return;
        }
        if (newTenant.adminPassword.length < 6) {
          alert('Şifre en az 6 karakter olmalıdır');
          setLoading(false);
          return;
        }
        await adminApiClient.updateTenantAdminPassword(
          selectedTenant.id,
          newTenant.adminPassword,
          newTenant.adminPasswordConfirm
        );
      }

      alert('İşletme başarıyla güncellendi');
      setShowEditModal(false);
      setSelectedTenant(null);
      setAdminUser(null);
      await loadTenants();
    } catch (error) {
      console.error('Error updating tenant:', error);
      alert('İşletme güncellenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendTenant = async (tenant: any) => {
    if (!confirm(`${tenant.name} işletmesini ${tenant.isActive ? 'askıya almak' : 'aktif etmek'} istediğinize emin misiniz?`)) {
      return;
    }

    try {
      setLoading(true);
      await adminApiClient.updateTenant(tenant.id, { isActive: !tenant.isActive });
      alert('İşletme durumu güncellendi');
      await loadTenants();
    } catch (error) {
      console.error('Error updating tenant:', error);
      alert('İşletme durumu güncellenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTenant = async (tenant: any) => {
    if (!confirm(`${tenant.name} işletmesini silmek istediğinize emin misiniz? Bu işlem geri alınamaz!`)) {
      return;
    }

    try {
      setLoading(true);
      await adminApiClient.deleteTenant(tenant.id);
      alert('İşletme silindi');
      await loadTenants();
    } catch (error) {
      console.error('Error deleting tenant:', error);
      alert('İşletme silinirken hata oluştu');
    } finally {
      setLoading(false);
    }
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

  // İstatistikler
  const totalTenants = tenants.length;
  const activeTenants = tenants.filter(t => t.isActive).length;
  const totalUsers = tenants.reduce((sum, t) => sum + (t._count?.users || 0), 0);
  const monthlyRevenue = 0; // TODO: API'den gelecek

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
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
            <button
              onClick={() => setShowBulkFeatureModal(true)}
              disabled={selectedTenants.length === 0}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Settings className="w-4 h-4 mr-2" />
              Toplu Özellik Yönetimi
            </button>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Yeni İşletme
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">Toplam İşletme</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-gray-900">{totalTenants}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">{totalTenants} işletme kayıtlı</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">Aktif İşletme</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-gray-900">{activeTenants}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">{activeTenants} aktif işletme</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">{totalUsers} kullanıcı</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">Aylık Gelir</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-gray-900">₺{monthlyRevenue.toLocaleString()}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">Henüz veri yok</p>
            </div>
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

      {/* Create Tenant Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-6 border w-full max-w-4xl shadow-lg rounded-md bg-white my-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Yeni İşletme Oluştur</h2>
                <p className="text-sm text-gray-600 mt-1">Yeni işletme ve subdomain oluştur</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
              {/* Temel Bilgiler */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Temel Bilgiler</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İşletme Adı *
                    </label>
                    <input
                      type="text"
                      value={newTenant.name}
                      onChange={(e) => {
                        setNewTenant({ 
                          ...newTenant, 
                          name: e.target.value,
                          slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Örn: Grand Hotel Istanbul"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subdomain *
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={newTenant.slug}
                        onChange={(e) => setNewTenant({ ...newTenant, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="isletme-adi"
                      />
                      <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-600">
                        .roomxqr.com
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sahip Bilgileri */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sahip Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      value={newTenant.ownerName}
                      onChange={(e) => setNewTenant({ ...newTenant, ownerName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={newTenant.ownerEmail}
                      onChange={(e) => setNewTenant({ ...newTenant, ownerEmail: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      value={newTenant.ownerPhone}
                      onChange={(e) => setNewTenant({ ...newTenant, ownerPhone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Adres Bilgileri */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Adres Bilgileri</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adres *
                    </label>
                    <textarea
                      value={newTenant.address}
                      onChange={(e) => setNewTenant({ ...newTenant, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        İl *
                      </label>
                      <input
                        type="text"
                        value={newTenant.city}
                        onChange={(e) => setNewTenant({ ...newTenant, city: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        İlçe *
                      </label>
                      <input
                        type="text"
                        value={newTenant.district}
                        onChange={(e) => setNewTenant({ ...newTenant, district: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Posta Kodu
                      </label>
                      <input
                        type="text"
                        value={newTenant.postalCode}
                        onChange={(e) => setNewTenant({ ...newTenant, postalCode: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Kullanıcı Bilgileri */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Kullanıcı Bilgileri</h3>
                <p className="text-sm text-gray-600 mb-4">
                  İşletme için otomatik olarak bir admin kullanıcısı oluşturulacaktır.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kullanıcı Adı *
                    </label>
                    <input
                      type="text"
                      value={newTenant.adminUsername}
                      onChange={(e) => setNewTenant({ ...newTenant, adminUsername: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="admin veya işletme adı"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Şifre *
                    </label>
                    <input
                      type="password"
                      value={newTenant.adminPassword}
                      onChange={(e) => setNewTenant({ ...newTenant, adminPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="En az 6 karakter"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Şifre Tekrar *
                    </label>
                    <input
                      type="password"
                      value={newTenant.adminPasswordConfirm}
                      onChange={(e) => setNewTenant({ ...newTenant, adminPasswordConfirm: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Şifreyi tekrar girin"
                    />
                  </div>
                </div>
              </div>

              {/* Plan ve Durum */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan ve Durum</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Abonelik Planı
                    </label>
                    <select
                      value={newTenant.planId}
                      onChange={(e) => setNewTenant({ ...newTenant, planId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Plan seçin</option>
                      {plans.map(plan => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name} - {plan.price} TL/oda/ay
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durum
                    </label>
                    <select
                      value={newTenant.status}
                      onChange={(e) => setNewTenant({ ...newTenant, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Beklemede</option>
                      <option value="active">Aktif</option>
                      <option value="suspended">Askıya Alındı</option>
                    </select>
                  </div>
                </div>
                {selectedPlan && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm font-medium text-gray-900 mb-2">{selectedPlan.name} Limitleri:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {selectedPlan.limits.maxRooms && (
                        <li>• Maksimum Oda: {selectedPlan.limits.maxRooms}</li>
                      )}
                      {selectedPlan.limits.maxMenuItems && (
                        <li>• Maksimum Menü Ürünü: {selectedPlan.limits.maxMenuItems}</li>
                      )}
                      {selectedPlan.limits.maxStaff && (
                        <li>• Maksimum Personel: {selectedPlan.limits.maxStaff}</li>
                      )}
                      {!selectedPlan.limits.maxRooms && !selectedPlan.limits.maxMenuItems && !selectedPlan.limits.maxStaff && (
                        <li>• Sınırsız kullanım</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Planlar */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Mevcut Planlar</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        newTenant.planId === plan.id
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setNewTenant({ ...newTenant, planId: plan.id })}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                        {plan.isPopular && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 mr-1" />
                            Popüler
                          </span>
                        )}
                      </div>
                      <div className="mb-2">
                        <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                        <span className="text-sm text-gray-600"> TL/oda/ay</span>
                      </div>
                      {plan.originalPrice > plan.price && (
                        <div className="text-xs text-gray-500 mb-2">
                          <span className="line-through">{plan.originalPrice} TL</span>
                          <span className="ml-2 text-green-600 font-medium">%{plan.discount} İndirim</span>
                        </div>
                      )}
                      {plan.duration && (
                        <p className="text-xs text-gray-500">
                          {plan.duration} {plan.durationType === 'month' ? 'aylık' : 'yıllık'} peşin ödeme
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewTenant({
                    name: '',
                    slug: '',
                    domain: '',
                    isActive: true,
                    ownerName: '',
                    ownerEmail: '',
                    ownerPhone: '',
                    address: '',
                    city: '',
                    district: '',
                    postalCode: '',
                    adminUsername: '',
                    adminPassword: '',
                    adminPasswordConfirm: '',
                    planId: '',
                    status: 'pending'
                  });
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleCreateTenant}
                disabled={loading || !newTenant.name || !newTenant.slug || !newTenant.ownerName || !newTenant.ownerEmail || !newTenant.ownerPhone || !newTenant.address || !newTenant.city || !newTenant.district || !newTenant.adminUsername || !newTenant.adminPassword || !newTenant.adminPasswordConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Oluşturuluyor...' : 'İşletme Oluştur'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tenant Modal */}
      {showEditModal && selectedTenant && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-6 border w-full max-w-4xl shadow-lg rounded-md bg-white my-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">İşletme Düzenle</h2>
                <p className="text-sm text-gray-600 mt-1">İşletme bilgilerini güncelle</p>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedTenant(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
              {/* Temel Bilgiler */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Temel Bilgiler</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İşletme Adı *
                    </label>
                    <input
                      type="text"
                      value={newTenant.name}
                      onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Örn: Grand Hotel Istanbul"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subdomain *
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={newTenant.slug}
                        onChange={(e) => setNewTenant({ ...newTenant, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="isletme-adi"
                      />
                      <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-600">
                        .roomxqr.com
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sahip Bilgileri */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sahip Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      value={newTenant.ownerName}
                      onChange={(e) => setNewTenant({ ...newTenant, ownerName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={newTenant.ownerEmail}
                      onChange={(e) => setNewTenant({ ...newTenant, ownerEmail: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      value={newTenant.ownerPhone}
                      onChange={(e) => setNewTenant({ ...newTenant, ownerPhone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Adres Bilgileri */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Adres Bilgileri</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adres *
                    </label>
                    <textarea
                      value={newTenant.address}
                      onChange={(e) => setNewTenant({ ...newTenant, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        İl *
                      </label>
                      <input
                        type="text"
                        value={newTenant.city}
                        onChange={(e) => setNewTenant({ ...newTenant, city: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        İlçe *
                      </label>
                      <input
                        type="text"
                        value={newTenant.district}
                        onChange={(e) => setNewTenant({ ...newTenant, district: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Posta Kodu
                      </label>
                      <input
                        type="text"
                        value={newTenant.postalCode}
                        onChange={(e) => setNewTenant({ ...newTenant, postalCode: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Kullanıcı Bilgileri */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Kullanıcı Bilgileri</h3>
                {adminUser ? (
                  <div className="space-y-4">
                    <div className="bg-white rounded-md p-4 border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                          <p className="text-sm font-medium text-gray-900">{adminUser.email}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Ad Soyad</label>
                          <p className="text-sm font-medium text-gray-900">{adminUser.firstName} {adminUser.lastName}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Rol</label>
                          <p className="text-sm font-medium text-gray-900">{adminUser.role}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Durum</label>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            adminUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {adminUser.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                        </div>
                        {adminUser.lastLogin && (
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Son Giriş</label>
                            <p className="text-sm text-gray-600">{new Date(adminUser.lastLogin).toLocaleDateString('tr-TR')}</p>
                          </div>
                        )}
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Oluşturulma</label>
                          <p className="text-sm text-gray-600">{new Date(adminUser.createdAt).toLocaleDateString('tr-TR')}</p>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Şifre Değiştir</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Yeni Şifre
                          </label>
                          <input
                            type="password"
                            value={newTenant.adminPassword}
                            onChange={(e) => setNewTenant({ ...newTenant, adminPassword: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Yeni şifre (boş bırakılırsa değişmez)"
                          />
                          <p className="text-xs text-gray-500 mt-1">En az 6 karakter</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Şifre Tekrar
                          </label>
                          <input
                            type="password"
                            value={newTenant.adminPasswordConfirm}
                            onChange={(e) => setNewTenant({ ...newTenant, adminPasswordConfirm: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Şifreyi tekrar girin"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Not: Şifre alanlarını boş bırakırsanız şifre değişmez.</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <p className="text-sm text-gray-500 mt-2">Admin kullanıcı bilgileri yükleniyor...</p>
                  </div>
                )}
              </div>

              {/* Plan ve Durum */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan ve Durum</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Abonelik Planı
                    </label>
                    <select
                      value={newTenant.planId}
                      onChange={(e) => setNewTenant({ ...newTenant, planId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Plan seçin</option>
                      {plans.map(plan => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name} - {plan.price} TL/oda/ay
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durum
                    </label>
                    <select
                      value={newTenant.status}
                      onChange={(e) => setNewTenant({ ...newTenant, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Beklemede</option>
                      <option value="active">Aktif</option>
                      <option value="suspended">Askıya Alındı</option>
                    </select>
                  </div>
                </div>
                {selectedPlan && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm font-medium text-gray-900 mb-2">{selectedPlan.name} Limitleri:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {selectedPlan.limits.maxRooms && (
                        <li>• Maksimum Oda: {selectedPlan.limits.maxRooms}</li>
                      )}
                      {selectedPlan.limits.maxMenuItems && (
                        <li>• Maksimum Menü Ürünü: {selectedPlan.limits.maxMenuItems}</li>
                      )}
                      {selectedPlan.limits.maxStaff && (
                        <li>• Maksimum Personel: {selectedPlan.limits.maxStaff}</li>
                      )}
                      {!selectedPlan.limits.maxRooms && !selectedPlan.limits.maxMenuItems && !selectedPlan.limits.maxStaff && (
                        <li>• Sınırsız kullanım</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedTenant(null);
                  setAdminUser(null);
                  setNewTenant({
                    name: '',
                    slug: '',
                    domain: '',
                    isActive: true,
                    ownerName: '',
                    ownerEmail: '',
                    ownerPhone: '',
                    address: '',
                    city: '',
                    district: '',
                    postalCode: '',
                    adminUsername: '',
                    adminPassword: '',
                    adminPasswordConfirm: '',
                    planId: '',
                    status: 'pending'
                  });
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleUpdateTenant}
                disabled={loading || !newTenant.name || !newTenant.slug}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Güncelleniyor...' : 'Güncelle'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
