"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  Users,
  Building2,
  CreditCard,
  Activity,
  FileText,
  PieChart,
  LineChart,
  Filter
} from 'lucide-react';

export default function ReportsPage() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedReport, setSelectedReport] = useState('overview');

  // Mock data - gerçek API'den gelecek
  const reportData = {
    overview: {
      totalRevenue: '₺125,430',
      totalUsers: '1,247',
      totalTenants: '47',
      activeRequests: '89',
      revenueGrowth: '+12%',
      userGrowth: '+8%',
      tenantGrowth: '+3%',
      requestGrowth: '+15%'
    },
    revenue: [
      { month: 'Ocak', amount: 8500, growth: '+5%' },
      { month: 'Şubat', amount: 9200, growth: '+8%' },
      { month: 'Mart', amount: 10800, growth: '+17%' },
      { month: 'Nisan', amount: 12500, growth: '+16%' },
      { month: 'Mayıs', amount: 14200, growth: '+14%' },
      { month: 'Haziran', amount: 15800, growth: '+11%' }
    ],
    tenants: [
      { name: 'Grand Hotel Istanbul', revenue: '₺8,500', users: 45, status: 'active' },
      { name: 'Plaza Hotel Ankara', revenue: '₺6,200', users: 32, status: 'active' },
      { name: 'Resort Hotel Antalya', revenue: '₺5,800', users: 28, status: 'active' },
      { name: 'Business Hotel Izmir', revenue: '₺4,900', users: 24, status: 'active' },
      { name: 'Luxury Hotel Cappadocia', revenue: '₺3,200', users: 18, status: 'trial' }
    ]
  };

  const reportTypes = [
    { id: 'overview', name: 'Genel Bakış', icon: BarChart3, color: 'bg-blue-500' },
    { id: 'revenue', name: 'Gelir Raporu', icon: TrendingUp, color: 'bg-green-500' },
    { id: 'users', name: 'Kullanıcı Analizi', icon: Users, color: 'bg-purple-500' },
    { id: 'tenants', name: 'İşletme Raporu', icon: Building2, color: 'bg-orange-500' },
    { id: 'requests', name: 'Talep Analizi', icon: Activity, color: 'bg-red-500' },
    { id: 'performance', name: 'Performans', icon: LineChart, color: 'bg-indigo-500' }
  ];

  const periods = [
    { id: '7days', name: 'Son 7 Gün' },
    { id: '30days', name: 'Son 30 Gün' },
    { id: '90days', name: 'Son 3 Ay' },
    { id: '1year', name: 'Son 1 Yıl' }
  ];

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    // Export logic here
    console.log(`Exporting ${selectedReport} as ${format}`);
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Raporlar</h1>
              <p className="text-sm text-gray-600 mt-1">Sistem performansı ve analitik raporları</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {periods.map((period) => (
                  <option key={period.id} value={period.id}>{period.name}</option>
                ))}
              </select>
              <button
                onClick={() => handleExport('pdf')}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                PDF İndir
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Report Type Selector */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {reportTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedReport(type.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedReport === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 text-center">{type.name}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Report Content */}
        <div className="space-y-6">
          {selectedReport === 'overview' && (
            <>
              {/* Overview Stats */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                      <p className="text-2xl font-bold text-gray-900">{reportData.overview.totalRevenue}</p>
                      <p className="text-sm text-green-600">{reportData.overview.revenueGrowth}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
                      <p className="text-2xl font-bold text-gray-900">{reportData.overview.totalUsers}</p>
                      <p className="text-sm text-green-600">{reportData.overview.userGrowth}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Aktif İşletme</p>
                      <p className="text-2xl font-bold text-gray-900">{reportData.overview.totalTenants}</p>
                      <p className="text-sm text-green-600">{reportData.overview.tenantGrowth}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Aktif Talep</p>
                      <p className="text-2xl font-bold text-gray-900">{reportData.overview.activeRequests}</p>
                      <p className="text-sm text-green-600">{reportData.overview.requestGrowth}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Aylık Gelir Trendi</h3>
                  <div className="h-64 flex items-end justify-between space-x-2">
                    {reportData.revenue.map((item, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="bg-blue-500 rounded-t w-8 mb-2"
                          style={{ height: `${(item.amount / 16000) * 200}px` }}
                        ></div>
                        <span className="text-xs text-gray-600">{item.month}</span>
                        <span className="text-xs text-green-600">{item.growth}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">İşletme Dağılımı</h3>
                  <div className="space-y-3">
                    {reportData.tenants.slice(0, 5).map((tenant, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                          <span className="text-sm text-gray-900">{tenant.name}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{tenant.revenue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {selectedReport === 'revenue' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detaylı Gelir Raporu</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşletme</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aylık Gelir</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Büyüme</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.tenants.map((tenant, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tenant.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tenant.revenue}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+{Math.floor(Math.random() * 20) + 5}%</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tenant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {tenant.status === 'active' ? 'Aktif' : 'Deneme'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedReport === 'users' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Kullanıcı Analizi</h3>
              <p className="text-gray-600">Kullanıcı analizi raporu burada görüntülenecek...</p>
            </div>
          )}

          {selectedReport === 'tenants' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">İşletme Raporu</h3>
              <p className="text-gray-600">İşletme raporu burada görüntülenecek...</p>
            </div>
          )}

          {selectedReport === 'requests' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Talep Analizi</h3>
              <p className="text-gray-600">Talep analizi raporu burada görüntülenecek...</p>
            </div>
          )}

          {selectedReport === 'performance' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performans Raporu</h3>
              <p className="text-gray-600">Performans raporu burada görüntülenecek...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
