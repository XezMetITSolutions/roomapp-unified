"use client";

import { useState, useEffect } from 'react';
import { useAnnouncementStore } from '@/store/announcementStore';
import { translateText as translateTextAsync } from '@/lib/translateService';

// Otomatik çeviri tablosu
const translationDictionary: Record<string, Record<string, string>> = {
  // Tam cümle çevirileri
  'Yeni Menü Öğeleri': {
    en: 'New Menu Items',
    ru: 'Новые пункты меню',
    ar: 'عناصر القائمة الجديدة',
    de: 'Neue Menüpunkte'
  },
  'Özel İndirim': {
    en: 'Special Discount',
    ru: 'Специальная скидка',
    ar: 'خصم خاص',
    de: 'Sonderrabatt'
  },
  'Chef\'in Özel Menüsü': {
    en: 'Chef\'s Special Menu',
    ru: 'Специальное меню шеф-повара',
    ar: 'قائمة الشيف الخاصة',
    de: 'Chef\'s Spezialmenü'
  },
  'Happy Hour': {
    en: 'Happy Hour',
    ru: 'Счастливый час',
    ar: 'ساعة سعيدة',
    de: 'Happy Hour'
  },
  'Sağlıklı Seçenekler': {
    en: 'Healthy Options',
    ru: 'Здоровые варианты',
    ar: 'خيارات صحية',
    de: 'Gesunde Optionen'
  },
  'Havuz Bakımı': {
    en: 'Pool Maintenance',
    ru: 'Обслуживание бассейна',
    ar: 'صيانة المسبح',
    de: 'Pool-Wartung'
  },
  'Otel Reklamı': {
    en: 'Hotel Advertisement',
    ru: 'Реклама отеля',
    ar: 'إعلان الفندق',
    de: 'Hotel-Werbung'
  },
  'Yeni lezzetli yemekler menümüze eklendi': {
    en: 'New delicious dishes added to our menu',
    ru: 'Новые вкусные блюда добавлены в наше меню',
    ar: 'تم إضافة أطباق لذيذة جديدة إلى قائمتنا',
    de: 'Neue köstliche Gerichte zu unserer Speisekarte hinzugefügt'
  },
  'Havuz bakım çalışması nedeniyle 2 gün kapalı': {
    en: 'Pool closed for 2 days due to maintenance work',
    ru: 'Бассейн закрыт на 2 дня из-за ремонтных работ',
    ar: 'المسبح مغلق لمدة يومين بسبب أعمال الصيانة',
    de: 'Pool 2 Tage geschlossen wegen Wartungsarbeiten'
  },
  'Detaylı Bilgi': {
    en: 'More Details',
    ru: 'Подробнее',
    ar: 'مزيد من التفاصيل',
    de: 'Weitere Details'
  },
  'İncele': {
    en: 'Explore',
    ru: 'Изучить',
    ar: 'استكشف',
    de: 'Erkunden'
  },
  
  // Kelime çevirileri
  'yeni': {
    en: 'new',
    ru: 'новый',
    ar: 'جديد',
    de: 'neu'
  },
  'menü': {
    en: 'menu',
    ru: 'меню',
    ar: 'قائمة',
    de: 'menü'
  },
  'öğeleri': {
    en: 'items',
    ru: 'пункты',
    ar: 'عناصر',
    de: 'punkte'
  },
  'özel': {
    en: 'special',
    ru: 'специальный',
    ar: 'خاص',
    de: 'spezial'
  },
  'indirim': {
    en: 'discount',
    ru: 'скидка',
    ar: 'خصم',
    de: 'rabatt'
  },
  'chef': {
    en: 'chef',
    ru: 'шеф-повар',
    ar: 'شيف',
    de: 'chef'
  },
  'sağlıklı': {
    en: 'healthy',
    ru: 'здоровый',
    ar: 'صحي',
    de: 'gesund'
  },
  'seçenekler': {
    en: 'options',
    ru: 'варианты',
    ar: 'خيارات',
    de: 'optionen'
  },
  'havuz': {
    en: 'pool',
    ru: 'бассейн',
    ar: 'مسبح',
    de: 'pool'
  },
  'bakım': {
    en: 'maintenance',
    ru: 'обслуживание',
    ar: 'صيانة',
    de: 'wartung'
  },
  'otel': {
    en: 'hotel',
    ru: 'отель',
    ar: 'فندق',
    de: 'hotel'
  },
  'reklamı': {
    en: 'advertisement',
    ru: 'реклама',
    ar: 'إعلان',
    de: 'werbung'
  },
  'lezzetli': {
    en: 'delicious',
    ru: 'вкусный',
    ar: 'لذيذ',
    de: 'köstlich'
  },
  'yemekler': {
    en: 'dishes',
    ru: 'блюда',
    ar: 'أطباق',
    de: 'gerichte'
  },
  'eklendi': {
    en: 'added',
    ru: 'добавлены',
    ar: 'تم إضافة',
    de: 'hinzugefügt'
  },
  'çalışması': {
    en: 'work',
    ru: 'работы',
    ar: 'أعمال',
    de: 'arbeiten'
  },
  'nedeniyle': {
    en: 'due to',
    ru: 'из-за',
    ar: 'بسبب',
    de: 'wegen'
  },
  'gün': {
    en: 'days',
    ru: 'дня',
    ar: 'أيام',
    de: 'tage'
  },
  'kapalı': {
    en: 'closed',
    ru: 'закрыт',
    ar: 'مغلق',
    de: 'geschlossen'
  },
  'detaylı': {
    en: 'detailed',
    ru: 'подробный',
    ar: 'مفصل',
    de: 'detailliert'
  },
  'bilgi': {
    en: 'information',
    ru: 'информация',
    ar: 'معلومات',
    de: 'information'
  },
  'incele': {
    en: 'explore',
    ru: 'изучить',
    ar: 'استكشف',
    de: 'erkunden'
  }
};

// Otomatik çeviri fonksiyonu (offline sözlük) - hızlı ön-çeviri
const translateText = (text: string, targetLang: string): string => {
  if (targetLang === 'tr' || !text.trim()) return text; // Türkçe ise aynen döndür
  
  // Önce tam eşleşme ara
  if (translationDictionary[text] && translationDictionary[text][targetLang]) {
    return translationDictionary[text][targetLang];
  }
  
  // Kelime kelime çeviri yap
  const words = text.split(' ').map(word => word.toLowerCase());
  const translatedWords = words.map(word => {
    // Temizleme işlemi (noktalama işaretlerini kaldır)
    const cleanWord = word.replace(/[.,!?;:]/g, '');
    
    if (translationDictionary[cleanWord] && translationDictionary[cleanWord][targetLang]) {
      return translationDictionary[cleanWord][targetLang];
    }
    
    // Büyük harfle başlayan kelimeler için
    const capitalizedWord = cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
    if (translationDictionary[capitalizedWord] && translationDictionary[capitalizedWord][targetLang]) {
      return translationDictionary[capitalizedWord][targetLang];
    }
    
    return word; // Çeviri bulunamazsa orijinal kelimeyi döndür
  });
  
  return translatedWords.join(' ');
};
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar,
  Clock,
  Megaphone,
  AlertCircle,
  CheckCircle,
  X,
  Info,
  Wrench,
  Star,
  Gift,
  Utensils,
  Coffee,
  Wine,
  Heart,
  Leaf,
  Zap,
  Crown,
  Flame,
  Sparkles,
  Target,
  Trophy,
  Bell,
  Home,
  Users,
  Settings
} from 'lucide-react';

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
    [lang: string]: {
      title: string;
      content: string;
      linkText?: string;
    };
  };
}

export default function AnnouncementsManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedIcon, setSelectedIcon] = useState<string>('');
  const [formData, setFormData] = useState<Partial<Announcement> & { translations?: { [lang: string]: { title: string; content: string; linkText?: string; } } }>({});
  const [showTranslations, setShowTranslations] = useState(false);

  // Otomatik çeviri fonksiyonu - Türkçe metin değiştiğinde tetiklenir (async)
  const autoTranslateOnChange = async (field: 'title' | 'content' | 'linkText', value: string) => {
    if (!value.trim()) return;
    
    const newFormData: any = { ...formData, [field]: value };
    
    // Otomatik çevirileri yap
    for (const lang of ['en', 'ru', 'ar', 'de']) {
      if (!newFormData.translations) newFormData.translations = {};
      if (!newFormData.translations[lang]) newFormData.translations[lang] = {};
      // Önce offline sözlük dene, bulunamazsa async servise düş
      let translatedText = translateText(value, lang);
      if (translatedText === value) {
        translatedText = await translateTextAsync(value, lang);
      }
      newFormData.translations[lang][field] = translatedText;
    }
    
    setFormData(newFormData);
  };

  // İkon seçenekleri
  const iconOptions = [
    { name: 'info', label: 'Bilgi', icon: Info, color: 'text-blue-500' },
    { name: 'megaphone', label: 'Duyuru', icon: Megaphone, color: 'text-orange-500' },
    { name: 'star', label: 'Yıldız', icon: Star, color: 'text-yellow-500' },
    { name: 'gift', label: 'Hediye', icon: Gift, color: 'text-green-500' },
    { name: 'utensils', label: 'Yemek', icon: Utensils, color: 'text-red-500' },
    { name: 'coffee', label: 'Kahve', icon: Coffee, color: 'text-amber-600' },
    { name: 'wine', label: 'İçecek', icon: Wine, color: 'text-purple-500' },
    { name: 'heart', label: 'Kalp', icon: Heart, color: 'text-pink-500' },
    { name: 'leaf', label: 'Sağlıklı', icon: Leaf, color: 'text-green-600' },
    { name: 'zap', label: 'Hızlı', icon: Zap, color: 'text-yellow-400' },
    { name: 'crown', label: 'Premium', icon: Crown, color: 'text-yellow-600' },
    { name: 'flame', label: 'Sıcak', icon: Flame, color: 'text-red-400' },
    { name: 'sparkles', label: 'Özel', icon: Sparkles, color: 'text-indigo-500' },
    { name: 'target', label: 'Hedef', icon: Target, color: 'text-blue-600' },
    { name: 'trophy', label: 'Başarı', icon: Trophy, color: 'text-yellow-500' },
    { name: 'bell', label: 'Bildirim', icon: Bell, color: 'text-gray-600' },
    { name: 'home', label: 'Otel', icon: Home, color: 'text-gray-700' },
    { name: 'users', label: 'Müşteri', icon: Users, color: 'text-blue-700' },
    { name: 'settings', label: 'Sistem', icon: Settings, color: 'text-gray-500' },
    { name: 'wrench', label: 'Bakım', icon: Wrench, color: 'text-orange-600' },
    { name: 'alert-circle', label: 'Uyarı', icon: AlertCircle, color: 'text-red-500' },
    { name: 'check-circle', label: 'Onay', icon: CheckCircle, color: 'text-green-500' },
  ];

  // İkon render fonksiyonu
  const renderIcon = (iconName?: string) => {
    if (!iconName) return <Megaphone className="w-5 h-5 text-gray-500" />;
    
    const iconOption = iconOptions.find(option => option.name === iconName);
    if (!iconOption) return <Megaphone className="w-5 h-5 text-gray-500" />;
    
    const IconComponent = iconOption.icon;
    return <IconComponent className={`w-5 h-5 ${iconOption.color}`} />;
  };

  // Store integration
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Megaphone className="w-5 h-5 text-blue-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'promotion':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'maintenance':
        return <Clock className="w-5 h-5 text-red-600" />;
      default:
        return <Megaphone className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'promotion':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'info':
        return 'Bilgi';
      case 'warning':
        return 'Uyarı';
      case 'promotion':
        return 'Promosyon';
      case 'maintenance':
        return 'Bakım';
      case 'advertisement':
        return 'Reklam';
      default:
        return 'Diğer';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'general':
        return 'Genel';
      case 'menu':
        return 'Menü';
      case 'hotel':
        return 'Otel';
      case 'promotion':
        return 'Promosyon';
      default:
        return 'Diğer';
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    if (filter === 'active') return announcement.isActive;
    if (filter === 'inactive') return !announcement.isActive;
    return true;
  });

  const handleToggleActive = (id: string) => {
    toggleAnnouncement(id);
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (confirm('Bu duyuruyu silmek istediğinizden emin misiniz?')) {
      deleteAnnouncement(id);
    }
  };

  const editAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setSelectedIcon(announcement.icon || '');
    setShowEditModal(true);
  };

  const addNewAnnouncement = () => {
    setSelectedAnnouncement(null);
    setSelectedIcon('');
    setShowAddModal(true);
  };

  const saveAnnouncement = (announcementData: Partial<Announcement>) => {
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
        ...announcementData
      };
      addAnnouncement(newAnnouncement);
      setShowAddModal(false);
    }
    setSelectedAnnouncement(null);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataObj = new FormData(e.currentTarget);
    
    // Otomatik çevirileri formData state'inden al
    const translations: { [lang: string]: { title: string; content: string; linkText?: string } } = {};
    
    // Türkçe için form'dan al
    translations['tr'] = {
      title: formDataObj.get('title') as string,
      content: formDataObj.get('content') as string,
      ...(formDataObj.get('linkText') && { linkText: formDataObj.get('linkText') as string })
    };
    
    // Diğer diller için formData state'inden al
    ['en', 'ru', 'ar', 'de'].forEach(lang => {
      if (formData.translations?.[lang]) {
        translations[lang] = {
          title: formData.translations[lang].title,
          content: formData.translations[lang].content,
          ...(formData.translations[lang].linkText && { linkText: formData.translations[lang].linkText })
        };
      }
    });
    
    const announcementData = {
      title: formDataObj.get('title') as string,
      content: formDataObj.get('content') as string,
      type: formDataObj.get('type') as any,
      category: formDataObj.get('category') as any,
      startDate: formDataObj.get('startDate') as string,
      endDate: formDataObj.get('endDate') as string || undefined,
      isActive: formDataObj.get('isActive') === 'on',
      linkUrl: formDataObj.get('linkUrl') as string || undefined,
      linkText: formDataObj.get('linkText') as string || undefined,
      icon: selectedIcon || undefined,
      translations: Object.keys(translations).length > 0 ? translations : undefined,
    };
    saveAnnouncement(announcementData);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Duyuru Yönetimi</h1>
            <p className="text-gray-600">Misafirlere gösterilecek duyuruları yönetin</p>
          </div>
          <button
            onClick={addNewAnnouncement}
            className="bg-hotel-gold text-white px-4 py-2 rounded-lg hover:bg-hotel-navy transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Duyuru Ekle</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="hotel-card p-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filtrele:</span>
          <div className="flex space-x-2">
            {(['all', 'active', 'inactive'] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === filterOption
                    ? 'bg-hotel-gold text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterOption === 'all' ? 'Tümü' : filterOption === 'active' ? 'Aktif' : 'Pasif'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <div key={announcement.id} className="hotel-card p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {renderIcon(announcement.icon)}
                  <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(announcement.type)}`}>
                    {getTypeLabel(announcement.type)}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {getCategoryLabel(announcement.category)}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    announcement.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {announcement.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{announcement.content}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Başlangıç: {new Date(announcement.startDate).toLocaleDateString('tr-TR')}</span>
                  </div>
                  {announcement.endDate && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Bitiş: {new Date(announcement.endDate).toLocaleDateString('tr-TR')}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <span>Oluşturan: {announcement.createdBy}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleToggleActive(announcement.id)}
                  className={`p-2 rounded-lg ${
                    announcement.isActive 
                      ? 'text-green-600 hover:bg-green-50' 
                      : 'text-red-600 hover:bg-red-50'
                  }`}
                  title={announcement.isActive ? 'Pasif yap' : 'Aktif yap'}
                >
                  {announcement.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => editAnnouncement(announcement)}
                  className="p-2 text-hotel-gold hover:bg-yellow-50 rounded-lg"
                  title="Düzenle"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteAnnouncement(announcement.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAnnouncements.length === 0 && (
        <div className="text-center py-12">
          <Megaphone className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Duyuru bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500">
            Yeni bir duyuru oluşturmak için "Duyuru Ekle" butonuna tıklayın.
          </p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {showAddModal ? 'Yeni Duyuru Ekle' : 'Duyuru Düzenle'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setSelectedAnnouncement(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Ana Türkçe İçerik */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başlık (Türkçe) *
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={selectedAnnouncement?.title || ''}
                  onChange={(e) => autoTranslateOnChange('title', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                  placeholder="Duyuru başlığı"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İçerik (Türkçe) *
                </label>
                <textarea
                  name="content"
                  defaultValue={selectedAnnouncement?.content || ''}
                  onChange={(e) => autoTranslateOnChange('content', e.target.value)}
                  rows={4}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                  placeholder="Duyuru içeriği"
                />
              </div>

              {/* Çok Dilli Çeviriler */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Çok Dilli Çeviriler (Otomatik)</h3>
                  <button
                    type="button"
                    onClick={() => setShowTranslations(!showTranslations)}
                    className="bg-gray-500 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-600 transition-colors flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{showTranslations ? 'Gizle' : 'Göster'}</span>
                  </button>
                </div>
                
                {showTranslations && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2 text-blue-800">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-medium">Otomatik Çeviri Aktif</span>
                      </div>
                      <p className="text-xs text-blue-600 mt-1">
                        Türkçe metin yazdığınızda sistem otomatik olarak diğer dillere çevirir.
                      </p>
                    </div>
                    
                {['en', 'ru', 'ar', 'de'].map((lang) => {
                  const langNames = {
                    en: 'İngilizce',
                    ru: 'Rusça', 
                    ar: 'Arapça',
                    de: 'Almanca'
                  };
                  
                  return (
                    <div key={lang} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <h4 className="font-medium text-gray-700 mb-3">{langNames[lang as keyof typeof langNames]}</h4>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Başlık</label>
                          <input
                            type="text"
                            name={`${lang}_title`}
                            value={formData.translations?.[lang]?.title || ''}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                            placeholder="Otomatik çevrilecek..."
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">İçerik</label>
                          <textarea
                            name={`${lang}_content`}
                            value={formData.translations?.[lang]?.content || ''}
                            readOnly
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                            placeholder="Otomatik çevrilecek..."
                          />
                        </div>
                        
                        {formData.linkText && (
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Link Metni</label>
                            <input
                              type="text"
                              name={`${lang}_linkText`}
                              value={formData.translations?.[lang]?.linkText || ''}
                              readOnly
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                              placeholder="Otomatik çevrilecek..."
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tip *
                  </label>
                  <select 
                    name="type"
                    defaultValue={selectedAnnouncement?.type || 'info'}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                  >
                    <option value="info">Bilgi</option>
                    <option value="warning">Uyarı</option>
                    <option value="promotion">Promosyon</option>
                    <option value="maintenance">Bakım</option>
                    <option value="advertisement">Reklam</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori *
                  </label>
                  <select 
                    name="category"
                    defaultValue={selectedAnnouncement?.category || 'general'}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                  >
                    <option value="general">Genel</option>
                    <option value="menu">Menü</option>
                    <option value="hotel">Otel</option>
                    <option value="promotion">Promosyon</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Başlangıç Tarihi *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    defaultValue={selectedAnnouncement?.startDate || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                  />
                </div>
              </div>

              {/* İkon Seçici */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İkon Seçin (Opsiyonel)
                </label>
                <div className="grid grid-cols-6 gap-2 p-4 border border-gray-300 rounded-lg bg-gray-50 max-h-48 overflow-y-auto">
                  {iconOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <label
                        key={option.name}
                        className={`flex flex-col items-center p-2 cursor-pointer hover:bg-white rounded-lg transition-colors group ${
                          selectedIcon === option.name ? 'bg-blue-50 border-2 border-blue-200' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="icon"
                          value={option.name}
                          checked={selectedIcon === option.name}
                          onChange={() => setSelectedIcon(option.name)}
                          className="sr-only"
                        />
                        <div className={`p-2 rounded-lg mb-1 group-hover:scale-110 transition-transform ${option.color} ${
                          selectedIcon === option.name ? 'scale-110' : ''
                        }`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className="text-xs text-gray-600 text-center">{option.label}</span>
                      </label>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Duyuruya uygun bir ikon seçin. Bu ikon QR menüde görünecektir.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bitiş Tarihi (Opsiyonel)
                </label>
                <input
                  type="date"
                  name="endDate"
                  defaultValue={selectedAnnouncement?.endDate || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link URL (Opsiyonel)
                  </label>
                  <input
                    type="url"
                    name="linkUrl"
                    defaultValue={selectedAnnouncement?.linkUrl || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                    placeholder="https://example.com veya /sayfa"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link Metni (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    name="linkText"
                    defaultValue={selectedAnnouncement?.linkText || ''}
                    onChange={(e) => autoTranslateOnChange('linkText', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                    placeholder="Örnek: Menüyü İncele"
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={selectedAnnouncement?.isActive ?? true}
                  className="rounded border-gray-300 text-hotel-gold focus:ring-hotel-gold"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Duyuru aktif
                </label>
              </div>
            </form>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setSelectedAnnouncement(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                İptal
              </button>
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  const form = document.querySelector('form');
                  if (form) {
                    const formData = new FormData(form);
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
                    };
                    saveAnnouncement(announcementData);
                  }
                }}
                className="px-4 py-2 bg-hotel-gold text-white rounded-lg hover:bg-hotel-navy"
              >
                {showAddModal ? 'Oluştur' : 'Güncelle'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
