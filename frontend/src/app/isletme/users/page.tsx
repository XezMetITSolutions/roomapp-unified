"use client";

import { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search,
  Filter,
  Shield,
  User,
  UserCheck,
  Clock,
  Mail,
  Phone,
  X
} from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF' | 'RECEPTION' | 'KITCHEN' | 'WAITER';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  hotelId: string;
  password?: string;
  permissions?: string[];
}

export default function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // İşletme paneli sayfaları
  const availablePages = [
    { key: 'dashboard', label: 'Dashboard', description: 'Genel görünüm ve istatistikler' },
    { key: 'analytics', label: 'Analitik', description: 'Ciro ve detaylı raporlar' },
    { key: 'menu', label: 'Menü Yönetimi', description: 'Menü düzenleme ve fiyat belirleme' },
    { key: 'users', label: 'Kullanıcı Yönetimi', description: 'Personel ekleme/çıkarma' },
    { key: 'announcements', label: 'Duyurular', description: 'Misafirlere duyuru gönderme' },
    { key: 'qr-kod', label: 'QR Kod', description: 'QR kod oluşturma' },
    { key: 'notifications', label: 'Bildirimler', description: 'Misafir talepleri' },
    { key: 'settings', label: 'Ayarlar', description: 'Sistem ayarları' },
    { key: 'support', label: 'Destek', description: 'Yardım sayfası' },
  ];

  // Mock data
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      email: 'ahmet@hotel.com',
      phone: '+90 555 123 4567',
      role: 'ADMIN',
      isActive: true,
      lastLogin: '2024-01-15T10:30:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      hotelId: 'hotel-1',
      permissions: ['dashboard', 'analytics', 'menu', 'users', 'announcements', 'qr-kod', 'notifications', 'settings', 'support'],
    },
    {
      id: '2',
      firstName: 'Ayşe',
      lastName: 'Kaya',
      email: 'ayse@hotel.com',
      phone: '+90 555 234 5678',
      role: 'MANAGER',
      isActive: true,
      lastLogin: '2024-01-15T09:15:00Z',
      createdAt: '2024-01-02T00:00:00Z',
      hotelId: 'hotel-1',
      permissions: ['dashboard', 'menu', 'announcements', 'qr-kod', 'notifications'],
    },
    {
      id: '3',
      firstName: 'Mehmet',
      lastName: 'Demir',
      email: 'mehmet@hotel.com',
      role: 'RECEPTION',
      isActive: true,
      lastLogin: '2024-01-15T08:45:00Z',
      createdAt: '2024-01-03T00:00:00Z',
      hotelId: 'hotel-1',
      permissions: ['dashboard', 'qr-kod', 'notifications'],
    },
    {
      id: '4',
      firstName: 'Fatma',
      lastName: 'Özkan',
      email: 'fatma@hotel.com',
      phone: '+90 555 345 6789',
      role: 'KITCHEN',
      isActive: false,
      lastLogin: '2024-01-10T16:20:00Z',
      createdAt: '2024-01-04T00:00:00Z',
      hotelId: 'hotel-1',
      permissions: ['dashboard', 'menu'],
    },
    {
      id: '5',
      firstName: 'Ali',
      lastName: 'Çelik',
      email: 'ali@hotel.com',
      role: 'WAITER',
      isActive: true,
      lastLogin: '2024-01-15T11:00:00Z',
      createdAt: '2024-01-05T00:00:00Z',
      hotelId: 'hotel-1',
      permissions: ['dashboard', 'notifications'],
    },
  ]);

  const roles = [
    { value: 'all', label: 'Tüm Roller' },
    { value: 'ADMIN', label: 'Yönetici' },
    { value: 'MANAGER', label: 'Müdür' },
    { value: 'STAFF', label: 'Personel' },
    { value: 'RECEPTION', label: 'Resepsiyon' },
    { value: 'KITCHEN', label: 'Mutfak' },
    { value: 'WAITER', label: 'Garson' },
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="w-4 h-4 text-red-600" />;
      case 'MANAGER':
        return <UserCheck className="w-4 h-4 text-blue-600" />;
      case 'RECEPTION':
        return <User className="w-4 h-4 text-green-600" />;
      case 'KITCHEN':
        return <User className="w-4 h-4 text-orange-600" />;
      case 'WAITER':
        return <User className="w-4 h-4 text-purple-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'MANAGER':
        return 'bg-blue-100 text-blue-800';
      case 'RECEPTION':
        return 'bg-green-100 text-green-800';
      case 'KITCHEN':
        return 'bg-orange-100 text-orange-800';
      case 'WAITER':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    const roleObj = roles.find(r => r.value === role);
    return roleObj ? roleObj.label : role;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const toggleActive = (id: string) => {
    setUsers(users => 
      users.map(user => 
        user.id === id ? { ...user, isActive: !user.isActive } : user
      )
    );
  };

  const deleteUser = (id: string) => {
    if (confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      setUsers(users => users.filter(user => user.id !== id));
    }
  };

  const editUser = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const addNewUser = () => {
    setSelectedUser(null);
    setShowAddModal(true);
  };

  const managePermissions = (user: User) => {
    setSelectedUser(user);
    setSelectedPermissions(user.permissions || []);
    setShowPermissionsModal(true);
  };

  const savePermissions = () => {
    if (selectedUser) {
      setUsers(users => 
        users.map(user => 
          user.id === selectedUser.id ? { ...user, permissions: selectedPermissions } : user
        )
      );
      setShowPermissionsModal(false);
      setSelectedUser(null);
    }
  };

  const togglePermission = (pageKey: string) => {
    // Her zaman tıklanabilir olmalı, rol kontrolü yok
    setSelectedPermissions(prev => 
      prev.includes(pageKey) 
        ? prev.filter(p => p !== pageKey)
        : [...prev, pageKey]
    );
  };

  const saveUser = (userData: Partial<User>) => {
    if (selectedUser) {
      // Edit existing user
      setUsers(users => 
        users.map(user => 
          user.id === selectedUser.id ? { ...user, ...userData } : user
        )
      );
      setShowEditModal(false);
    } else {
      // Add new user
      const newUser: User = {
        id: Date.now().toString(),
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone,
        role: userData.role || 'STAFF',
        isActive: userData.isActive ?? true,
        lastLogin: undefined,
        createdAt: new Date().toISOString(),
        hotelId: 'hotel-1',
        password: 'temp123', // Gerçek uygulamada hash'lenecek
        permissions: ['dashboard'], // Varsayılan olarak sadece dashboard
        ...userData
      };
      setUsers(users => [...users, newUser]);
      setShowAddModal(false);
    }
    setSelectedUser(null);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || undefined,
      role: formData.get('role') as any,
      password: formData.get('password') as string || undefined,
    };
    saveUser(userData);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
            <p className="text-gray-600">Personel hesaplarını yönetin ve yetkilendirin</p>
          </div>
          <button
            onClick={addNewUser}
            className="bg-hotel-gold text-white px-4 py-2 rounded-lg hover:bg-hotel-navy transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Yeni kullanıcı ekle"
          >
            <Plus className="w-5 h-5" />
            <span>Kullanıcı Ekle</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="hotel-card p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Kullanıcı ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
            >
              {roles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filtrele</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="hotel-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İletişim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Son Giriş
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yetkiler
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-hotel-gold flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(user.role)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center space-x-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="text-sm text-gray-500 flex items-center space-x-1 mt-1">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.lastLogin ? (
                      <div className="text-sm text-gray-900">
                        {new Date(user.lastLogin).toLocaleDateString('tr-TR')}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Hiç giriş yapmamış</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">{user.permissions?.length || 0}</span> sayfa
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.permissions?.slice(0, 2).map(p => {
                        const page = availablePages.find(ap => ap.key === p);
                        return page?.label;
                      }).join(', ')}
                      {user.permissions && user.permissions.length > 2 && '...'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => managePermissions(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Yetkileri Yönet"
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleActive(user.id)}
                        className={`p-2 rounded-lg ${
                          user.isActive 
                            ? 'text-green-600 hover:bg-green-50' 
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                        title={user.isActive ? 'Pasif yap' : 'Aktif yap'}
                      >
                        {user.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => editUser(user)}
                        className="p-2 text-hotel-gold hover:bg-yellow-50 rounded-lg"
                        title="Düzenle"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Kullanıcı bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500">
            Arama kriterlerinizi değiştirerek tekrar deneyin.
          </p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddModal(false);
              setShowEditModal(false);
              setSelectedUser(null);
            }
          }}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {showAddModal ? 'Yeni Kullanıcı Ekle' : 'Kullanıcı Düzenle'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setSelectedUser(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ad *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    defaultValue={selectedUser?.firstName || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                    placeholder="Ad"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Soyad *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    defaultValue={selectedUser?.lastName || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                    placeholder="Soyad"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta *
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={selectedUser?.email || ''}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                  placeholder="ornek@hotel.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={selectedUser?.phone || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                  placeholder="+90 555 123 4567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol *
                </label>
                <select 
                  name="role"
                  defaultValue={selectedUser?.role || ''}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                >
                  {roles.filter(role => role.value !== 'all').map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {showAddModal && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Şifre *
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                    placeholder="Güçlü bir şifre girin"
                  />
                </div>
              )}
            </form>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                İptal
              </button>
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  const form = document.querySelector('form');
                  if (form && form.checkValidity()) {
                    const formData = new FormData(form);
                    const userData = {
                      firstName: formData.get('firstName') as string,
                      lastName: formData.get('lastName') as string,
                      email: formData.get('email') as string,
                      phone: formData.get('phone') as string || undefined,
                      role: formData.get('role') as any,
                      password: formData.get('password') as string || undefined,
                    };
                    saveUser(userData);
                  } else {
                    alert('Lütfen tüm zorunlu alanları doldurun!');
                  }
                }}
                className="px-4 py-2 bg-hotel-gold text-white rounded-lg hover:bg-hotel-navy transition-colors"
              >
                {showAddModal ? 'Oluştur' : 'Güncelle'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Yetki Yönetimi Modal */}
      {showPermissionsModal && selectedUser && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPermissionsModal(false);
              setSelectedUser(null);
            }
          }}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Yetki Yönetimi
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedUser.firstName} {selectedUser.lastName} için sayfa yetkilerini düzenleyin
                </p>
              </div>
              <button
                onClick={() => {
                  setShowPermissionsModal(false);
                  setSelectedUser(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availablePages.map((page) => (
                <div
                  key={page.key}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedPermissions.includes(page.key)
                      ? 'border-hotel-gold bg-yellow-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => togglePermission(page.key)}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(page.key)}
                      onChange={() => togglePermission(page.key)}
                      className="mt-1 h-5 w-5 text-hotel-gold focus:ring-hotel-gold border-gray-300 rounded cursor-pointer"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {page.label}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {page.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{selectedPermissions.length}</span> sayfa yetkisi verildi
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPermissionsModal(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  İptal
                </button>
                <button 
                  type="button"
                  onClick={savePermissions}
                  className="px-4 py-2 bg-hotel-gold text-white rounded-lg hover:bg-hotel-navy transition-colors"
                >
                  Yetkileri Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
