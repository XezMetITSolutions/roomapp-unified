"use client";

import { useState } from 'react';
import { 
  Headphones, 
  Search, 
  Filter, 
  Plus, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  User,
  Mail,
  Phone,
  Calendar,
  Tag,
  Send,
  FileText,
  Star,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Archive,
  Trash2,
  Eye,
  Edit,
  MoreVertical,
  X
} from 'lucide-react';

export default function SupportSystem() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [replyText, setReplyText] = useState('');

  // Mock data - gerçek API'den gelecek
  const supportStats = {
    totalTickets: 156,
    openTickets: 23,
    resolvedTickets: 128,
    averageResponseTime: '2.5 saat',
    customerSatisfaction: '4.8/5'
  };

  const tickets = [
    {
      id: 'TKT-2024-001',
      subject: 'QR kod çalışmıyor',
      description: 'Oda 101\'deki QR kod taranmıyor, müşteriler menüye erişemiyor.',
      tenantName: 'Grand Hotel Istanbul',
      tenantEmail: 'info@grandhotel.com',
      priority: 'high',
      status: 'open',
      category: 'technical',
      createdAt: '2024-01-15 14:30',
      updatedAt: '2024-01-15 16:45',
      assignedTo: 'Teknik Destek',
      lastReply: 'QR kod yeniden oluşturuldu, test ediliyor.',
      replies: [
        {
          id: 1,
          author: 'Grand Hotel Istanbul',
          message: 'QR kod çalışmıyor, müşteriler menüye erişemiyor.',
          timestamp: '2024-01-15 14:30',
          type: 'customer'
        },
        {
          id: 2,
          author: 'Teknik Destek',
          message: 'QR kod yeniden oluşturuldu, test ediliyor.',
          timestamp: '2024-01-15 16:45',
          type: 'support'
        }
      ]
    },
    {
      id: 'TKT-2024-002',
      subject: 'Menü öğeleri görünmüyor',
      description: 'Bazı menü öğeleri QR menüde görünmüyor, ancak admin panelinde mevcut.',
      tenantName: 'Plaza Hotel Ankara',
      tenantEmail: 'info@plazahotel.com',
      priority: 'medium',
      status: 'in-progress',
      category: 'bug',
      createdAt: '2024-01-14 09:15',
      updatedAt: '4 saat önce',
      assignedTo: 'Geliştirme Ekibi',
      lastReply: 'Sorun tespit edildi, düzeltme yapılıyor.',
      replies: [
        {
          id: 1,
          author: 'Plaza Hotel Ankara',
          message: 'Bazı menü öğeleri QR menüde görünmüyor.',
          timestamp: '2024-01-14 09:15',
          type: 'customer'
        },
        {
          id: 2,
          author: 'Geliştirme Ekibi',
          message: 'Sorun tespit edildi, düzeltme yapılıyor.',
          timestamp: '2024-01-14 11:30',
          type: 'support'
        }
      ]
    },
    {
      id: 'TKT-2024-003',
      subject: 'Çoklu dil desteği sorunu',
      description: 'İngilizce çeviriler doğru görünmüyor, bazı kelimeler eksik.',
      tenantName: 'Resort Hotel Antalya',
      tenantEmail: 'info@resorthotel.com',
      priority: 'low',
      status: 'resolved',
      category: 'feature',
      createdAt: '2024-01-13 16:20',
      updatedAt: '2024-01-14 10:15',
      assignedTo: 'Çeviri Ekibi',
      lastReply: 'Çeviri sorunları düzeltildi, test edildi.',
      replies: [
        {
          id: 1,
          author: 'Resort Hotel Antalya',
          message: 'İngilizce çeviriler doğru görünmüyor.',
          timestamp: '2024-01-13 16:20',
          type: 'customer'
        },
        {
          id: 2,
          author: 'Çeviri Ekibi',
          message: 'Çeviri sorunları düzeltildi, test edildi.',
          timestamp: '2024-01-14 10:15',
          type: 'support'
        }
      ]
    },
    {
      id: 'TKT-2024-004',
      subject: 'Ödeme sistemi hatası',
      description: 'Kredi kartı ödemeleri işlenmiyor, müşteriler sipariş veremiyor.',
      tenantName: 'Business Hotel Izmir',
      tenantEmail: 'info@businesshotel.com',
      priority: 'urgent',
      status: 'open',
      category: 'payment',
      createdAt: '2024-01-15 11:45',
      updatedAt: '2024-01-15 13:20',
      assignedTo: 'Ödeme Ekibi',
      lastReply: 'Acil müdahale yapılıyor, 1 saat içinde çözülecek.',
      replies: [
        {
          id: 1,
          author: 'Business Hotel Izmir',
          message: 'Kredi kartı ödemeleri işlenmiyor.',
          timestamp: '2024-01-15 11:45',
          type: 'customer'
        },
        {
          id: 2,
          author: 'Ödeme Ekibi',
          message: 'Acil müdahale yapılıyor, 1 saat içinde çözülecek.',
          timestamp: '2024-01-15 13:20',
          type: 'support'
        }
      ]
    },
    {
      id: 'TKT-2024-005',
      subject: 'Yeni özellik talebi',
      description: 'Müşteri geri bildirimlerini toplamak için yeni bir modül istiyoruz.',
      tenantName: 'Luxury Hotel Cappadocia',
      tenantEmail: 'info@luxuryhotel.com',
      priority: 'low',
      status: 'pending',
      category: 'feature-request',
      createdAt: '2024-01-12 14:10',
      updatedAt: '2024-01-12 14:10',
      assignedTo: 'Ürün Ekibi',
      lastReply: 'Talep değerlendiriliyor.',
      replies: [
        {
          id: 1,
          author: 'Luxury Hotel Cappadocia',
          message: 'Müşteri geri bildirimlerini toplamak için yeni bir modül istiyoruz.',
          timestamp: '2024-01-12 14:10',
          type: 'customer'
        }
      ]
    }
  ];

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Acil';
      case 'high': return 'Yüksek';
      case 'medium': return 'Orta';
      case 'low': return 'Düşük';
      default: return 'Bilinmiyor';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Açık';
      case 'in-progress': return 'İşlemde';
      case 'resolved': return 'Çözüldü';
      case 'pending': return 'Bekliyor';
      case 'closed': return 'Kapalı';
      default: return 'Bilinmiyor';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return <AlertTriangle className="w-4 h-4" />;
      case 'bug': return <AlertTriangle className="w-4 h-4" />;
      case 'feature': return <Plus className="w-4 h-4" />;
      case 'payment': return <MessageSquare className="w-4 h-4" />;
      case 'feature-request': return <Star className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const handleViewTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const handleReply = () => {
    if (replyText.trim()) {
      console.log('Reply:', replyText);
      setReplyText('');
    }
  };

  const handleResolveTicket = (ticket: any) => {
    console.log('Resolve ticket:', ticket);
  };

  const handleAssignTicket = (ticket: any) => {
    console.log('Assign ticket:', ticket);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Destek Sistemi</h1>
          <p className="text-gray-600">Müşteri destek taleplerini yönetin</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Talep
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Talep</p>
              <p className="text-2xl font-bold text-gray-900">{supportStats.totalTickets}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Açık Talep</p>
              <p className="text-2xl font-bold text-gray-900">{supportStats.openTickets}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Çözülen</p>
              <p className="text-2xl font-bold text-gray-900">{supportStats.resolvedTickets}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ort. Yanıt</p>
              <p className="text-2xl font-bold text-gray-900">{supportStats.averageResponseTime}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Memnuniyet</p>
              <p className="text-2xl font-bold text-gray-900">{supportStats.customerSatisfaction}</p>
            </div>
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
                placeholder="Talep ID, konu veya işletme adı ile ara..."
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
              <option value="open">Açık</option>
              <option value="in-progress">İşlemde</option>
              <option value="resolved">Çözüldü</option>
              <option value="pending">Bekliyor</option>
              <option value="closed">Kapalı</option>
            </select>
          </div>
          <div className="sm:w-48">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tüm Öncelikler</option>
              <option value="urgent">Acil</option>
              <option value="high">Yüksek</option>
              <option value="medium">Orta</option>
              <option value="low">Düşük</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Talep</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşletme</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Öncelik</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atanan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Son Güncelleme</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{ticket.id}</div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">{ticket.subject}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{ticket.tenantName}</div>
                      <div className="text-sm text-gray-500">{ticket.tenantEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getCategoryIcon(ticket.category)}
                      <span className="ml-2 text-sm text-gray-900 capitalize">{ticket.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                      {getPriorityText(ticket.priority)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {getStatusText(ticket.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.assignedTo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.updatedAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewTicket(ticket)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Görüntüle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleResolveTicket(ticket)}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="Çöz"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAssignTicket(ticket)}
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="Ata"
                      >
                        <User className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Detail Modal */}
      {showModal && selectedTicket && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">{selectedTicket.subject}</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Ticket Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Talep Bilgileri</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">ID:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedTicket.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Durum:</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                          {getStatusText(selectedTicket.status)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Öncelik:</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedTicket.priority)}`}>
                          {getPriorityText(selectedTicket.priority)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Atanan:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedTicket.assignedTo}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">İşletme Bilgileri</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">İşletme:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedTicket.tenantName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedTicket.tenantEmail}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Oluşturulma:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedTicket.createdAt}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Son Güncelleme:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedTicket.updatedAt}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Açıklama</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{selectedTicket.description}</p>
                  </div>
                </div>

                {/* Conversation */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Konuşma</h4>
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {selectedTicket.replies.map((reply: any) => (
                      <div key={reply.id} className={`p-3 rounded-lg ${
                        reply.type === 'customer' ? 'bg-blue-50 ml-0' : 'bg-gray-50 mr-0'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-gray-900">{reply.author}</span>
                          <span className="text-xs text-gray-500">{reply.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-700">{reply.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reply */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Yanıt</h4>
                  <div className="space-y-3">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Yanıtınızı yazın..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Kapat
                      </button>
                      <button
                        onClick={handleReply}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Yanıtla
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
