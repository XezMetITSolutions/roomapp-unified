"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  Users, 
  Server, 
  CreditCard, 
  Headphones, 
  Settings, 
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Database,
  Globe,
  Shield,
  BarChart3,
  FileText,
  Bell,
  Zap
} from 'lucide-react';

export default function SystemAdminDashboard() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  // Gerçek zamanlı saat güncellemesi
  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock data - gerçek API'den gelecek
  const systemStats = [
    {
      name: 'Aktif İşletmeler',
      value: '47',
      change: '+3',
      changeType: 'positive',
      icon: Building2,
      color: 'bg-blue-500',
      description: 'Toplam kayıtlı işletme'
    },
    {
      name: 'Toplam Kullanıcı',
      value: '1,247',
      change: '+89',
      changeType: 'positive',
      icon: Users,
      color: 'bg-green-500',
      description: 'Sistem geneli kullanıcı sayısı'
    },
    {
      name: 'Sistem Durumu',
      value: '99.9%',
      change: '+0.1%',
      changeType: 'positive',
      icon: Server,
      color: 'bg-emerald-500',
      description: 'Son 30 günlük uptime'
    },
    {
      name: 'Aylık Gelir',
      value: '₺45,230',
      change: '+12%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-yellow-500',
      description: 'Bu ay toplam gelir'
    }
  ];

  const recentActivities = [
    { id: 1, type: 'tenant', message: 'Yeni işletme kaydı: "Grand Hotel Istanbul"', time: '2 dakika önce', icon: Building2, color: 'text-blue-600' },
    { id: 2, type: 'payment', message: 'Ödeme alındı: Hotel Plaza - ₺2,500', time: '5 dakika önce', icon: CreditCard, color: 'text-green-600' },
    { id: 3, type: 'support', message: 'Yeni destek talebi: Teknik sorun', time: '8 dakika önce', icon: Headphones, color: 'text-orange-600' },
    { id: 4, type: 'system', message: 'Sistem güncellemesi tamamlandı', time: '15 dakika önce', icon: Server, color: 'text-purple-600' },
    { id: 5, type: 'user', message: 'Yeni kullanıcı kaydı: admin@hotel.com', time: '22 dakika önce', icon: Users, color: 'text-indigo-600' }
  ];

  const systemAlerts = [
    { id: 1, type: 'warning', message: 'Sunucu CPU kullanımı %85\'e ulaştı', severity: 'medium', time: '5 dakika önce' },
    { id: 2, type: 'info', message: 'Veritabanı yedeklemesi başarılı', severity: 'low', time: '1 saat önce' },
    { id: 3, type: 'error', message: 'API yanıt süresi yavaşladı', severity: 'high', time: '2 saat önce' }
  ];

  const topTenants = [
    { name: 'Grand Hotel Istanbul', users: 45, revenue: '₺8,500', status: 'active', growth: '+15%' },
    { name: 'Plaza Hotel Ankara', users: 32, revenue: '₺6,200', status: 'active', growth: '+8%' },
    { name: 'Resort Hotel Antalya', users: 28, revenue: '₺5,800', status: 'active', growth: '+22%' },
    { name: 'Business Hotel Izmir', users: 24, revenue: '₺4,900', status: 'active', growth: '+5%' },
    { name: 'Luxury Hotel Cappadocia', users: 18, revenue: '₺3,200', status: 'trial', growth: '+45%' }
  ];

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-50 border-red-200 text-red-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      case 'info': return <CheckCircle className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sistem Yönetimi</h1>
              <p className="text-sm text-gray-600 mt-1">RoomXQR Platform Yönetim Paneli</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-xs text-gray-500">Son güncelleme</div>
                <div className="text-sm font-mono text-gray-900">
                  {mounted && currentTime ? currentTime.toLocaleTimeString('tr-TR') : '--:--:--'}
                </div>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
          {systemStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <div className="flex items-baseline">
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className={`ml-2 text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Sol Kolon - Sistem Durumu ve Uyarılar */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Sistem Durumu */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Sistem Durumu</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600 font-medium">Çevrimiçi</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <Database className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-sm font-medium text-gray-900">Veritabanı</span>
                    </div>
                    <span className="text-sm font-semibold text-green-600">Normal</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <Server className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-sm font-medium text-gray-900">API Sunucu</span>
                    </div>
                    <span className="text-sm font-semibold text-green-600">Normal</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center">
                      <Activity className="w-5 h-5 text-yellow-600 mr-3" />
                      <span className="text-sm font-medium text-gray-900">CPU Kullanımı</span>
                    </div>
                    <span className="text-sm font-semibold text-yellow-600">%85</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-sm font-medium text-gray-900">CDN</span>
                    </div>
                    <span className="text-sm font-semibold text-green-600">Normal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sistem Uyarıları */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Sistem Uyarıları</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {systemAlerts.map((alert) => (
                  <div key={alert.id} className="px-6 py-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAlertColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sağ Kolon - Hızlı Erişim ve Son Aktiviteler */}
          <div className="space-y-4 sm:space-y-6">
            {/* Hızlı Erişim */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Hızlı Erişim</h3>
              </div>
              <div className="p-6 space-y-3">
                <button 
                  onClick={() => router.push('/system-admin/tenants')}
                  className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Building2 className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">İşletme Yönetimi</span>
                </button>
                <button 
                  onClick={() => router.push('/system-admin/users')}
                  className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Users className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Kullanıcı Yönetimi</span>
                </button>
                <button 
                  onClick={() => router.push('/system-admin/monitoring')}
                  className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Activity className="w-5 h-5 text-purple-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Sistem İzleme</span>
                </button>
                <button 
                  onClick={() => router.push('/system-admin/billing')}
                  className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <CreditCard className="w-5 h-5 text-yellow-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Faturalandırma</span>
                </button>
                <button 
                  onClick={() => router.push('/system-admin/support')}
                  className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Headphones className="w-5 h-5 text-orange-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Destek Sistemi</span>
                </button>
                <button 
                  onClick={() => router.push('/system-admin/settings')}
                  className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Sistem Ayarları</span>
                </button>
              </div>
            </div>

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
                          <Icon className={`w-4 h-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* En İyi Performans Gösteren İşletmeler */}
        <div className="mt-6 sm:mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">En İyi Performans Gösteren İşletmeler</h3>
                <button 
                  onClick={() => router.push('/system-admin/tenants')}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Tümünü Gör →
                </button>
              </div>
            </div>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşletme</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcı</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gelir</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Büyüme</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topTenants.map((tenant, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <Building2 className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tenant.users}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tenant.revenue}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tenant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {tenant.status === 'active' ? 'Aktif' : 'Deneme'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{tenant.growth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
