"use client";

import { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar,
  Shield,
  UserCheck,
  UserX,
  Key,
  Building2,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  // Mock data - gerçek API'den gelecek
  const users = [
    {
      id: '1',
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      email: 'ahmet@roomxqr.com',
      phone: '+90 555 123 4567',
      role: 'ADMIN',
      status: 'active',
      tenantName: 'RoomXQR Platform',
      lastLogin: '2024-01-15 14:30',
      createdAt: '2024-01-01',
      permissions: ['all'],
      twoFactorEnabled: true
    },
    {
      id: '2',
      firstName: 'Mehmet',
      lastName: 'Demir',
      email: 'mehmet@grandhotel.com',
      phone: '+90 555 234 5678',
      role: 'MANAGER',
      status: 'active',
      tenantName: 'Grand Hotel Istanbul',
      lastLogin: '2024-01-15 12:15',
      createdAt: '2024-01-05',
      permissions: ['menu', 'users', 'analytics'],
      twoFactorEnabled: false
    },
    {
      id: '3',
      firstName: 'Ayşe',
      lastName: 'Kaya',
      email: 'ayse@plazahotel.com',
      phone: '+90 555 345 6789',
      role: 'RECEPTION',
      status: 'active',
      tenantName: 'Plaza Hotel Ankara',
      lastLogin: '2024-01-15 16:45',
      createdAt: '2024-01-10',
      permissions: ['reception', 'notifications'],
      twoFactorEnabled: true
    },
    {
      id: '4',
      firstName: 'Fatma',
      lastName: 'Özkan',
      email: 'fatma@resorthotel.com',
      phone: '+90 555 456 7890',
      role: 'KITCHEN',
      status: 'active',
      tenantName: 'Resort Hotel Antalya',
      lastLogin: '2024-01-15 15:20',
      createdAt: '2024-01-12',
      permissions: ['kitchen', 'orders'],
      twoFactorEnabled: false
    },
    {
      id: '5',
      firstName: 'Ali',
      lastName: 'Çelik',
      email: 'ali@businesshotel.com',
      phone: '+90 555 567 8901',
      role: 'STAFF',
      status: 'inactive',
      tenantName: 'Business Hotel Izmir',
      lastLogin: '2024-01-10 09:30',
      createdAt: '2024-01-08',
      permissions: ['basic'],
      twoFactorEnabled: false
    },
    {
      id: '6',
      firstName: 'Zeynep',
      lastName: 'Arslan',
      email: 'zeynep@luxuryhotel.com',
      phone: '+90 555 678 9012',
      role: 'WAITER',
      status: 'suspended',
      tenantName: 'Luxury Hotel Cappadocia',
      lastLogin: '2024-01-08 11:45',
      createdAt: '2024-01-15',
      permissions: ['orders'],
      twoFactorEnabled: true
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.tenantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'MANAGER': return 'bg-purple-100 text-purple-800';
      case 'RECEPTION': return 'bg-blue-100 text-blue-800';
      case 'KITCHEN': return 'bg-green-100 text-green-800';
      case 'WAITER': return 'bg-yellow-100 text-yellow-800';
      case 'STAFF': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Yönetici';
      case 'MANAGER': return 'Müdür';
      case 'RECEPTION': return 'Resepsiyon';
      case 'KITCHEN': return 'Mutfak';
      case 'WAITER': return 'Garson';
      case 'STAFF': return 'Personel';
      default: return 'Bilinmiyor';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'inactive': return 'Pasif';
      case 'suspended': return 'Askıya Alınmış';
      default: return 'Bilinmiyor';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <Clock className="w-4 h-4" />;
      case 'suspended': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleEditUser = (user: any) => {
    console.log('Edit user:', user);
  };

  const handleSuspendUser = (user: any) => {
    console.log('Suspend user:', user);
  };

  const handleDeleteUser = (user: any) => {
    console.log('Delete user:', user);
  };

  const handleResetPassword = (user: any) => {
    console.log('Reset password for:', user);
  };

  const handleToggleTwoFactor = (user: any) => {
    console.log('Toggle 2FA for:', user);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
          <p className="text-gray-600">Sistem kullanıcılarını görüntüleyin ve yönetin</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Kullanıcı
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aktif Kullanıcı</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.status === 'active').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <UserX className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Askıya Alınmış</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.status === 'suspended').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">2FA Aktif</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.twoFactorEnabled).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Ad, soyad, email veya işletme adı ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tüm Roller</option>
              <option value="ADMIN">Yönetici</option>
              <option value="MANAGER">Müdür</option>
              <option value="RECEPTION">Resepsiyon</option>
              <option value="KITCHEN">Mutfak</option>
              <option value="WAITER">Garson</option>
              <option value="STAFF">Personel</option>
            </select>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
              <option value="suspended">Askıya Alınmış</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşletme</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Son Giriş</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">2FA</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-sm font-medium text-blue-600">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{user.tenantName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {getRoleText(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {getStatusIcon(user.status)}
                      <span className="ml-1">{getStatusText(user.status)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastLogin}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.twoFactorEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.twoFactorEnabled ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Görüntüle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="Düzenle"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleResetPassword(user)}
                        className="text-yellow-600 hover:text-yellow-900 p-1"
                        title="Şifre Sıfırla"
                      >
                        <Key className="w-4 h-4" />
                      </button>
                      <div className="relative">
                        <button className="text-gray-600 hover:text-gray-900 p-1">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">{selectedUser.firstName} {selectedUser.lastName}</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Temel Bilgiler</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{selectedUser.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{selectedUser.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{selectedUser.tenantName}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{selectedUser.createdAt}</span>
                    </div>
                  </div>
                </div>

                {/* Role and Status */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Rol ve Durum</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                        {getRoleText(selectedUser.role)}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">Rol</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                        {getStatusIcon(selectedUser.status)}
                        <span className="ml-1">{getStatusText(selectedUser.status)}</span>
                      </span>
                      <div className="text-xs text-gray-500 mt-1">Durum</div>
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">İzinler</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.permissions.map((permission: string, index: number) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Security */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Güvenlik</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">İki Faktörlü Kimlik Doğrulama:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedUser.twoFactorEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedUser.twoFactorEnabled ? 'Aktif' : 'Pasif'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Son Giriş:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedUser.lastLogin}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Kapat
                  </button>
                  <button
                    onClick={() => handleEditUser(selectedUser)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Düzenle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
