"use client";

import { useState, useEffect } from 'react';
import { useAnnouncementStore } from '@/store/announcementStore';

// Otomatik çeviri tablosu
const translationDictionary: Record<string, Record<string, string>> = {
  // Tam cümle çevirileri
  'Yeni Menü Öğeleri': {
    en: 'New Menu Items',
    ru: 'Новые пункты меню',
    ar: 'عناصر القائمة الجديدة',
    de: 'Neue Menüpunkte'
  },
  'Restoranımızda yeni yemek seçenekleri eklendi. Menüyü inceleyebilirsiniz.': {
    en: 'New food options have been added to our restaurant. You can check the menu.',
    ru: 'В нашем ресторане добавлены новые варианты еды. Вы можете ознакомиться с меню.',
    ar: 'تم إضافة خيارات طعام جديدة إلى مطعمنا. يمكنك الاطلاع على القائمة.',
    de: 'Neue Speiseoptionen wurden zu unserem Restaurant hinzugefügt. Sie können die Speisekarte einsehen.'
  },
  'Özel İndirim': {
    en: 'Special Discount',
    ru: 'Специальная скидка',
    ar: 'خصم خاص',
    de: 'Spezieller Rabatt'
  },
  'Bu hafta sonu tüm içeceklerde %20 indirim!': {
    en: '20% discount on all drinks this weekend!',
    ru: '20% скидка на все напитки в эти выходные!',
    ar: 'خصم 20% على جميع المشروبات في نهاية هذا الأسبوع!',
    de: '20% Rabatt auf alle Getränke an diesem Wochenende!'
  },
  'Havuz Bakımı': {
    en: 'Pool Maintenance',
    ru: 'Обслуживание бассейна',
    ar: 'صيانة المسبح',
    de: 'Pool-Wartung'
  },
  'Havuz bakımı nedeniyle 15-16 Ocak tarihleri arasında havuz kapalı olacaktır.': {
    en: 'The pool will be closed on January 15-16 due to pool maintenance.',
    ru: 'Бассейн будет закрыт 15-16 января из-за обслуживания бассейна.',
    ar: 'سيتم إغلاق المسبح في 15-16 يناير بسبب صيانة المسبح.',
    de: 'Der Pool wird am 15-16. Januar aufgrund der Pool-Wartung geschlossen.'
  },
  'Güvenlik Uyarısı': {
    en: 'Security Warning',
    ru: 'Предупреждение о безопасности',
    ar: 'تحذير أمني',
    de: 'Sicherheitswarnung'
  },
  'Gece saatlerinde otel girişlerinde kimlik kontrolü yapılacaktır.': {
    en: 'Identity checks will be carried out at hotel entrances during night hours.',
    ru: 'Проверка документов будет проводиться на входах в отель в ночные часы.',
    ar: 'سيتم إجراء فحوصات الهوية عند مداخل الفندق في ساعات الليل.',
    de: 'Ausweiskontrollen werden nachts an den Hotelzugängen durchgeführt.'
  }
};

// Çeviri fonksiyonu
function translateText(text: string, targetLang: string): string {
  if (targetLang === 'tr') return text;
  
  const translation = translationDictionary[text]?.[targetLang];
  return translation || text;
}

interface AnnouncementTranslations {
  title: string;
  content: string;
  linkText?: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'promotion' | 'maintenance' | 'advertisement';
  category: 'general' | 'menu' | 'hotel' | 'promotion';
  isActive: boolean;
  startDate: string;
  endDate?: string;
  targetRooms?: string[];
  createdAt: string;
  createdBy: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  linkUrl?: string;
  linkText?: string;
  icon?: string;
  translations?: {
    [lang: string]: AnnouncementTranslations;
  };
}

export default function AnnouncementsManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedIcon, setSelectedIcon] = useState<string>('');
  const [formData, setFormData] = useState<Partial<Announcement> & { translations?: { [lang: string]: { title: string; content: string; linkText?: string; } } }>({});

  // İkon seçenekleri
  const iconOptions = [
    { name: 'info', label: 'Bilgi', icon: 'ℹ️', color: 'text-blue-500' },
    { name: 'megaphone', label: 'Duyuru', icon: '📢', color: 'text-orange-500' },
    { name: 'star', label: 'Yıldız', icon: '⭐', color: 'text-yellow-500' },
    { name: 'gift', label: 'Hediye', icon: '🎁', color: 'text-green-500' },
    { name: 'utensils', label: 'Yemek', icon: '🍽️', color: 'text-red-500' },
    { name: 'coffee', label: 'Kahve', icon: '☕', color: 'text-amber-600' },
    { name: 'wine', label: 'İçecek', icon: '🍷', color: 'text-purple-500' },
    { name: 'heart', label: 'Kalp', icon: '❤️', color: 'text-pink-500' },
    { name: 'leaf', label: 'Sağlıklı', icon: '🍃', color: 'text-green-600' },
    { name: 'zap', label: 'Hızlı', icon: '⚡', color: 'text-yellow-400' },
    { name: 'crown', label: 'Premium', icon: '👑', color: 'text-yellow-600' },
    { name: 'flame', label: 'Sıcak', icon: '🔥', color: 'text-red-400' },
    { name: 'sparkles', label: 'Özel', icon: '✨', color: 'text-indigo-500' },
    { name: 'target', label: 'Hedef', icon: '🎯', color: 'text-blue-600' },
    { name: 'trophy', label: 'Başarı', icon: '🏆', color: 'text-yellow-500' },
    { name: 'bell', label: 'Bildirim', icon: '🔔', color: 'text-gray-600' },
    { name: 'home', label: 'Otel', icon: '🏠', color: 'text-gray-700' },
    { name: 'users', label: 'Müşteri', icon: '👥', color: 'text-blue-700' },
    { name: 'settings', label: 'Sistem', icon: '⚙️', color: 'text-gray-500' },
    { name: 'wrench', label: 'Bakım', icon: '🔧', color: 'text-orange-600' },
  ];

  const {
    announcements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement, 
    toggleAnnouncement 
  } = useAnnouncementStore();

  // Mock data - store'da zaten var, bu kısmı kaldırabiliriz
  const [localAnnouncements, setLocalAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Havuz Bakımı',
      content: 'Havuz bakımı nedeniyle 15-16 Ocak tarihleri arasında havuz kapalı olacaktır.',
      type: 'maintenance',
      category: 'hotel',
      isActive: true,
      startDate: '2024-01-15',
      endDate: '2024-01-16',
      createdAt: '2024-01-10',
      createdBy: 'Admin',
      priority: 'HIGH',
    },
    {
      id: '2',
      title: 'Yeni Menü Öğeleri',
      content: 'Restoranımızda yeni yemek seçenekleri eklendi. Menüyü inceleyebilirsiniz.',
      type: 'info',
      category: 'menu',
      isActive: true,
      startDate: '2024-01-12',
      createdAt: '2024-01-12',
      createdBy: 'Chef',
      priority: 'MEDIUM',
    },
    {
      id: '3',
      title: 'Özel İndirim',
      content: 'Bu hafta sonu tüm içeceklerde %20 indirim!',
      type: 'promotion',
      category: 'promotion',
      isActive: false,
      startDate: '2024-01-08',
      endDate: '2024-01-09',
      createdAt: '2024-01-07',
      createdBy: 'Manager',
      priority: 'LOW',
    },
    {
      id: '4',
      title: 'Güvenlik Uyarısı',
      content: 'Gece saatlerinde otel girişlerinde kimlik kontrolü yapılacaktır.',
      type: 'warning',
      category: 'general',
      isActive: true,
      startDate: '2024-01-14',
      createdAt: '2024-01-13',
      createdBy: 'Security',
      priority: 'URGENT',
    },
  ]);

  const languages = ['en', 'ru', 'ar', 'de'];
  const langNames = {
    en: 'English',
    ru: 'Русский',
    ar: 'العربية',
    de: 'Deutsch'
  };

  // Filtrelenmiş duyurular
  const filteredAnnouncements = announcements.filter(announcement => {
    if (filter === 'active') return announcement.isActive;
    if (filter === 'inactive') return !announcement.isActive;
    return true;
  });

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Çok dilli çevirileri topla
    const translations: Record<string, AnnouncementTranslations> = {};
    
    languages.forEach(lang => {
      const title = formData.get(`${lang}_title`) as string;
      const content = formData.get(`${lang}_content`) as string;
      const linkText = formData.get(`${lang}_linkText`) as string;
      
      if (title && content) {
        translations[lang] = { title, content, linkText };
      }
    });
    
    const announcementData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      type: formData.get('type') as any,
      category: formData.get('category') as any,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string || undefined,
      isActive: formData.get('isActive') === 'on',
      linkUrl: formData.get('linkUrl') as string || undefined,
      linkText: formData.get('linkText') as string || undefined,
      icon: selectedIcon || undefined,
      translations: Object.keys(translations).length > 0 ? translations : undefined,
      priority: 'MEDIUM' as const,
      targetRooms: [],
    };

    if (selectedAnnouncement) {
      // Edit existing announcement
      updateAnnouncement(selectedAnnouncement.id, announcementData);
      setShowEditModal(false);
    } else {
      // Add new announcement
      const newAnnouncement: Announcement = {
        id: Date.now().toString(),
        title: announcementData.title || '',
        content: announcementData.content || '',
        type: announcementData.type || 'info',
        category: announcementData.category || 'general',
        isActive: announcementData.isActive ?? true,
        startDate: announcementData.startDate || new Date().toISOString().split('T')[0],
        endDate: announcementData.endDate,
        targetRooms: announcementData.targetRooms || [],
        createdAt: new Date().toISOString(),
        createdBy: 'Admin',
        priority: announcementData.priority || 'MEDIUM',
        linkUrl: announcementData.linkUrl,
        linkText: announcementData.linkText,
        icon: announcementData.icon,
        translations: announcementData.translations,
      };
      addAnnouncement(newAnnouncement);
      setShowAddModal(false);
    }
    setSelectedAnnouncement(null);
    setFormData({});
    setSelectedIcon('');
  };

  const handleEdit = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setFormData(announcement);
    setSelectedIcon(announcement.icon || '');
    setShowEditModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu duyuruyu silmek istediğinizden emin misiniz?')) {
      deleteAnnouncement(id);
    }
  };

  const handleToggle = (id: string) => {
    toggleAnnouncement(id);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'promotion': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'advertisement': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Duyuru Yönetimi</h1>
              <p className="text-gray-600 mt-1">Otel duyurularını yönetin ve müşterilere iletin</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <span>+</span>
              <span>Yeni Duyuru</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Tümü ({announcements.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Aktif ({announcements.filter(a => a.isActive).length})
              </button>
              <button
                onClick={() => setFilter('inactive')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'inactive'
                    ? 'bg-gray-100 text-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Pasif ({announcements.filter(a => !a.isActive).length})
              </button>
            </div>
          </div>
        </div>

        {/* Announcements List */}
        <div className="space-y-6">
          {filteredAnnouncements.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Duyuru bulunamadı</h3>
              <p className="text-gray-600 mb-4">
                {filter === 'active' 
                  ? 'Aktif duyuru bulunmuyor.' 
                  : filter === 'inactive'
                  ? 'Pasif duyuru bulunmuyor.'
                  : 'Henüz hiç duyuru eklenmemiş.'
                }
              </p>
              {filter === 'all' && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  İlk Duyurunuzu Ekleyin
                </button>
              )}
            </div>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <div key={announcement.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        {announcement.icon && (
                          <span className="text-2xl">{iconOptions.find(opt => opt.name === announcement.icon)?.icon}</span>
                        )}
                        <h3 className="text-xl font-semibold text-gray-900">{announcement.title}</h3>
                        <div className="flex space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(announcement.type)}`}>
                            {announcement.type}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                            {announcement.priority}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${announcement.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {announcement.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{announcement.content}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span>Kategori: <span className="font-medium">{announcement.category}</span></span>
                        <span>Başlangıç: <span className="font-medium">{new Date(announcement.startDate).toLocaleDateString('tr-TR')}</span></span>
                        {announcement.endDate && (
                          <span>Bitiş: <span className="font-medium">{new Date(announcement.endDate).toLocaleDateString('tr-TR')}</span></span>
                        )}
                        <span>Oluşturan: <span className="font-medium">{announcement.createdBy}</span></span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleToggle(announcement.id)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          announcement.isActive
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {announcement.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                      </button>
                      <button
                        onClick={() => handleEdit(announcement)}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium hover:bg-blue-200 transition-colors"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(announcement.id)}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm font-medium hover:bg-red-200 transition-colors"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {showAddModal ? 'Yeni Duyuru Ekle' : 'Duyuru Düzenle'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedAnnouncement(null);
                    setFormData({});
                    setSelectedIcon('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Başlık *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={selectedAnnouncement?.title || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Duyuru başlığı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tip</label>
                  <select
                    name="type"
                    defaultValue={selectedAnnouncement?.type || 'info'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="info">Bilgi</option>
                    <option value="warning">Uyarı</option>
                    <option value="promotion">Promosyon</option>
                    <option value="maintenance">Bakım</option>
                    <option value="advertisement">Reklam</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İçerik *</label>
                <textarea
                  name="content"
                  required
                  rows={4}
                  defaultValue={selectedAnnouncement?.content || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Duyuru içeriği"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                  <select
                    name="category"
                    defaultValue={selectedAnnouncement?.category || 'general'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="general">Genel</option>
                    <option value="menu">Menü</option>
                    <option value="hotel">Otel</option>
                    <option value="promotion">Promosyon</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Başlangıç Tarihi</label>
                  <input
                    type="date"
                    name="startDate"
                    defaultValue={selectedAnnouncement?.startDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bitiş Tarihi (Opsiyonel)</label>
                  <input
                    type="date"
                    name="endDate"
                    defaultValue={selectedAnnouncement?.endDate || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* İkon Seçimi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İkon Seçimi</label>
                <div className="grid grid-cols-5 gap-3">
                  {iconOptions.map((option) => (
                    <button
                      key={option.name}
                      type="button"
                      onClick={() => setSelectedIcon(option.name)}
                      className={`p-3 border-2 rounded-lg text-center transition-colors ${
                        selectedIcon === option.name
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{option.icon}</div>
                      <div className="text-xs text-gray-600">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Link Bilgileri */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Link URL (Opsiyonel)</label>
                  <input
                    type="url"
                    name="linkUrl"
                    defaultValue={selectedAnnouncement?.linkUrl || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Link Metni (Opsiyonel)</label>
                  <input
                    type="text"
                    name="linkText"
                    defaultValue={selectedAnnouncement?.linkText || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Detayları Görüntüle"
                  />
                </div>
              </div>

              {/* Durum */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={selectedAnnouncement?.isActive ?? true}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Duyuru aktif olsun
                </label>
              </div>

              {/* Çok Dilli Çeviriler */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Çok Dilli Çeviriler (Opsiyonel)</h3>
                  <button
                    type="button"
                    onClick={() => {
                      // Otomatik çeviri yap
                      const newFormData: any = { ...formData };
                      ['en', 'ru', 'ar', 'de'].forEach(lang => {
                        if (!newFormData.translations) newFormData.translations = {};
                        if (!newFormData.translations[lang]) newFormData.translations[lang] = {};
                        
                        newFormData.translations[lang].title = translateText(formData.title || '', lang);
                        newFormData.translations[lang].content = translateText(formData.content || '', lang);
                        if (formData.linkText) {
                          newFormData.translations[lang].linkText = translateText(formData.linkText, lang);
                        }
                      });
                      setFormData(newFormData);
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors flex items-center space-x-2"
                  >
                    <span>✨</span>
                    <span>Otomatik Çeviri</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {languages.map((lang) => (
                    <div key={lang} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-700">{langNames[lang as keyof typeof langNames]}</h4>
                        <button
                          type="button"
                          onClick={() => {
                            // Bu dil için otomatik çeviri yap
                            const newFormData: any = { ...formData };
                            if (!newFormData.translations) newFormData.translations = {};
                            if (!newFormData.translations[lang]) newFormData.translations[lang] = {};
                            
                            newFormData.translations[lang].title = translateText(formData.title || '', lang);
                            newFormData.translations[lang].content = translateText(formData.content || '', lang);
                            if (formData.linkText) {
                              newFormData.translations[lang].linkText = translateText(formData.linkText, lang);
                            }
                            setFormData(newFormData);
                            
                            // Form alanlarını güncelle
                            const titleInput = document.querySelector(`input[name="${lang}_title"]`) as HTMLInputElement;
                            const contentInput = document.querySelector(`textarea[name="${lang}_content"]`) as HTMLTextAreaElement;
                            const linkTextInput = document.querySelector(`input[name="${lang}_linkText"]`) as HTMLInputElement;
                            
                            if (titleInput) titleInput.value = newFormData.translations[lang].title;
                            if (contentInput) contentInput.value = newFormData.translations[lang].content;
                            if (linkTextInput && formData.linkText) linkTextInput.value = newFormData.translations[lang].linkText;
                          }}
                          className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 transition-colors flex items-center space-x-1"
                        >
                          <span>✨</span>
                          <span>Çevir</span>
                        </button>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                        <input
                          type="text"
                          name={`${lang}_title`}
                          defaultValue={selectedAnnouncement?.translations?.[lang]?.title || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
                        <textarea
                          name={`${lang}_content`}
                          rows={3}
                          defaultValue={selectedAnnouncement?.translations?.[lang]?.content || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Link Metni</label>
                        <input
                          type="text"
                          name={`${lang}_linkText`}
                          defaultValue={selectedAnnouncement?.translations?.[lang]?.linkText || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedAnnouncement(null);
                    setFormData({});
                    setSelectedIcon('');
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {showAddModal ? 'Duyuru Ekle' : 'Değişiklikleri Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
