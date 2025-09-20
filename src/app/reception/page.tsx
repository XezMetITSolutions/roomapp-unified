'use client';

import { useState, useEffect } from 'react';
import { useHotelStore } from '@/store/hotelStore';
import { sampleRequests } from '@/lib/sampleData';
import { translate } from '@/lib/translations';
import { Language, Request } from '@/types';
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
  const [requests, setRequests] = useState<any[]>(sampleRequests);
  const [filter, setFilter] = useState<'all' | 'urgent' | 'pending' | 'in_progress'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

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

  const handleQuickResponse = (requestId: string, responseType: string) => {
    const response = quickResponses.find(r => r.id === responseType);
    if (!response) return;

    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            status: responseType === 'completed' ? 'completed' : 
                   responseType === 'in_progress' ? 'in_progress' : req.status,
            notes: response.text
          }
        : req
    ));

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
    <div className="min-h-screen bg-gradient-to-br from-hotel-cream to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-hotel-gold rounded-xl flex items-center justify-center">
                <Hotel className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {translate('reception_panel_title', currentLanguage)}
                </h1>
                <p className="text-gray-600">
                  {translate('reception_panel_desc', currentLanguage)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={currentLanguage}
                onChange={(e) => setCurrentLanguage(e.target.value as Language)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1 bg-white"
              >
                <option value="tr">🇹🇷 Türkçe</option>
                <option value="de">🇩🇪 Deutsch</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="hotel-card p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {requests.filter(r => r.priority === 'urgent').length}
            </h3>
            <p className="text-gray-600">Acil İstekler</p>
                      </div>
          <div className="hotel-card p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-yellow-600" />
                                </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {requests.filter(r => r.status === 'pending').length}
                                </h3>
            <p className="text-gray-600">Bekleyen İstekler</p>
                                </div>
          <div className="hotel-card p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-blue-600" />
                              </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {requests.filter(r => r.status === 'in_progress').length}
            </h3>
            <p className="text-gray-600">İşlemde</p>
                            </div>
          <div className="hotel-card p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
                          </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {requests.filter(r => r.status === 'completed').length}
            </h3>
            <p className="text-gray-600">Tamamlanan</p>
                          </div>
                        </div>

        {/* Filters and Search */}
        <div className="hotel-card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Oda numarası veya açıklama ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              {[
                { id: 'all', label: 'Tümü', count: requests.length },
                { id: 'urgent', label: 'Acil', count: requests.filter(r => r.priority === 'urgent').length },
                { id: 'pending', label: 'Bekleyen', count: requests.filter(r => r.status === 'pending').length },
                { id: 'in_progress', label: 'İşlemde', count: requests.filter(r => r.status === 'in_progress').length }
              ].map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === filterOption.id
                      ? 'bg-hotel-gold text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
            <div key={request.id} className="hotel-card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-lg font-semibold text-gray-900">
                      Oda {request.roomId}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                      <div className="flex items-center space-x-1">
                        {getPriorityIcon(request.priority)}
                        <span>{request.priority.toUpperCase()}</span>
                  </div>
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status === 'pending' ? 'BEKLEMEDE' :
                       request.status === 'in_progress' ? 'İŞLEMDE' :
                       request.status === 'completed' ? 'TAMAMLANDI' : 'İPTAL'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{request.type}</span>
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
                    className="bg-hotel-navy text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors text-sm"
                        >
                    Yanıt Ver
                        </button>
                  <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                    Detaylar
                      </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="hotel-card p-12 text-center">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Oda {selectedRequest.roomId} - Hızlı Yanıt
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">İstek:</p>
              <p className="text-gray-900">{selectedRequest.description}</p>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Hızlı Yanıtlar:</p>
              {quickResponses.map((response) => {
                const IconComponent = response.icon;
                return (
                  <button
                    key={response.id}
                    onClick={() => handleQuickResponse(selectedRequest.id, response.id)}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-900">{response.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setSelectedRequest(null)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
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