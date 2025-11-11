"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  FaConciergeBell, 
  FaWifi, 
  FaBroom, 
  FaTools, 
  FaStar,
  FaBell,
  FaBed,
  FaTooth,
  FaShoePrints,
  FaSoap,
  FaWater,
  FaSwimmingPool,
  FaWineBottle,
  FaInstagram,
  FaGoogle,
  FaFacebook
} from "react-icons/fa";
import { ApiService } from '@/services/api';
import { useNotifications } from '@/contexts/NotificationContext';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import { useSocialMediaStore } from '@/store/socialMediaStore';
import { useLanguageStore, languages } from '@/store/languageStore';
import { useThemeStore } from '@/store/themeStore';
import { Globe, ChevronDown } from 'lucide-react';

interface GuestInterfaceClientProps {
  roomId: string;
}

export default function GuestInterfaceClient({ roomId }: GuestInterfaceClientProps) {
  const router = useRouter();
  const [showSurvey, setShowSurvey] = useState(false);
  const [guestInfo, setGuestInfo] = useState<{
    name: string;
    surname: string;
  } | null>(null);
  const { addNotification } = useNotifications();

  // Dil store'u
  const { currentLanguage, setLanguage, getTranslation, getCurrentLanguage } = useLanguageStore();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Theme store'u - hook'ları component'in başında çağır
  const theme = useThemeStore();

  // Güvenli çeviri fonksiyonu
  const safeGetTranslation = (key: string, fallback: string = '') => {
    try {
      return getTranslation ? getTranslation(key) : fallback;
    } catch (error) {
      return fallback;
    }
  };

  // Hydration kontrolü
  useEffect(() => {
    setIsHydrated(true);
    // RoomId'yi localStorage'a kaydet (geri dönüş için)
    localStorage.setItem('currentRoomId', roomId);
  }, [roomId]);

  // Dil seçici dropdown'ı dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.language-selector')) {
        setShowLanguageSelector(false);
      }
    };

    if (showLanguageSelector) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLanguageSelector]);





  // Misafir bilgilerini yükle
  useEffect(() => {
    const loadGuestInfo = async () => {
      try {
        const fullRoomId = roomId; // roomId zaten 'room-102' formatında geliyor
        const guestData = await ApiService.getGuestFromCRM(fullRoomId);
        if (guestData) {
          setGuestInfo({
            name: guestData.name,
            surname: guestData.surname
          });
        }
      } catch (error) {
        console.error('Error loading guest info:', error);
      }
    };

    loadGuestInfo();
  }, [roomId]);

  // Hoş geldiniz bildirimi - sadece ilk kez
  useEffect(() => {
    const fullRoomId = roomId; // roomId zaten 'room-102' formatında geliyor
    const welcomeKey = `welcome_shown_${fullRoomId}`;
    
    // Bu oda için hoş geldiniz bildirimi daha önce gösterildi mi?
    const hasShownWelcome = localStorage.getItem(welcomeKey);
    
    if (!hasShownWelcome) {
      const timer = setTimeout(() => {
        const welcomeMessage = guestInfo 
          ? `Hoş Geldiniz ${ApiService.formatGuestName(guestInfo.name, guestInfo.surname)}`
          : 'Hoş Geldiniz';
        
        addNotification('info', welcomeMessage, 'Resepsiyon ekibimiz 7/24 hizmetinizdedir. İsteklerinizi buradan gönderebilirsiniz.', false, true, 5000); // Ses çalma, 5 saniye
        
        // Bu oda için hoş geldiniz bildirimi gösterildi olarak işaretle
        localStorage.setItem(welcomeKey, 'true');
      }, 2000); // 2 saniye
      
      return () => clearTimeout(timer);
    }
  }, [guestInfo, roomId, addNotification]);

  // Sayfa başlığını müşteri adı ile güncelle
  useEffect(() => {
    if (guestInfo) {
      const title = `Hoş Geldiniz ${ApiService.formatGuestName(guestInfo.name, guestInfo.surname)}`;
      document.title = title;
    }
  }, [guestInfo, roomId]);


  if (showSurvey) {
    return <SurveyModal roomId={roomId} onClose={() => setShowSurvey(false)} onSurveySent={(message) => addNotification('success', safeGetTranslation('notifications.survey_title', 'Değerlendirme'), message)} />;
  }

  // Hydration kontrolü - client-side rendering bekleniyor
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex flex-col items-center py-8 relative" style={{ background: theme.backgroundColor }}>
        <div className="w-full max-w-md px-4 mb-4 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold flex-1" style={{ color: theme.textColor }}>
            {guestInfo 
              ? `Hoş Geldiniz ${ApiService.formatGuestName(guestInfo.name, guestInfo.surname)}`
              : `Hoş Geldiniz`
            }
          </h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button className="flex items-center space-x-2 px-3 py-2 rounded-lg shadow-sm" style={{ background: theme.cardBackground, border: `1px solid ${theme.borderColor}` }}>
                <Globe className="w-4 h-4" style={{ color: theme.textColor }} />
                <span className="text-sm font-medium" style={{ color: theme.textColor }}>🇹🇷</span>
                <ChevronDown className="w-4 h-4" style={{ color: theme.textColor }} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="w-full max-w-md mb-4 px-4">
          <div className="rounded-lg p-4" style={{ background: `${theme.secondaryColor}20`, border: `1px solid ${theme.secondaryColor}40` }}>
            <div className="text-center" style={{ color: theme.secondaryColor }}>Yükleniyor...</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-md mb-4 px-4">
          <div className="flex flex-col items-center justify-center rounded-xl p-4 sm:p-6 shadow" style={{ background: `${theme.primaryColor}20` }}>
            <FaConciergeBell className="text-2xl sm:text-3xl mb-2" style={{ color: theme.primaryColor }} />
            <span className="font-medium text-sm sm:text-base" style={{ color: theme.textColor }}>Oda Servisi</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl p-4 sm:p-6 shadow" style={{ background: `${theme.accentColor}20` }}>
            <FaWifi className="text-2xl sm:text-3xl mb-2" style={{ color: theme.accentColor }} />
            <span className="font-medium text-sm sm:text-base" style={{ color: theme.textColor }}>WiFi</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl p-4 sm:p-6 shadow" style={{ background: `${theme.secondaryColor}20` }}>
            <FaBroom className="text-2xl sm:text-3xl mb-2" style={{ color: theme.secondaryColor }} />
            <span className="font-medium text-sm sm:text-base" style={{ color: theme.textColor }}>Temizlik</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl p-4 sm:p-6 shadow" style={{ background: `${theme.primaryColor}20` }}>
            <FaTools className="text-2xl sm:text-3xl mb-2" style={{ color: theme.primaryColor }} />
            <span className="font-medium text-sm sm:text-base" style={{ color: theme.textColor }}>Bakım</span>
          </div>
        </div>
        
        <button className="w-full max-w-md text-white rounded-xl p-3 sm:p-4 shadow-lg mb-4 sm:mb-6 mx-4" style={{ background: theme.gradientColors?.length ? `linear-gradient(135deg, ${theme.gradientColors[0]} 0%, ${theme.gradientColors[1]} 100%)` : theme.primaryColor }}>
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <FaStar className="text-xl sm:text-2xl" />
            <span className="text-base sm:text-lg font-semibold">Anket</span>
          </div>
        </button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center py-8 relative" style={{ background: theme.backgroundColor }}>

      {/* Header */}
      <div className="w-full max-w-md px-4 mb-4 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold flex-1" style={{ color: theme.textColor }}>
            {guestInfo 
              ? `${safeGetTranslation('room.welcome', 'Hoş Geldiniz')} ${ApiService.formatGuestName(guestInfo.name, guestInfo.surname)}`
              : `${safeGetTranslation('room.welcome', 'Hoş Geldiniz')}`
            }
          </h1>
        
        <div className="flex items-center gap-2">
          {/* Dil Seçici */}
          <div className="relative language-selector">
            <button
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg shadow-sm transition-colors"
              style={{ background: theme.cardBackground, border: `1px solid ${theme.borderColor}` }}
            >
              <Globe className="w-4 h-4" style={{ color: theme.textColor }} />
              <span className="text-sm font-medium" style={{ color: theme.textColor }}>
                {getCurrentLanguage().flag}
              </span>
              <ChevronDown className="w-4 h-4" style={{ color: theme.textColor }} />
            </button>
            
            {/* Dil Seçenekleri Dropdown */}
            {showLanguageSelector && (
              <div className="absolute right-0 top-full mt-1 w-48 rounded-lg shadow-lg z-50" style={{ background: theme.cardBackground, border: `1px solid ${theme.borderColor}` }}>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLanguageSelector(false);
                    }}
                    className={`w-full px-4 py-3 text-left transition-colors flex items-center space-x-3 ${
                      currentLanguage === lang.code ? 'opacity-80' : ''
                    }`}
                    style={{ 
                      background: currentLanguage === lang.code ? `${theme.primaryColor}20` : 'transparent',
                      color: theme.textColor
                    }}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <div>
                      <div className="font-medium">{lang.name}</div>
                      <div className="text-xs opacity-70">{lang.nativeName}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Duyuru Banner */}
      <div className="w-full max-w-md mb-4 px-4">
        <AnnouncementBanner roomId={roomId} />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-md mb-4 px-4">
        {/* Oda Servisi */}
              <button
          className="flex flex-col items-center justify-center rounded-xl p-4 sm:p-6 shadow hover:scale-105 transition"
          style={{ background: `${theme.primaryColor}20` }}
          onClick={() => {
            // Oda numarasını localStorage'a kaydet ve query parameter olarak ekle
            const roomNumber = roomId.replace('room-', '');
            localStorage.setItem('currentRoomId', roomId);
            router.push(`/qr-menu?roomId=${roomNumber}`);
          }}
        >
          <FaConciergeBell className="text-2xl sm:text-3xl mb-2" style={{ color: theme.primaryColor }} />
          <span className="font-medium text-sm sm:text-base" style={{ color: theme.textColor }}>{safeGetTranslation('room.room_service', 'Oda Servisi')}</span>
              </button>
        {/* Bilgi & Wifi */}
              <button
          className="flex flex-col items-center justify-center rounded-xl p-4 sm:p-6 shadow hover:scale-105 transition"
          style={{ background: `${theme.accentColor}20` }}
          onClick={() => router.push('/bilgi')}
        >
          <FaWifi className="text-2xl sm:text-3xl mb-2" style={{ color: theme.accentColor }} />
          <span className="font-medium text-sm sm:text-base" style={{ color: theme.textColor }}>{safeGetTranslation('room.wifi', 'Bilgi & Wifi')}</span>
              </button>
        {/* Oda Temizliği */}
                <button
          className="flex flex-col items-center justify-center rounded-xl p-4 sm:p-6 shadow hover:scale-105 transition"
          style={{ background: `${theme.secondaryColor}20` }}
          onClick={async () => {
            try {
              await ApiService.createGuestRequest({
                roomId: `room-${roomId}`,
                type: 'housekeeping',
                priority: 'medium',
                status: 'pending',
                description: safeGetTranslation('notifications.housekeeping_description', 'Oda temizliği talep edildi'),
              });
              addNotification('success', safeGetTranslation('notifications.housekeeping_title', 'Temizlik Talebi'), safeGetTranslation('notifications.housekeeping_message', 'Oda temizliği talebiniz resepsiyona iletildi. En kısa sürede yanıtlanacaktır.'));
            } catch (error) {
              addNotification('success', safeGetTranslation('notifications.housekeeping_title', 'Temizlik Talebi'), safeGetTranslation('notifications.housekeeping_message', 'Oda temizliği talebiniz resepsiyona iletildi. En kısa sürede yanıtlanacaktır.'));
            }
          }}
        >
          <FaBroom className="text-2xl sm:text-3xl mb-2" style={{ color: theme.secondaryColor }} />
          <span className="font-medium text-sm sm:text-base" style={{ color: theme.textColor }}>{safeGetTranslation('room.housekeeping', 'Oda Temizliği')}</span>
                </button>
        {/* Teknik Arıza */}
                    <button
          className="flex flex-col items-center justify-center rounded-xl p-4 sm:p-6 shadow hover:scale-105 transition"
          style={{ background: `${theme.primaryColor}20` }}
          onClick={async () => {
            try {
              await ApiService.createGuestRequest({
                roomId: `room-${roomId}`,
                type: 'maintenance',
                priority: 'urgent',
                status: 'pending',
                description: safeGetTranslation('notifications.maintenance_description', 'Teknik arıza bildirimi'),
              });
              addNotification('warning', safeGetTranslation('notifications.maintenance_title', 'Teknik Arıza'), safeGetTranslation('notifications.maintenance_message', 'Teknik arıza talebiniz resepsiyona iletildi. Acil durumlar için personelimiz yolda.'));
            } catch (error) {
              addNotification('warning', safeGetTranslation('notifications.maintenance_title', 'Teknik Arıza'), safeGetTranslation('notifications.maintenance_message', 'Teknik arıza talebiniz resepsiyona iletildi. Acil durumlar için personelimiz yolda.'));
            }
          }}
        >
          <FaTools className="text-2xl sm:text-3xl mb-2" style={{ color: theme.primaryColor }} />
          <span className="font-medium text-sm sm:text-base" style={{ color: theme.textColor }}>{safeGetTranslation('room.maintenance', 'Teknik Arıza')}</span>
                    </button>
      </div>

      {/* Bizi Puanla Butonu */}
      <button
        onClick={() => setShowSurvey(true)}
        className="w-full max-w-md text-white rounded-xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 mb-4 sm:mb-6 mx-4"
        style={{ background: theme.gradientColors?.length ? `linear-gradient(135deg, ${theme.gradientColors[0]} 0%, ${theme.gradientColors[1]} 100%)` : theme.primaryColor }}
      >
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <FaStar className="text-xl sm:text-2xl" />
          <span className="text-base sm:text-lg font-semibold">{safeGetTranslation('room.survey', 'Bizi Puanla')}</span>
        </div>
      </button>
      
      {/* Diğer İstekler Alanı */}
      <DigerIstekler onRequestSent={(message) => addNotification('info', safeGetTranslation('notifications.general_request_title', 'Genel Talep'), message, true, true, 5000)} roomId={roomId} />

                </div>
  );
}

function DigerIstekler({ onRequestSent, roomId }: { onRequestSent: (message: string) => void; roomId: string }) {
  const { getTranslation } = useLanguageStore();
  const theme = useThemeStore();
  const [istek, setIstek] = useState("");
  const [miktar, setMiktar] = useState(1);
  const [selectedItem, setSelectedItem] = useState("");

  // Güvenli çeviri fonksiyonu
  const safeGetTranslation = (key: string, fallback: string = '') => {
    try {
      return getTranslation ? getTranslation(key) : fallback;
    } catch (error) {
      return fallback;
    }
  };

  // Hızlı seçim öğeleri
  const quickItems = [
    { name: "Havlu", nameKey: "quick.towel", emoji: "🛁", color: "text-blue-600" },
    { name: "Terlik", nameKey: "quick.slippers", emoji: "🥿", color: "text-green-600" },
    { name: "Diş Macunu", nameKey: "quick.toothpaste", emoji: "🦷", color: "text-purple-600" },
    { name: "Yastık", nameKey: "quick.pillow", emoji: "🛏️", color: "text-pink-600" },
    { name: "Battaniye", nameKey: "quick.blanket", emoji: "🛌", color: "text-indigo-600" },
    { name: "Şampuan", nameKey: "quick.shampoo", emoji: "🧴", color: "text-orange-600" },
    { name: "Sabun", nameKey: "quick.soap", emoji: "🧼", color: "text-teal-600" },
    { name: "Su", nameKey: "quick.water", emoji: "💧", color: "text-cyan-600" }
  ];

  const handleQuickSelect = (item: string) => {
    setSelectedItem(item);
    setIstek(`${miktar} adet ${item}`);
  };

  // Miktar değiştiğinde istek alanını güncelle
  useEffect(() => {
    if (selectedItem) {
      setIstek(`${miktar} adet ${selectedItem}`);
    }
  }, [miktar, selectedItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!istek.trim()) return;
    
    console.log('Gönderilen istek:', istek);
    console.log('Miktar:', miktar);
    console.log('Seçili öğe:', selectedItem);
    console.log('RoomId format:', roomId);
    
    try {
      // İstek içeriğine göre priority belirle
      let priority: 'urgent' | 'high' | 'medium' | 'low' = 'medium';
      let type: 'housekeeping' | 'maintenance' | 'concierge' | 'general' | 'food_order' = 'general';
      
      if (istek.toLowerCase().includes('acil') || istek.toLowerCase().includes('urgent') || istek.toLowerCase().includes('arıza')) {
        priority = 'urgent';
        type = 'maintenance';
      } else if (istek.toLowerCase().includes('temizlik') || istek.toLowerCase().includes('temizle')) {
        priority = 'medium';
        type = 'housekeeping';
      }
      
      console.log('İstek priority ve type:', { priority, type, istek });
      
      // API'ye talep gönder
      await ApiService.createGuestRequest({
        roomId: roomId, // roomId zaten 'room-102' formatında
        type: type,
        priority: priority,
        status: 'pending',
        description: istek,
      });
      
      onRequestSent(`"${istek}" talebiniz resepsiyona iletildi. En kısa sürede yanıtlanacaktır.`);
      
    } catch (error) {
      console.error('Error creating request:', error);
      onRequestSent(`"${istek}" talebiniz resepsiyona iletildi. En kısa sürede yanıtlanacaktır.`);
    }
    
    setIstek("");
    setSelectedItem("");
    setMiktar(1);
  };

  return (
    <div className="w-full max-w-md mx-4 mt-2">
      {/* Hızlı Seçim Butonları */}
      <div className="mb-3">
        <p className="text-xs sm:text-sm mb-2 px-1" style={{ color: theme.textColor }}>{safeGetTranslation('room.quick_select', 'Hızlı seçim')}:</p>
        <div className="grid grid-cols-4 gap-2">
          {quickItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleQuickSelect(item.name)}
              className={`p-2 rounded-lg text-xs sm:text-sm transition-all duration-200 ${
                selectedItem === item.name ? 'shadow-md' : ''
              }`}
              style={{
                background: selectedItem === item.name ? theme.primaryColor : theme.borderColor,
                color: selectedItem === item.name ? 'white' : theme.textColor
              }}
            >
              <div className="flex justify-center mb-1">
                <span className="text-sm sm:text-base">{item.emoji}</span>
              </div>
              <div className="font-medium">{safeGetTranslation(item.nameKey, item.name)}</div>
            </button>
          ))}
                    </div>
                  </div>
                  
      {/* Miktar Seçimi */}
      {selectedItem && (
        <div className="mb-3 rounded-lg p-3" style={{ background: `${theme.secondaryColor}20` }}>
                  <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: theme.textColor }}>
              {selectedItem} miktarı:
            </span>
            <div className="flex items-center gap-2">
                    <button
                onClick={() => setMiktar(Math.max(1, miktar - 1))}
                className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-colors"
                style={{ background: theme.borderColor, color: theme.textColor }}
                    >
                -
                    </button>
              <span className="w-8 text-center font-semibold" style={{ color: theme.textColor }}>{miktar}</span>
              <button
                onClick={() => setMiktar(Math.min(10, miktar + 1))}
                className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-colors"
                style={{ background: theme.borderColor, color: theme.textColor }}
              >
                +
                    </button>
                  </div>
                </div>
          <p className="text-xs mt-1" style={{ color: theme.textColor }}>
            Seçili: {miktar} adet {selectedItem}
          </p>
          </div>
        )}

      {/* İstek Formu */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl shadow p-3 sm:p-4 flex items-center gap-2"
        style={{ background: theme.cardBackground }}
      >
        <input
          type="text"
          className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base"
          style={{ 
            background: theme.backgroundColor,
            color: theme.textColor,
            border: `1px solid ${theme.borderColor}`,
            boxShadow: 'none'
          }}
          placeholder={selectedItem ? `${miktar} ${safeGetTranslation('room.quantity', 'adet')} ${selectedItem}` : safeGetTranslation('room.request_details', 'Lütfen isteğinizi yazınız...')}
          value={istek}
          onChange={(e) => {
            const value = e.target.value;
            setIstek(value);
            
            if (value === "") {
              setSelectedItem("");
              setMiktar(1);
            } else {
              // Manuel girişte miktar kontrolü yap
              const miktarMatch = value.match(/^(\d+)\s+adet\s+(.+)$/);
              if (miktarMatch) {
                const [, miktarStr, itemName] = miktarMatch;
                const extractedMiktar = parseInt(miktarStr);
                if (extractedMiktar >= 1 && extractedMiktar <= 10) {
                  setMiktar(extractedMiktar);
                  setSelectedItem(itemName.trim());
                }
              }
            }
          }}
          maxLength={200}
        />
        <button
          type="submit"
          className="flex items-center gap-1 sm:gap-2 font-semibold px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition text-sm sm:text-base"
          style={{ background: theme.primaryColor, color: 'white' }}
        >
          <FaBell className="text-sm sm:text-lg" />
          <span className="hidden sm:inline">{safeGetTranslation('room.send_request', 'Çağrı Oluştur')}</span>
          <span className="sm:hidden">{safeGetTranslation('room.send_request', 'Çağrı')}</span>
        </button>
      </form>
                    </div>
  );
}

function SurveyModal({ roomId, onClose, onSurveySent }: { roomId: string; onClose: () => void; onSurveySent: (message: string) => void }) {
  const [ratings, setRatings] = useState({
    cleanliness: 0,
    service: 0,
    staff: 0,
    overall: 0
  });
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sosyal medya linklerini store'dan al
  const { getLink } = useSocialMediaStore();
  
  // Dil store'u ve güvenli çeviri fonksiyonu
  const { getTranslation } = useLanguageStore();
  const theme = useThemeStore();
  
  const safeGetTranslation = (key: string, fallback: string = '') => {
    try {
      return getTranslation ? getTranslation(key) : fallback;
    } catch (error) {
      return fallback;
    }
  };

  const handleRating = (category: string, rating: number) => {
    setRatings(prev => ({ ...prev, [category]: rating }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
      onSurveySent(safeGetTranslation('notifications.survey_thank_you', 'Yorumunuz için teşekkür ederiz! Geri bildiriminiz bizim için çok değerli.'));
    }, 2000);
  };

  const handleGoogleReview = () => {
    window.open('https://www.google.com/maps/search/?api=1&query=hotel', '_blank');
  };

  if (isSubmitted) {
  return (
      <div className="min-h-screen flex flex-col items-center justify-center py-8" style={{ background: theme.backgroundColor }}>
        <div className="text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${theme.accentColor}20` }}>
            <FaStar className="w-10 h-10" style={{ color: theme.accentColor }} />
                    </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: theme.textColor }}>{safeGetTranslation('survey.thank_you', 'Teşekkürler!')}</h2>
          <p style={{ color: theme.textColor }}>{safeGetTranslation('survey.submitted', 'Değerlendirmeniz başarıyla gönderildi.')}</p>
                    </div>
                  </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-8" style={{ background: theme.backgroundColor }}>
      <div className="w-full max-w-md rounded-2xl shadow-xl p-6" style={{ background: theme.cardBackground }}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold" style={{ color: theme.textColor }}>{safeGetTranslation('survey.title', 'Bizi Değerlendirin')}</h1>
              <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: theme.borderColor }}
          >
            ×
              </button>
                </div>

          <div className="space-y-6">
          {/* Temizlik */}
                <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{safeGetTranslation('survey.cleanliness', 'Temizlik')}</h3>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                  <button
                  key={star}
                  onClick={() => handleRating('cleanliness', star)}
                  className="text-3xl transition-colors"
                  >
                  <FaStar className={star <= ratings.cleanliness ? 'text-yellow-400' : 'text-gray-300'} />
                  </button>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Puan: {ratings.cleanliness > 0 ? ratings.cleanliness : 'Seçilmedi'}
              </div>
              <div className="mt-2">
                <select
                  value={ratings.cleanliness || ''}
                  onChange={(e) => handleRating('cleanliness', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Puan seçin</option>
                  <option value="1.0">1.0 ⭐ (Temel)</option>
                  <option value="1.5">1.5 ⭐ (Temel+)</option>
                  <option value="2.0">2.0 ⭐⭐ (Orta)</option>
                  <option value="2.5">2.5 ⭐⭐ (Orta+)</option>
                  <option value="3.0">3.0 ⭐⭐⭐ (İyi)</option>
                  <option value="3.5">3.5 ⭐⭐⭐ (İyi+)</option>
                  <option value="4.0">4.0 ⭐⭐⭐⭐ (Çok İyi)</option>
                  <option value="4.5">4.5 ⭐⭐⭐⭐ (Çok İyi+)</option>
                  <option value="5.0">5.0 ⭐⭐⭐⭐⭐ (Mükemmel)</option>
                </select>
              </div>
            </div>

          {/* Oda Servisi */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{safeGetTranslation('survey.service', 'Oda Servisi')}</h3>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                  <button
                  key={star}
                  onClick={() => handleRating('service', star)}
                  className="text-3xl transition-colors"
                  >
                  <FaStar className={star <= ratings.service ? 'text-yellow-400' : 'text-gray-300'} />
                  </button>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Puan: {ratings.service > 0 ? ratings.service : 'Seçilmedi'}
              </div>
              <div className="mt-2">
                <select
                  value={ratings.service || ''}
                  onChange={(e) => handleRating('service', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Puan seçin</option>
                  <option value="1.0">1.0 ⭐ (Temel)</option>
                  <option value="1.5">1.5 ⭐ (Temel+)</option>
                  <option value="2.0">2.0 ⭐⭐ (Orta)</option>
                  <option value="2.5">2.5 ⭐⭐ (Orta+)</option>
                  <option value="3.0">3.0 ⭐⭐⭐ (İyi)</option>
                  <option value="3.5">3.5 ⭐⭐⭐ (İyi+)</option>
                  <option value="4.0">4.0 ⭐⭐⭐⭐ (Çok İyi)</option>
                  <option value="4.5">4.5 ⭐⭐⭐⭐ (Çok İyi+)</option>
                  <option value="5.0">5.0 ⭐⭐⭐⭐⭐ (Mükemmel)</option>
                </select>
              </div>
      </div>

          {/* Personel */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{safeGetTranslation('survey.staff', 'Personel')}</h3>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating('staff', star)}
                  className="text-3xl transition-colors"
                >
                  <FaStar className={star <= ratings.staff ? 'text-yellow-400' : 'text-gray-300'} />
                </button>
              ))}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Puan: {ratings.staff > 0 ? ratings.staff : 'Seçilmedi'}
              </div>
              <div className="mt-2">
                <select
                  value={ratings.staff || ''}
                  onChange={(e) => handleRating('staff', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Puan seçin</option>
                  <option value="1.0">1.0 ⭐ (Temel)</option>
                  <option value="1.5">1.5 ⭐ (Temel+)</option>
                  <option value="2.0">2.0 ⭐⭐ (Orta)</option>
                  <option value="2.5">2.5 ⭐⭐ (Orta+)</option>
                  <option value="3.0">3.0 ⭐⭐⭐ (İyi)</option>
                  <option value="3.5">3.5 ⭐⭐⭐ (İyi+)</option>
                  <option value="4.0">4.0 ⭐⭐⭐⭐ (Çok İyi)</option>
                  <option value="4.5">4.5 ⭐⭐⭐⭐ (Çok İyi+)</option>
                  <option value="5.0">5.0 ⭐⭐⭐⭐⭐ (Mükemmel)</option>
                </select>
              </div>
            </div>
            
          {/* Genel Memnuniyet */}
                <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{safeGetTranslation('survey.overall', 'Genel Memnuniyet')}</h3>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                        <button
                  key={star}
                  onClick={() => handleRating('overall', star)}
                  className="text-3xl transition-colors"
                  >
                  <FaStar className={star <= ratings.overall ? 'text-yellow-400' : 'text-gray-300'} />
                        </button>
                  ))}
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      Puan: {ratings.overall > 0 ? ratings.overall : 'Seçilmedi'}
                    </div>
                    <div className="mt-2">
                      <select
                        value={ratings.overall || ''}
                        onChange={(e) => handleRating('overall', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Puan seçin</option>
                        <option value="1.0">1.0 ⭐ (Temel)</option>
                        <option value="1.5">1.5 ⭐ (Temel+)</option>
                        <option value="2.0">2.0 ⭐⭐ (Orta)</option>
                        <option value="2.5">2.5 ⭐⭐ (Orta+)</option>
                        <option value="3.0">3.0 ⭐⭐⭐ (İyi)</option>
                        <option value="3.5">3.5 ⭐⭐⭐ (İyi+)</option>
                        <option value="4.0">4.0 ⭐⭐⭐⭐ (Çok İyi)</option>
                        <option value="4.5">4.5 ⭐⭐⭐⭐ (Çok İyi+)</option>
                        <option value="5.0">5.0 ⭐⭐⭐⭐⭐ (Mükemmel)</option>
                      </select>
                    </div>
                  </div>
                  
          {/* Yorum */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{safeGetTranslation('survey.comment', 'Yorum (İsteğe Bağlı)')}</h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={safeGetTranslation('survey.comment_placeholder', 'Deneyiminizi bizimle paylaşın...')}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />
            </div>
            
          {/* Değerlendirme Seçenekleri */}
          <div className="space-y-3">
            {/* İşletmeye Gönderin */}
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
{safeGetTranslation('survey.submit', 'İşletmeye Gönderin')}
            </button>
            
            {/* Google'da Değerlendirin */}
            <button
              onClick={() => window.open(getLink('googleMaps'), '_blank')}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <FaGoogle className="text-lg" />
{safeGetTranslation('survey.google_review', 'Google\'da Değerlendirin')}
            </button>
            
            {/* Sosyal Medyadan Takip Edin */}
            <button
              onClick={() => window.open(getLink('instagram'), '_blank')}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <FaInstagram className="text-lg" />
{safeGetTranslation('room.follow_us', 'Bizi Takip Edin')}
            </button>
          </div>
            </div>
          </div>
    </div>
  );
} 