'use client';

import { useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, Calendar, Filter } from 'lucide-react';

export default function AnalyticsPageClient() {
  const [timeRange, setTimeRange] = useState('7d');

  // Sample data
  const revenueData = [
    { name: 'Pazartesi', revenue: 2400 },
    { name: 'Salı', revenue: 1398 },
    { name: 'Çarşamba', revenue: 9800 },
    { name: 'Perşembe', revenue: 3908 },
    { name: 'Cuma', revenue: 4800 },
    { name: 'Cumartesi', revenue: 3800 },
    { name: 'Pazar', revenue: 4300 }
  ];

  const occupancyData = [
    { name: 'Ocak', occupancy: 65 },
    { name: 'Şubat', occupancy: 72 },
    { name: 'Mart', occupancy: 58 },
    { name: 'Nisan', occupancy: 85 },
    { name: 'Mayıs', occupancy: 92 },
    { name: 'Haziran', occupancy: 78 }
  ];

  const roomTypeData = [
    { name: 'Standart', value: 45, color: '#8884d8' },
    { name: 'Deluxe', value: 30, color: '#82ca9d' },
    { name: 'Suite', value: 25, color: '#ffc658' }
  ];

  const stats = [
    { title: 'Toplam Gelir', value: '₺45,230', change: '+12.5%', trend: 'up', icon: DollarSign },
    { title: 'Doluluk Oranı', value: '78%', change: '+5.2%', trend: 'up', icon: Users },
    { title: 'Ortalama Gecelik', value: '₺245', change: '-2.1%', trend: 'down', icon: TrendingUp },
    { title: 'Toplam Misafir', value: '1,234', change: '+8.7%', trend: 'up', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analitik Dashboard</h1>
              <p className="text-gray-600 mt-1">Otel performansınızı takip edin</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">Son 7 Gün</option>
                <option value="30d">Son 30 Gün</option>
                <option value="90d">Son 90 Gün</option>
                <option value="1y">Son 1 Yıl</option>
              </select>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtrele
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className="flex items-center">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`ml-2 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Günlük Gelir</h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {revenueData.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="bg-blue-500 rounded-t w-8 mb-2"
                    style={{ height: `${(item.revenue / 100) * 2}px` }}
                  ></div>
                  <span className="text-xs text-gray-600">{item.name}</span>
                  <span className="text-xs font-medium">{item.revenue}₺</span>
                </div>
              ))}
            </div>
          </div>

          {/* Occupancy Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Doluluk Oranı</h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {occupancyData.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="bg-green-500 rounded-t w-8 mb-2"
                    style={{ height: `${item.occupancy * 2}px` }}
                  ></div>
                  <span className="text-xs text-gray-600">{item.name}</span>
                  <span className="text-xs font-medium">{item.occupancy}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Room Type Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Oda Tipi Dağılımı</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">100%</div>
                <div className="text-gray-600">Toplam Oda</div>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              {roomTypeData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-700">{item.name}: %{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
