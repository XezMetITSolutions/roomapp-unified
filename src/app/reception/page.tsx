'use client';

import { useState, useEffect } from 'react';
import { useHotelStore } from '@/store/hotelStore';
import { sampleRequests } from '@/lib/sampleData';
import { translate } from '@/lib/translations';
import { Language, Request } from '@/types';
import { ApiService, GuestRequest } from '@/services/api';
import { useNotifications } from '@/hooks/useNotifications';
import { 
  Hotel, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  Phone,
  User,
  Calendar,
  Filter,
  Search
} from 'lucide-react';

export default function ReceptionPanel() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('tr');
  const [requests, setRequests] = useState<GuestRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'urgent' | 'pending' | 'in_progress'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<GuestRequest | null>(null);
  const [newRequests, setNewRequests] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    completedToday: 0,
    averageResponseTime: 0,
  });

  // Bildirim sistemi
  const { addNotification } = useNotifications();

  // Veri yükleme
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // 30 saniyede bir güncelle
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [requestsData, statsData] = await Promise.all([
        ApiService.getGuestRequests(),
        ApiService.getStatistics(),
      ]);
      
      setRequests(requestsData);
      setStatistics(statsData);
      
      // Yeni talepleri kontrol et
      const newCount = requestsData.filter(r => 
        new Date(r.createdAt).getTime() > Date.now() - 300000 // Son 5 dakika
      ).length;
      setNewRequests(newCount);
      
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback: Mock data kullan
      setRequests(sampleRequests as any[]);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick response templates
  const quickResponses = [
    { id: 'acknowledge', text: 'Talebiniz alındı, en kısa sürede yanıtlanacaktır.', icon: CheckCircle },
    { id: 'in_progress', text: 'Talebiniz işleme alındı, personelimiz yolda.', icon: Clock },
    { id: 'completed', text: 'Talebiniz tamamlandı, memnun kaldıysanız değerlendirebilirsiniz.', icon: CheckCircle },
    { id: 'escalate', text: 'Talebiniz üst seviyeye çıkarıldı, acil müdahale yapılacaktır.', icon: AlertTriangle }
  ];

  const filteredRequests = requests.filter(request => {
    const matchesFilter = filter === 'all' || 
      (filter === 'urgent' && request.priority === 'urgent') ||
      (filter === 'pending' && request.status === 'pending') ||
      (filter === 'in_progress' && request.status === 'in_progress');
    
    const matchesSearch = request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.roomId.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleQuickResponse = async (requestId: string, responseType: string) => {
    const response = quickResponses.find(r => r.id === responseType);
    if (!response) return;

    try {
      // API'ye güncelleme gönder
      const newStatus = responseType === 'completed' ? 'completed' : 
                       responseType === 'in_progress' ? 'in_progress' : 
                       'pending';
      
      await ApiService.updateRequestStatus(requestId, newStatus as any, response.text);
      
      // Local state'i güncelle
      setRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { 
              ...req, 
              status: newStatus,
              notes: response.text,
              updatedAt: new Date().toISOString()
            }
          : req
      ));

      // Bildirim gönder
      addNotification({
        type: 'success',
        title: 'Yanıt Gönderildi',
        message: `Talep başarıyla güncellendi.`,
      });
      
    } catch (error) {
      console.error('Error updating request:', error);
      addNotification({
        type: 'error',
        title: 'Hata',
        message: 'Yanıt gönderilirken bir hata oluştu.',
      });
    }

    // Close modal if open
    setSelectedRequest(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Hotel className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Resepsiyon Paneli
                </h1>
                <p className="text-gray-600">
                  Misafir taleplerini yönetin ve takip edin
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {newRequests > 0 && (
                <div className="relative">
                  <button className="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center hover:bg-red-600 transition-colors">
                    <AlertTriangle className="w-5 h-5" />
                  </button>
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {newRequests}
                  </span>
                </div>
              )}
              <select
                value={currentLanguage}
                onChange={(e) => setCurrentLanguage(e.target.value as Language)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="tr">🇹🇷 Türkçe</option>
                <option value="de">🇩🇪 Deutsch</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Oda numarası veya açıklama ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'Tümü', count: requests.length },
                { id: 'urgent', label: 'Acil', count: requests.filter(r => r.priority === 'urgent').length },
                { id: 'pending', label: 'Bekleyen', count: requests.filter(r => r.status === 'pending').length },
                { id: 'in_progress', label: 'İşlemde', count: requests.filter(r => r.status === 'in_progress').length }
              ].map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id as any)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    filter === filterOption.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                  }`}
                >
                  {filterOption.label} ({filterOption.count})
                </button>
              ))}
            </div>
          </div>
        </div>
                  
        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-xl font-bold text-gray-900">
                      Oda {request.roomId.replace('room-', '')}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(request.priority)}`}>
                      <div className="flex items-center space-x-1">
                        {getPriorityIcon(request.priority)}
                        <span>{request.priority === 'urgent' ? 'ACİL' :
                               request.priority === 'high' ? 'YÜKSEK' :
                               request.priority === 'medium' ? 'ORTA' :
                               request.priority === 'low' ? 'DÜŞÜK' : String(request.priority || '').toUpperCase()}</span>
                      </div>
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                      {request.status === 'pending' ? 'BEKLEMEDE' :
                       request.status === 'in_progress' ? 'İŞLEMDE' :
                       request.status === 'completed' ? 'TAMAMLANDI' : 'İPTAL'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{request.type === 'housekeeping' ? 'Temizlik' : 
                             request.type === 'maintenance' ? 'Bakım' :
                             request.type === 'concierge' ? 'Konsiyerj' : request.type}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(request.createdAt).toLocaleString('tr-TR')}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{request.description}</p>
                  
                  {request.notes && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                          <p className="text-sm font-medium text-blue-900">Yanıt:</p>
                          <p className="text-sm text-blue-700">{request.notes}</p>
                        </div>
                      </div>
                  </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                  >
                    Yanıt Ver
                  </button>
                  <button 
                    onClick={() => {
                      alert(`Oda ${request.roomId.replace('room-', '')} Detayları:\n\nİstek: ${request.description}\nÖncelik: ${request.priority}\nDurum: ${request.status}\nOluşturulma: ${new Date(request.createdAt).toLocaleString('tr-TR')}`);
                    }}
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold"
                  >
                    Detaylar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">İstek Bulunamadı</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Arama kriterlerinize uygun istek bulunamadı.' : 'Henüz hiç istek bulunmuyor.'}
            </p>
          </div>
        )}
      </div>

      {/* Quick Response Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Oda {selectedRequest.roomId.replace('room-', '')} - Hızlı Yanıt
            </h3>
            
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">İstek:</p>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-xl">{selectedRequest.description}</p>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700">Hızlı Yanıtlar:</p>
              {quickResponses.map((response) => {
                const IconComponent = response.icon;
                return (
                  <button
                    key={response.id}
                    onClick={() => handleQuickResponse(selectedRequest.id, response.id)}
                    className="w-full text-left p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-blue-300 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-900">{response.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setSelectedRequest(null)}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}