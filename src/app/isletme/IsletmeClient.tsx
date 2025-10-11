'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Bell, 
  BarChart3, 
  Settings, 
  Menu as MenuIcon,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle
} from 'lucide-react';

export default function IsletmeClient() {
  const [stats, setStats] = useState({
    totalGuests: 0,
    activeRooms: 0,
    totalRevenue: 0,
    occupancyRate: 0
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: 'checkin', room: '101', guest: 'Ahmet Yılmaz', time: '14:30' },
    { id: 2, type: 'order', room: '102', guest: 'Mehmet Demir', time: '15:15' },
    { id: 3, type: 'checkout', room: '103', guest: 'Ayşe Kaya', time: '11:00' },
  ]);

  useEffect(() => {
    // Simulate data loading
    setStats({
      totalGuests: 24,
      activeRooms: 18,
      totalRevenue: 15420,
      occupancyRate: 75
    });
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'checkin': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'checkout': return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'order': return <MenuIcon className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityText = (type: string, room: string, guest: string) => {
    switch (type) {
      case 'checkin': return `${guest} oda ${room}'a giriş yaptı`;
      case 'checkout': return `${guest} oda ${room}'dan çıkış yaptı`;
      case 'order': return `${guest} oda ${room}'dan sipariş verdi`;
      default: return 'Bilinmeyen aktivite';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">İşletme Paneli</h1>
        <p className="text-gray-600">Otel yönetim paneline hoş geldiniz</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Misafir</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalGuests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aktif Oda</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeRooms}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Günlük Gelir</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString()}₺</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Bell className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Doluluk Oranı</p>
              <p className="text-2xl font-bold text-gray-900">%{stats.occupancyRate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Aktiviteler</h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3">
                {getActivityIcon(activity.type)}
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    {getActivityText(activity.type, activity.room, activity.guest)}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/isletme/users"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-8 w-8 text-blue-500 mb-2" />
              <span className="text-sm font-medium text-gray-900">Kullanıcılar</span>
            </Link>
            <Link
              href="/isletme/announcements"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Bell className="h-8 w-8 text-orange-500 mb-2" />
              <span className="text-sm font-medium text-gray-900">Duyurular</span>
            </Link>
            <Link
              href="/isletme/menu"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <MenuIcon className="h-8 w-8 text-green-500 mb-2" />
              <span className="text-sm font-medium text-gray-900">Menü</span>
            </Link>
            <Link
              href="/isletme/settings"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Settings className="h-8 w-8 text-gray-500 mb-2" />
              <span className="text-sm font-medium text-gray-900">Ayarlar</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Sistem Bildirimi</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Otel yönetim sistemi güncellemeleri tamamlandı. Tüm özellikler aktif durumda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
