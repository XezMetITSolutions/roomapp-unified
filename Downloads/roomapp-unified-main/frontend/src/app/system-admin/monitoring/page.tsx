"use client";

import { useState, useEffect } from 'react';
import { 
  Server, 
  Database, 
  Activity, 
  Cpu, 
  HardDrive, 
  Wifi, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  BarChart3,
  Zap,
  Globe,
  Shield,
  Users,
  DollarSign
} from 'lucide-react';

export default function SystemMonitoring() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Gerçek zamanlı güncelleme
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdate(new Date());
    }, 1000);
  };

  // Mock data - gerçek API'den gelecek
  const systemMetrics = {
    uptime: '99.9%',
    responseTime: '45ms',
    requestsPerMinute: 1247,
    activeConnections: 89,
    cpuUsage: 65,
    memoryUsage: 78,
    diskUsage: 45,
    networkLatency: 12
  };

  const serverStatus = [
    { name: 'Web Sunucu', status: 'healthy', responseTime: '45ms', uptime: '99.9%', icon: Server },
    { name: 'API Sunucu', status: 'healthy', responseTime: '32ms', uptime: '99.8%', icon: Activity },
    { name: 'Veritabanı', status: 'healthy', responseTime: '8ms', uptime: '99.9%', icon: Database },
    { name: 'Redis Cache', status: 'warning', responseTime: '15ms', uptime: '98.5%', icon: Zap },
    { name: 'CDN', status: 'healthy', responseTime: '120ms', uptime: '99.7%', icon: Globe },
    { name: 'Email Servisi', status: 'healthy', responseTime: '250ms', uptime: '99.2%', icon: Shield }
  ];

  const recentAlerts = [
    { id: 1, type: 'warning', message: 'CPU kullanımı %85\'e ulaştı', time: '2 dakika önce', severity: 'medium' },
    { id: 2, type: 'error', message: 'Redis bağlantı hatası', time: '5 dakika önce', severity: 'high' },
    { id: 3, type: 'info', message: 'Veritabanı yedeklemesi tamamlandı', time: '15 dakika önce', severity: 'low' },
    { id: 4, type: 'warning', message: 'Disk kullanımı %80\'e yaklaştı', time: '1 saat önce', severity: 'medium' },
    { id: 5, type: 'info', message: 'Sistem güncellemesi başarılı', time: '2 saat önce', severity: 'low' }
  ];

  const performanceData = [
    { time: '00:00', cpu: 45, memory: 60, requests: 800 },
    { time: '04:00', cpu: 35, memory: 55, requests: 600 },
    { time: '08:00', cpu: 70, memory: 75, requests: 1200 },
    { time: '12:00', cpu: 85, memory: 80, requests: 1500 },
    { time: '16:00', cpu: 75, memory: 78, requests: 1400 },
    { time: '20:00', cpu: 65, memory: 70, requests: 1100 },
    { time: '24:00', cpu: 50, memory: 65, requests: 900 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50 text-red-800';
      case 'medium': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'low': return 'border-blue-200 bg-blue-50 text-blue-800';
      default: return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sistem İzleme</h1>
          <p className="text-gray-600">Sunucu durumu ve performans metrikleri</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Son güncelleme</div>
            <div className="text-sm font-mono text-gray-900">
              {lastUpdate.toLocaleTimeString('tr-TR')}
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Yenile
          </button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sistem Durumu</p>
              <p className="text-2xl font-bold text-gray-900">{systemMetrics.uptime}</p>
              <p className="text-xs text-green-600">Çevrimiçi</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Yanıt Süresi</p>
              <p className="text-2xl font-bold text-gray-900">{systemMetrics.responseTime}</p>
              <p className="text-xs text-blue-600">Ortalama</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aktif Bağlantı</p>
              <p className="text-2xl font-bold text-gray-900">{systemMetrics.activeConnections}</p>
              <p className="text-xs text-purple-600">Şu anda</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Dakikada İstek</p>
              <p className="text-2xl font-bold text-gray-900">{systemMetrics.requestsPerMinute}</p>
              <p className="text-xs text-yellow-600">Son 1 dk</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Server Status */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Sunucu Durumu</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {serverStatus.map((server, index) => {
                  const Icon = server.icon;
                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-4">
                          <Icon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{server.name}</div>
                          <div className="text-sm text-gray-500">Yanıt: {server.responseTime}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{server.uptime}</div>
                          <div className="text-xs text-gray-500">Uptime</div>
                        </div>
                        <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(server.status)}`}>
                          {getStatusIcon(server.status)}
                          <span className="ml-1 capitalize">{server.status}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Resource Usage */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Kaynak Kullanımı</h3>
            </div>
            <div className="p-6 space-y-6">
              {/* CPU Usage */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">CPU</span>
                  <span className="text-sm text-gray-900">{systemMetrics.cpuUsage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${systemMetrics.cpuUsage > 80 ? 'bg-red-500' : systemMetrics.cpuUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${systemMetrics.cpuUsage}%` }}
                  ></div>
                </div>
              </div>

              {/* Memory Usage */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Bellek</span>
                  <span className="text-sm text-gray-900">{systemMetrics.memoryUsage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${systemMetrics.memoryUsage > 80 ? 'bg-red-500' : systemMetrics.memoryUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${systemMetrics.memoryUsage}%` }}
                  ></div>
                </div>
              </div>

              {/* Disk Usage */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Disk</span>
                  <span className="text-sm text-gray-900">{systemMetrics.diskUsage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${systemMetrics.diskUsage > 80 ? 'bg-red-500' : systemMetrics.diskUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${systemMetrics.diskUsage}%` }}
                  ></div>
                </div>
              </div>

              {/* Network Latency */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Ağ Gecikmesi</span>
                  <span className="text-sm text-gray-900">{systemMetrics.networkLatency}ms</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${systemMetrics.networkLatency > 50 ? 'bg-red-500' : systemMetrics.networkLatency > 20 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(systemMetrics.networkLatency * 2, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">24 Saatlik Performans</h3>
        </div>
        <div className="p-6">
          <div className="h-64 flex items-end justify-between space-x-2">
            {performanceData.map((data, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                <div className="w-full flex flex-col space-y-1">
                  <div 
                    className="bg-blue-500 rounded-t"
                    style={{ height: `${(data.cpu / 100) * 100}px` }}
                    title={`CPU: ${data.cpu}%`}
                  ></div>
                  <div 
                    className="bg-green-500"
                    style={{ height: `${(data.memory / 100) * 100}px` }}
                    title={`Memory: ${data.memory}%`}
                  ></div>
                  <div 
                    className="bg-purple-500 rounded-b"
                    style={{ height: `${(data.requests / 2000) * 100}px` }}
                    title={`Requests: ${data.requests}`}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">{data.time}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">CPU</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Bellek</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">İstekler</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Son Uyarılar</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentAlerts.map((alert) => (
            <div key={alert.id} className="px-6 py-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  {alert.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                  {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                  {alert.type === 'info' && <CheckCircle className="w-5 h-5 text-blue-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getAlertColor(alert.severity)}`}>
                  {alert.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
