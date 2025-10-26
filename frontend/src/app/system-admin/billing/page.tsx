"use client";

import { useState } from 'react';
import { 
  CreditCard, 
  Download, 
  Eye, 
  Search, 
  Filter, 
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building2,
  Users,
  BarChart3,
  RefreshCw
} from 'lucide-react';

export default function BillingSystem() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('this-month');

  // Mock data - gerçek API'den gelecek
  const billingStats = {
    totalRevenue: '₺45,230',
    monthlyGrowth: '+12%',
    pendingInvoices: 8,
    overdueInvoices: 3,
    totalCustomers: 47,
    averageRevenue: '₺962'
  };

  const invoices = [
    {
      id: 'INV-2024-001',
      tenantName: 'Grand Hotel Istanbul',
      tenantEmail: 'info@grandhotel.com',
      amount: '₺2,500',
      status: 'paid',
      dueDate: '2024-01-15',
      paidDate: '2024-01-14',
      package: 'Premium',
      period: 'Ocak 2024',
      features: ['qr-menu', 'multi-language', 'analytics']
    },
    {
      id: 'INV-2024-002',
      tenantName: 'Plaza Hotel Ankara',
      tenantEmail: 'info@plazahotel.com',
      amount: '₺3,200',
      status: 'paid',
      dueDate: '2024-01-15',
      paidDate: '2024-01-13',
      package: 'Kurumsal',
      period: 'Ocak 2024',
      features: ['qr-menu', 'multi-language', 'analytics', 'custom-branding']
    },
    {
      id: 'INV-2024-003',
      tenantName: 'Resort Hotel Antalya',
      tenantEmail: 'info@resorthotel.com',
      amount: '₺2,500',
      status: 'pending',
      dueDate: '2024-01-20',
      paidDate: null,
      package: 'Premium',
      period: 'Ocak 2024',
      features: ['qr-menu', 'multi-language', 'analytics']
    },
    {
      id: 'INV-2024-004',
      tenantName: 'Business Hotel Izmir',
      tenantEmail: 'info@businesshotel.com',
      amount: '₺2,500',
      status: 'overdue',
      dueDate: '2024-01-10',
      paidDate: null,
      package: 'Premium',
      period: 'Ocak 2024',
      features: ['qr-menu', 'multi-language']
    },
    {
      id: 'INV-2024-005',
      tenantName: 'Luxury Hotel Cappadocia',
      tenantEmail: 'info@luxuryhotel.com',
      amount: '₺3,200',
      status: 'overdue',
      dueDate: '2024-01-05',
      paidDate: null,
      package: 'Kurumsal',
      period: 'Ocak 2024',
      features: ['qr-menu', 'multi-language', 'analytics', 'support']
    }
  ];

  const packages = [
    {
      name: 'Temel',
      price: '₺1,500',
      features: ['QR Menü', 'Temel Destek', '5 Kullanıcı'],
      activeCustomers: 12,
      monthlyRevenue: '₺18,000'
    },
    {
      name: 'Premium',
      price: '₺2,500',
      features: ['QR Menü', 'Çoklu Dil', 'Analytics', '10 Kullanıcı'],
      activeCustomers: 28,
      monthlyRevenue: '₺70,000'
    },
    {
      name: 'Kurumsal',
      price: '₺3,200',
      features: ['Tüm Özellikler', 'Özel Marka', 'Sınırsız Kullanıcı', '7/24 Destek'],
      activeCustomers: 7,
      monthlyRevenue: '₺22,400'
    }
  ];

  const revenueData = [
    { month: 'Ocak', revenue: 45230, growth: 12 },
    { month: 'Aralık', revenue: 40380, growth: 8 },
    { month: 'Kasım', revenue: 37420, growth: 15 },
    { month: 'Ekim', revenue: 32540, growth: 5 },
    { month: 'Eylül', revenue: 30980, growth: -2 },
    { month: 'Ağustos', revenue: 31620, growth: 18 }
  ];

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.tenantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Ödendi';
      case 'pending': return 'Bekliyor';
      case 'overdue': return 'Gecikmiş';
      case 'cancelled': return 'İptal';
      default: return 'Bilinmiyor';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'overdue': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleViewInvoice = (invoice: any) => {
    console.log('View invoice:', invoice);
  };

  const handleDownloadInvoice = (invoice: any) => {
    console.log('Download invoice:', invoice);
  };

  const handleSendReminder = (invoice: any) => {
    console.log('Send reminder:', invoice);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Faturalandırma</h1>
          <p className="text-gray-600">Faturaları yönetin ve gelir raporlarını görüntüleyin</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <RefreshCw className="w-4 h-4 mr-2" />
            Yenile
          </button>
          <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            <FileText className="w-4 h-4 mr-2" />
            Yeni Fatura
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
              <p className="text-2xl font-bold text-gray-900">{billingStats.totalRevenue}</p>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                {billingStats.monthlyGrowth}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bekleyen Fatura</p>
              <p className="text-2xl font-bold text-gray-900">{billingStats.pendingInvoices}</p>
              <p className="text-xs text-yellow-600">Ödeme bekliyor</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Gecikmiş Fatura</p>
              <p className="text-2xl font-bold text-gray-900">{billingStats.overdueInvoices}</p>
              <p className="text-xs text-red-600">Acil müdahale</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aktif Müşteri</p>
              <p className="text-2xl font-bold text-gray-900">{billingStats.totalCustomers}</p>
              <p className="text-xs text-blue-600">Ortalama: {billingStats.averageRevenue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Gelir Trendi</h3>
        </div>
        <div className="p-6">
          <div className="h-64 flex items-end justify-between space-x-2">
            {revenueData.map((data, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                <div className="w-full flex flex-col space-y-1">
                  <div 
                    className="bg-blue-500 rounded-t"
                    style={{ height: `${(data.revenue / 50000) * 200}px` }}
                    title={`${data.month}: ₺${data.revenue.toLocaleString()}`}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">{data.month}</span>
                <div className="flex items-center">
                  {data.growth > 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                  )}
                  <span className={`text-xs ${data.growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {data.growth > 0 ? '+' : ''}{data.growth}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Package Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Paket Performansı</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-gray-900">{pkg.name}</h4>
                  <p className="text-2xl font-bold text-blue-600 mt-2">{pkg.price}</p>
                  <p className="text-sm text-gray-500">aylık</p>
                </div>
                <div className="mt-4">
                  <ul className="space-y-2">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Müşteri:</span>
                    <span className="text-sm font-medium text-gray-900">{pkg.activeCustomers}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">Aylık Gelir:</span>
                    <span className="text-sm font-medium text-gray-900">{pkg.monthlyRevenue}</span>
                  </div>
                </div>
              </div>
            ))}
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
                placeholder="Fatura ID, işletme adı veya email ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="paid">Ödendi</option>
              <option value="pending">Bekliyor</option>
              <option value="overdue">Gecikmiş</option>
              <option value="cancelled">İptal</option>
            </select>
          </div>
          <div className="sm:w-48">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="this-month">Bu Ay</option>
              <option value="last-month">Geçen Ay</option>
              <option value="this-quarter">Bu Çeyrek</option>
              <option value="this-year">Bu Yıl</option>
              <option value="all">Tüm Zamanlar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fatura</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşletme</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paket</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vade</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{invoice.id}</div>
                      <div className="text-sm text-gray-500">{invoice.period}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{invoice.tenantName}</div>
                      <div className="text-sm text-gray-500">{invoice.tenantEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {invoice.package}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      <span className="ml-1">{getStatusText(invoice.status)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.dueDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewInvoice(invoice)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Görüntüle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadInvoice(invoice)}
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="İndir"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {invoice.status === 'pending' && (
                        <button
                          onClick={() => handleSendReminder(invoice)}
                          className="text-orange-600 hover:text-orange-900 p-1"
                          title="Hatırlatma Gönder"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
}
