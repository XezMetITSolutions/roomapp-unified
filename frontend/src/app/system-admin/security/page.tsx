"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Lock, 
  Key, 
  UserCheck,
  Activity,
  Clock,
  Settings,
  Download,
  RefreshCw,
  Ban,
  Unlock
} from 'lucide-react';

export default function SecurityPage() {
  const router = useRouter();
  const [securityLevel, setSecurityLevel] = useState('high');
  const [activeThreats, setActiveThreats] = useState(0);
  const [lastScan, setLastScan] = useState(new Date());

  // Mock data - gerçek API'den gelecek
  const securityStats = [
    {
      name: 'Güvenlik Skoru',
      value: '95%',
      status: 'excellent',
      icon: Shield,
      color: 'bg-green-500',
      description: 'Sistem güvenlik durumu'
    },
    {
      name: 'Aktif Tehditler',
      value: '2',
      status: 'warning',
      icon: AlertTriangle,
      color: 'bg-yellow-500',
      description: 'Tespit edilen güvenlik tehditleri'
    },
    {
      name: 'Son Tarama',
      value: '2 saat önce',
      status: 'good',
      icon: Clock,
      color: 'bg-blue-500',
      description: 'Son güvenlik taraması'
    },
    {
      name: 'Korumalı Kaynak',
      value: '47/47',
      status: 'excellent',
      icon: Lock,
      color: 'bg-purple-500',
      description: 'Korumalı sistem kaynakları'
    }
  ];

  const recentActivities = [
    { id: 1, type: 'login', user: 'admin@hotel.com', ip: '192.168.1.100', time: '5 dakika önce', status: 'success', icon: UserCheck },
    { id: 2, type: 'failed_login', user: 'unknown@test.com', ip: '10.0.0.50', time: '12 dakika önce', status: 'failed', icon: XCircle },
    { id: 3, type: 'permission_change', user: 'manager@hotel.com', ip: '192.168.1.105', time: '25 dakika önce', status: 'success', icon: Settings },
    { id: 4, type: 'data_access', user: 'staff@hotel.com', ip: '192.168.1.110', time: '35 dakika önce', status: 'success', icon: Eye },
    { id: 5, type: 'system_update', user: 'system', ip: 'localhost', time: '1 saat önce', status: 'success', icon: RefreshCw }
  ];

  const securityAlerts = [
    { id: 1, type: 'warning', message: 'Şüpheli IP adresinden giriş denemesi', severity: 'medium', time: '10 dakika önce', ip: '10.0.0.50' },
    { id: 2, type: 'info', message: 'Güvenlik duvarı kuralları güncellendi', severity: 'low', time: '2 saat önce', ip: 'system' },
    { id: 3, type: 'error', message: 'Başarısız giriş denemesi tespit edildi', severity: 'high', time: '3 saat önce', ip: '192.168.1.200' }
  ];

  const accessLogs = [
    { id: 1, user: 'admin@hotel.com', action: 'Sistem ayarlarına erişim', resource: '/system-admin/settings', ip: '192.168.1.100', time: '5 dakika önce', status: 'allowed' },
    { id: 2, user: 'manager@hotel.com', action: 'Kullanıcı listesi görüntüleme', resource: '/system-admin/users', ip: '192.168.1.105', time: '15 dakika önce', status: 'allowed' },
    { id: 3, user: 'staff@hotel.com', action: 'Rapor indirme', resource: '/system-admin/reports', ip: '192.168.1.110', time: '25 dakika önce', status: 'denied' },
    { id: 4, user: 'guest@test.com', action: 'Admin paneline erişim', resource: '/system-admin', ip: '10.0.0.50', time: '30 dakika önce', status: 'denied' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-50 border-red-200 text-red-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const handleSecurityScan = () => {
    setLastScan(new Date());
    console.log('Güvenlik taraması başlatıldı...');
  };

  const handleBlockIP = (ip: string) => {
    console.log(`IP adresi engellendi: ${ip}`);
  };

  const handleUnblockIP = (ip: string) => {
    console.log(`IP adresi engeli kaldırıldı: ${ip}`);
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Güvenlik Merkezi</h1>
              <p className="text-sm text-gray-600 mt-1">Sistem güvenliği ve erişim kontrolü</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSecurityScan}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Güvenlik Taraması
              </button>
              <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Rapor İndir
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Security Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          {securityStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <div className="flex items-baseline">
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Sol Kolon - Güvenlik Durumu ve Uyarılar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Güvenlik Durumu */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Güvenlik Durumu</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600 font-medium">Güvenli</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-sm font-medium text-gray-900">Firewall</span>
                    </div>
                    <span className="text-sm font-semibold text-green-600">Aktif</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <Lock className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-sm font-medium text-gray-900">SSL/TLS</span>
                    </div>
                    <span className="text-sm font-semibold text-green-600">Aktif</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                      <span className="text-sm font-medium text-gray-900">İzleme</span>
                    </div>
                    <span className="text-sm font-semibold text-yellow-600">2 Uyarı</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <Key className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-sm font-medium text-gray-900">Şifreleme</span>
                    </div>
                    <span className="text-sm font-semibold text-green-600">AES-256</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Güvenlik Uyarıları */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Güvenlik Uyarıları</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {securityAlerts.map((alert) => (
                  <div key={alert.id} className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">IP: {alert.ip} • {alert.time}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                        <button
                          onClick={() => handleBlockIP(alert.ip)}
                          className="text-red-600 hover:text-red-800"
                          title="IP'yi Engelle"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sağ Kolon - Son Aktiviteler ve Erişim Logları */}
          <div className="space-y-6">
            {/* Son Aktiviteler */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Son Aktiviteler</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          <Icon className={`w-4 h-4 ${getStatusColor(activity.status).split(' ')[0]}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{activity.user}</p>
                          <p className="text-xs text-gray-500">{activity.ip} • {activity.time}</p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                          {activity.status === 'success' ? 'Başarılı' : 'Başarısız'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Erişim Logları */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Erişim Logları</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {accessLogs.map((log) => (
                  <div key={log.id} className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{log.user}</p>
                        <p className="text-xs text-gray-500">{log.action}</p>
                        <p className="text-xs text-gray-400">{log.resource} • {log.ip}</p>
                        <p className="text-xs text-gray-400">{log.time}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        log.status === 'allowed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {log.status === 'allowed' ? 'İzin Verildi' : 'Reddedildi'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Güvenlik Ayarları */}
        <div className="mt-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Güvenlik Ayarları</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">İki Faktörlü Doğrulama</h4>
                    <p className="text-xs text-gray-500">Tüm admin hesapları için zorunlu</p>
                  </div>
                  <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">Aktif</button>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Oturum Süresi</h4>
                    <p className="text-xs text-gray-500">Maksimum 8 saat</p>
                  </div>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Ayarla</button>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">IP Kısıtlaması</h4>
                    <p className="text-xs text-gray-500">Belirli IP'lerden erişim</p>
                  </div>
                  <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm">Yönet</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
