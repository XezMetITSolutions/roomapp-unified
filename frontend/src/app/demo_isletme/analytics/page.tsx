"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Clock,
  Download,
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  activeGuests: number;
  revenueChange: number;
  ordersChange: number;
  aovChange: number;
  guestsChange: number;
}

interface OrderData {
  date: string;
  orders: number;
  revenue: number;
}

interface CategoryData {
  category: string;
  orders: number;
  revenue: number;
  percentage: number;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [dateRange, setDateRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Mock data
  const analyticsData: AnalyticsData = {
    totalRevenue: 24500,
    totalOrders: 156,
    averageOrderValue: 157,
    activeGuests: 89,
    revenueChange: 12.5,
    ordersChange: 8.3,
    aovChange: -2.1,
    guestsChange: 15.2,
  };

  const orderData: OrderData[] = [
    { date: '2024-01-09', orders: 23, revenue: 3450 },
    { date: '2024-01-10', orders: 28, revenue: 4200 },
    { date: '2024-01-11', orders: 31, revenue: 4650 },
    { date: '2024-01-12', orders: 19, revenue: 2850 },
    { date: '2024-01-13', orders: 35, revenue: 5250 },
    { date: '2024-01-14', orders: 27, revenue: 4050 },
    { date: '2024-01-15', orders: 32, revenue: 4800 },
  ];

  const categoryData: CategoryData[] = [
    { category: 'Pizza', orders: 45, revenue: 6750, percentage: 27.5 },
    { category: 'Burger', orders: 38, revenue: 5320, percentage: 21.7 },
    { category: 'İçecek', orders: 42, revenue: 2940, percentage: 12.0 },
    { category: 'Salata', orders: 21, revenue: 3150, percentage: 12.9 },
    { category: 'Tatlı', orders: 10, revenue: 2340, percentage: 9.6 },
  ];

  const timeRanges = [
    { value: '7d', label: 'Son 7 Gün' },
    { value: '30d', label: 'Son 30 Gün' },
    { value: '90d', label: 'Son 3 Ay' },
    { value: '1y', label: 'Son 1 Yıl' },
  ];

  const metrics = [
    { value: 'revenue', label: 'Gelir', icon: DollarSign },
    { value: 'orders', label: 'Sipariş', icon: ShoppingCart },
    { value: 'aov', label: 'Ortalama Sipariş', icon: BarChart3 },
    { value: 'guests', label: 'Misafir', icon: Users },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('tr-TR').format(num);
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analitik & Raporlar</h1>
            <p className="text-gray-600">Performans metriklerini ve detaylı raporları görüntüleyin</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            <button 
              onClick={() => {
                alert('Rapor indirme işlemi başlatıldı! (Demo)');
              }}
              className="bg-hotel-gold text-white px-4 py-2 rounded-lg hover:bg-hotel-navy transition-colors flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Rapor İndir</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="hotel-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.totalRevenue)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            {getChangeIcon(analyticsData.revenueChange)}
            <span className={`text-sm font-medium ml-1 ${getChangeColor(analyticsData.revenueChange)}`}>
              {analyticsData.revenueChange > 0 ? '+' : ''}{analyticsData.revenueChange}%
            </span>
            <span className="text-sm text-gray-500 ml-2">önceki döneme göre</span>
          </div>
        </div>

        <div className="hotel-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.totalOrders)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            {getChangeIcon(analyticsData.ordersChange)}
            <span className={`text-sm font-medium ml-1 ${getChangeColor(analyticsData.ordersChange)}`}>
              {analyticsData.ordersChange > 0 ? '+' : ''}{analyticsData.ordersChange}%
            </span>
            <span className="text-sm text-gray-500 ml-2">önceki döneme göre</span>
          </div>
        </div>

        <div className="hotel-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ortalama Sipariş</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.averageOrderValue)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            {getChangeIcon(analyticsData.aovChange)}
            <span className={`text-sm font-medium ml-1 ${getChangeColor(analyticsData.aovChange)}`}>
              {analyticsData.aovChange > 0 ? '+' : ''}{analyticsData.aovChange}%
            </span>
            <span className="text-sm text-gray-500 ml-2">önceki döneme göre</span>
          </div>
        </div>

        <div className="hotel-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktif Misafir</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.activeGuests)}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            {getChangeIcon(analyticsData.guestsChange)}
            <span className={`text-sm font-medium ml-1 ${getChangeColor(analyticsData.guestsChange)}`}>
              {analyticsData.guestsChange > 0 ? '+' : ''}{analyticsData.guestsChange}%
            </span>
            <span className="text-sm text-gray-500 ml-2">önceki döneme göre</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="hotel-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Gelir Trendi</h3>
            <div className="flex space-x-2">
              {metrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <button
                    key={metric.value}
                    onClick={() => setSelectedMetric(metric.value)}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm transition-colors ${
                      selectedMetric === metric.value
                        ? 'bg-hotel-gold text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{metric.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Grafik buraya gelecek</p>
              <p className="text-sm text-gray-400">Chart.js veya başka bir kütüphane ile</p>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="hotel-card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Kategori Dağılımı</h3>
          <div className="space-y-4">
            {categoryData.map((category, index) => (
              <div key={category.category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-yellow-500' :
                    index === 3 ? 'bg-purple-500' : 'bg-red-500'
                  }`} />
                  <span className="text-sm font-medium text-gray-900">{category.category}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(category.revenue)}</p>
                    <p className="text-xs text-gray-500">{category.orders} sipariş</p>
                  </div>
                  <div className="w-16 text-right">
                    <p className="text-sm font-medium text-gray-900">{category.percentage}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="hotel-card">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Son Siparişler</h3>
            <button 
              onClick={() => {
                alert('Sipariş detayları sayfasına yönlendiriliyor... (Demo)');
              }}
              className="text-sm text-hotel-gold hover:text-hotel-navy font-medium"
            >
              Tümünü Görüntüle →
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sipariş
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Oda
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orderData.slice(-5).map((order, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{String(index + 1).padStart(3, '0')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Oda {Math.floor(Math.random() * 300) + 100}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(order.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Tamamlandı
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
