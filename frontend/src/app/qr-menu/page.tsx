"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Clock, Star, Image as ImageIcon, Minus, Plus, X, ArrowLeft, Info, AlertTriangle, Megaphone, Wrench } from 'lucide-react';
import NextImage from 'next/image';
import { FaBell, FaTimes } from 'react-icons/fa';
import { ApiService } from '@/services/api';
import { useAnnouncementStore } from '@/store/announcementStore';
import { useLanguageStore } from '@/store/languageStore';
import { useThemeStore } from '@/store/themeStore';


const categories = [
  { id: 'all', nameKey: 'category.all' },
  { id: 'breakfast', nameKey: 'category.breakfast' },
  { id: 'main', nameKey: 'category.main' },
  { id: 'appetizer', nameKey: 'category.appetizer' },
  { id: 'dessert', nameKey: 'category.dessert' },
  { id: 'beverage', nameKey: 'category.beverage' },
];

const subCategories = {
  breakfast: [
    { id: 'classic', nameKey: 'subcategory.classic' },
  ],
  main: [
    { id: 'meat', nameKey: 'subcategory.meat' },
    { id: 'fish', nameKey: 'subcategory.fish' },
  ],
  dessert: [
    { id: 'classic', nameKey: 'subcategory.classic' },
  ],
  beverage: [
    { id: 'hot', nameKey: 'subcategory.hot' },
    { id: 'juice', nameKey: 'subcategory.juice' },
  ],
};

import Image from 'next/image';

// Kategori mapping fonksiyonu
const mapCategoryToQRFormat = (category: string): string => {
  const categoryMap: { [key: string]: string } = {
    'Pizza': 'main',
    'Burger': 'main', 
    'Ana Yemek': 'main',
    'Salata': 'appetizer',
    'Mezeler': 'appetizer',
    'İçecek': 'beverage',
    'Tatlı': 'dessert',
    'Çorba': 'appetizer',
    'Kahvaltı': 'breakfast',
  };
  return categoryMap[category] || 'main';
};

// Varsayılan menü verileri (API çalışmazsa kullanılacak)
const defaultMenuData = [
  {
    id: '1',
    name: 'Cheeseburger',
    description: 'Sulu dana köftesi, cheddar peyniri, taze marul, domates ve özel sos ile',
    price: 210,
    preparationTime: 18,
    rating: 4.8,
    category: 'main',
    subCategory: 'burger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    allergens: ['gluten', 'süt'],
    service: 'Patates kızartması ve turşu ile servis edilir.',
    available: true,
  },
  {
    id: '2',
    name: 'Margherita Pizza',
    description: 'Mozzarella, domates sosu ve taze fesleğen ile',
    price: 185,
    preparationTime: 20,
    rating: 4.7,
    category: 'main',
    subCategory: 'pizza',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
    allergens: ['gluten', 'süt'],
    service: 'Zeytinyağı ve baharat ile servis edilir.',
    available: true,
  },
  {
    id: '3',
    name: 'Caesar Salata',
    description: 'Romaine marul, parmesan, kruton ve Caesar sos',
    price: 120,
    preparationTime: 10,
    rating: 4.6,
    category: 'appetizer',
    subCategory: 'salad',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=800&q=80',
    allergens: ['süt', 'gluten'],
    service: 'Izgara tavuk ile tercih edilebilir.',
    available: true,
  },
  {
    id: '4',
    name: 'Tiramisu',
    description: 'Klasik İtalyan tatlısı, mascarpone ve kahve ile',
    price: 95,
    preparationTime: 8,
    rating: 4.9,
    category: 'dessert',
    subCategory: 'classic',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
    allergens: ['süt', 'gluten', 'yumurta'],
    service: 'Kakao serpilerek servis edilir.',
    available: true,
  },
  {
    id: '5',
    name: 'Cappuccino',
    description: 'Yoğun espresso, süt köpüğü ile',
    price: 55,
    preparationTime: 4,
    rating: 4.7,
    category: 'beverage',
    subCategory: 'hot',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80',
    allergens: ['süt'],
    service: 'Mini kurabiye ile servis edilir.',
    available: true,
  },
];

export default function QRMenuPage() {
  // Tema store
  const theme = useThemeStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<{ id: string; quantity: number }[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [cartNote, setCartNote] = useState('');
  const [orderStatus, setOrderStatus] = useState<'idle' | 'payment' | 'finalized'>('idle');
  
  // Menü verileri için state
  const [menuData, setMenuData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dil store'u
  const { getTranslation, currentLanguage } = useLanguageStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydration kontrolü
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Menü verilerini API'den yükle
  useEffect(() => {
    const loadMenuData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/menu');
        if (response.ok) {
          const data = await response.json();
          // API'den gelen veriyi QR menü formatına çevir
          const formattedMenu = data.menu.map((item: any, index: number) => {
            console.log('API Item:', item); // Debug için
            
            // Varsayılan görselleri kontrol et
            let defaultImage = '';
            const itemName = item.name.toLowerCase();
            if (itemName.includes('burger') || itemName.includes('cheeseburger')) {
              defaultImage = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80';
            } else if (itemName.includes('pizza') || itemName.includes('margherita')) {
              defaultImage = 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80';
            } else if (itemName.includes('salad') || itemName.includes('caesar')) {
              defaultImage = 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=800&q=80';
            } else if (itemName.includes('tiramisu') || itemName.includes('dessert')) {
              defaultImage = 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80';
            } else if (itemName.includes('coffee') || itemName.includes('cappuccino')) {
              defaultImage = 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80';
            }
            
            return {
              id: item.id || `api-${index}`,
              name: item.name,
              description: item.description || '',
              price: item.price,
              preparationTime: item.preparationTime || 15, // API'den gelen veya varsayılan hazırlık süresi
              rating: item.rating || 4, // API'den gelen rating veya varsayılan 4
              category: mapCategoryToQRFormat(item.category),
              subCategory: 'general',
              image: item.image || defaultImage, // API görseli yoksa varsayılan görseli kullan
              allergens: item.allergens || [],
              service: '',
              available: item.available !== false,
            };
          });
          // API'den gelen verileri öncelikli yap, aynı isimdeki default verileri filtrele
          const apiItemNames = new Set(formattedMenu.map(item => item.name.toLowerCase()));
          const filteredDefaultMenu = defaultMenuData.filter(item => 
            !apiItemNames.has(item.name.toLowerCase())
          );
          setMenuData([...formattedMenu, ...filteredDefaultMenu]);
        } else {
          // API hatası durumunda varsayılan menüyü kullan
          setMenuData(defaultMenuData);
        }
      } catch (error) {
        console.error('Menü yükleme hatası:', error);
        // Hata durumunda varsayılan menüyü kullan
        setMenuData(defaultMenuData);
      } finally {
        setLoading(false);
      }
    };

    loadMenuData();
  }, []);
  
  // Duyuru store'u
  const { getAnnouncementsByCategory } = useAnnouncementStore();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);

  
  // Duyuruları yükle (sadece menü kategorisindeki)
  useEffect(() => {
    const loadAnnouncements = () => {
      const menuAnnouncements = getAnnouncementsByCategory('menu');
      setAnnouncements(menuAnnouncements);
    };
    
    loadAnnouncements();
    
    // Her 30 saniyede bir güncelle
    const interval = setInterval(loadAnnouncements, 30000);
    return () => clearInterval(interval);
  }, [getAnnouncementsByCategory]);

  // Dil değiştiğinde duyuruları yeniden yükle (re-render için)
  useEffect(() => {
    const menuAnnouncements = getAnnouncementsByCategory('menu');
    setAnnouncements(menuAnnouncements);
  }, [currentLanguage, getAnnouncementsByCategory]);

  // Otomatik duyuru rotasyonu
  useEffect(() => {
    if (announcements.length > 1) {
      const rotationInterval = setInterval(() => {
        setCurrentAnnouncementIndex((prevIndex) => 
          (prevIndex + 1) % announcements.length
        );
      }, 4000); // 4 saniyede bir değiştir
      
      return () => clearInterval(rotationInterval);
    }
  }, [announcements.length]);
  
  // Sepetteki ürünleri getir
  const getCartItems = useCallback(() => cart.map(ci => {
    const product = menuData.find(m => m.id === ci.id);
    return product ? { ...product, quantity: ci.quantity } : null;
  }).filter(Boolean) as (typeof menuData[0] & { quantity: number })[], [cart, menuData]);
  
  // Finalized modal'ını 3 saniye sonra otomatik kapat
  useEffect(() => {
    if (orderStatus === 'finalized') {
      const timer = setTimeout(() => {
        setOrderStatus('idle');
        setCart([]);
        setCartNote('');
        // Hazırlık süresini hesapla
        const cartItems = getCartItems();
        const maxPreparationTime = Math.max(...cartItems.map(item => item.preparationTime || 15));
        const preparationMessage = cartItems.length === 1 
          ? `Hazırlanma süresi yaklaşık ${maxPreparationTime} dakikadır.`
          : `Hazırlanma süresi yaklaşık ${maxPreparationTime} dakikadır. (En uzun süreye göre)`;
        
        addNotification('success', 'Sipariş Tamamlandı', `Siparişiniz başarıyla mutfağa iletildi. ${preparationMessage}`);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [orderStatus, getCartItems]);
  
  // Bildirim sistemi
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'success' | 'info' | 'warning';
    title: string;
    message: string;
    timestamp: Date;
  }>>([]);

  // Bildirim ekleme fonksiyonu
  const addNotification = (type: 'success' | 'info' | 'warning', title: string, message: string) => {
    const notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: new Date()
    };
    setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Max 5 bildirim
    
    // 8 saniye sonra otomatik kapat
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 8000);
  };

  // Bildirim kapatma
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // WebSocket bağlantısı - resepsiyondan gelen bildirimleri dinle
  useEffect(() => {
    // URL'den oda numarasını al (örnek: /qr-menu?roomId=101)
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('roomId') || '101';
    
    const ws = ApiService.connectWebSocket(roomId, (data) => {
      console.log('QR Menü bildirimi alındı:', data);
      
      if (data.type === 'guest_notification') {
        addNotification('info', 'Resepsiyon Yanıtı', data.message);
      }
    });

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  // Kategori ve alt kategoriye göre filtrele
  let filteredMenu = menuData.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSubCategory = !selectedSubCategory || item.subCategory === selectedSubCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSubCategory && matchesSearch && item.available;
  });

  // Alt kategori gösterimi
  const showSubCategories = selectedCategory !== 'all' && (subCategories as any)[selectedCategory]?.length > 0;

  // Sepete ekle
  const addToCart = (id: string) => {
    setCart(prev => {
      const found = prev.find(item => item.id === id);
      if (found) {
        return prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        return [...prev, { id, quantity: 1 }];
      }
    });
  };
  // Sepetten çıkar
  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };
  // Adet değiştir
  const setCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
    }
  };
  // Sepet toplamı
  const getCartTotal = () => getCartItems().reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Duyuru helper fonksiyonları
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'promotion': return <Megaphone className="w-4 h-4" />;
      case 'maintenance': return <Wrench className="w-4 h-4" />;
      case 'advertisement': return <Star className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'promotion': return 'bg-green-50 border-green-200 text-green-800';
      case 'maintenance': return 'bg-red-50 border-red-200 text-red-800';
      case 'advertisement': return 'bg-purple-50 border-purple-200 text-purple-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const localeMap: Record<string, string> = {
      tr: 'tr-TR',
      en: 'en-US',
      ru: 'ru-RU',
      ar: 'ar-SA',
      de: 'de-DE'
    };
    const locale = localeMap[currentLanguage as keyof typeof localeMap] || 'en-US';
    return new Date(dateString).toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Sipariş onay akışı

  // Siparişi onayla - önce onay modalına git
  const handleOrder = () => {
    setShowConfirmation(true);
    setShowCart(false);
  };
  // Onay modalından ödemeye geç
  const handleProceedToPayment = () => {
    setShowConfirmation(false);
    setOrderStatus('payment');
  };
  // Onay modalından sepete geri dön
  const handleBackToCart = () => {
    setShowConfirmation(false);
    setShowCart(true);
  };

  // Hydration kontrolü - client-side rendering bekleniyor
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] py-8 relative">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <button
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Geri Dön</span>
            </button>
          </div>
          
          <div className="mb-8">
            <div className="mb-4">
              <h1 className="text-3xl font-extrabold text-[#223] tracking-tight text-center">
                Oda Servisi Menüsü
              </h1>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
            <div className="flex space-x-2 overflow-x-auto w-full md:w-auto">
              {['Tümü', 'Kahvaltı', 'Ana Yemekler', 'Mezeler', 'Tatlılar', 'İçecekler'].map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                >
                  {category}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Ürün ara..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-[#222] text-base min-w-[180px]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl shadow-lg p-6 text-center">
              <div className="text-gray-500">Yükleniyor...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 relative" style={{ background: theme.backgroundColor }}>
      {/* Bildirim Sistemi */}
      <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 space-y-2 max-w-xs sm:max-w-sm">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`w-full bg-white rounded-xl shadow-2xl border-l-4 p-4 sm:p-5 transform transition-all duration-500 notification-slide-in notification-gentle-pulse ${
              notification.type === 'success' ? 'border-green-500 bg-green-50' :
              notification.type === 'info' ? 'border-blue-500 bg-blue-50' :
              'border-yellow-500 bg-yellow-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-2">
                <div className="flex items-center gap-2 mb-1">
                  <FaBell className={`w-4 h-4 ${
                    notification.type === 'success' ? 'text-green-600' :
                    notification.type === 'info' ? 'text-blue-600' :
                    'text-yellow-600'
                  }`} />
                  <h4 className="font-bold text-gray-900 text-sm sm:text-base">{notification.title}</h4>
                </div>
                <p className="text-gray-700 text-sm sm:text-base mt-1 leading-relaxed font-medium">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <span>🕐</span>
                  {notification.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-2 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 p-1 hover:bg-gray-200 rounded-full"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Geri Dönüş Butonu */}
        <div className="mb-6">
          <button
            onClick={() => {
              // Oda QR sayfasına geri dön (dil seçimi ve resepsiyona istek sayfası)
              const roomId = localStorage.getItem('currentRoomId') || 'room-102';
              window.location.href = `/guest/${roomId}`;
            }}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Geri Dön</span>
          </button>
        </div>
        
        <div className="mb-8">
          {/* Başlık */}
          <div className="mb-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-center" style={{ color: theme.textColor }}>
              {getTranslation('menu.title')}
            </h1>
          </div>
          
          {/* Duyurular */}
          {announcements.length > 0 ? (
            <div className="max-w-sm mx-auto mb-4">
              {announcements.length > 1 && (
                <div className="flex justify-center space-x-1 mb-2">
                  {announcements.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentAnnouncementIndex(index);
                      }}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        index === currentAnnouncementIndex ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
              
              <div className={`border rounded-lg p-3 shadow-sm ${getTypeColor(announcements[currentAnnouncementIndex]?.type || 'info')} transition-all duration-500`}>
                <div className="flex items-center space-x-2">
                  <div className="flex-shrink-0">
                    {getTypeIcon(announcements[currentAnnouncementIndex]?.type || 'info')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm truncate">
                        {(() => {
                          const announcement = announcements[currentAnnouncementIndex];
                          if (!announcement) return '';
                          
                          // Çeviri varsa kullan, yoksa Türkçe fallback
                          return announcement.translations?.[currentLanguage]?.title || announcement.title;
                        })()}
                      </h3>
                      <span className="text-xs opacity-75 flex items-center ml-2 flex-shrink-0">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(announcements[currentAnnouncementIndex]?.startDate || '')}
                      </span>
                    </div>
                    <p className="text-xs opacity-90 leading-tight mb-2 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                      {(() => {
                        const announcement = announcements[currentAnnouncementIndex];
                        if (!announcement) return '';
                        
                        // Çeviri varsa kullan, yoksa Türkçe fallback
                        return announcement.translations?.[currentLanguage]?.content || announcement.content;
                      })()}
                    </p>
                    {announcements[currentAnnouncementIndex]?.linkUrl && announcements[currentAnnouncementIndex]?.linkText && (
                      <div className="flex justify-end">
                        <a
                          href={announcements[currentAnnouncementIndex]?.linkUrl}
                          target={announcements[currentAnnouncementIndex]?.linkUrl?.startsWith('http') ? '_blank' : '_self'}
                          rel={announcements[currentAnnouncementIndex]?.linkUrl?.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="inline-flex items-center space-x-1 text-xs font-medium text-current hover:opacity-80 transition-opacity bg-white/20 px-2 py-1 rounded-full"
                        >
                          <span>
                            {(() => {
                              const announcement = announcements[currentAnnouncementIndex];
                              if (!announcement) return '';
                              
                              // Link metni çevirisi varsa kullan, yoksa Türkçe fallback
                              return announcement.translations?.[currentLanguage]?.linkText || announcement.linkText;
                            })()}
                          </span>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        {/* Kategori ve Arama */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
          <div className="flex space-x-2 overflow-x-auto w-full md:w-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setSelectedSubCategory('');
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ${
                  selectedCategory === category.id
                    ? 'text-white shadow-lg'
                    : ''
                }`}
                style={selectedCategory === category.id
                  ? { background: theme.gradientColors?.length ? `linear-gradient(135deg, ${theme.gradientColors[0]} 0%, ${theme.gradientColors[1]} 100%)` : theme.primaryColor }
                  : { background: theme.cardBackground, color: theme.textColor, border: `1px solid ${theme.borderColor}` }}
              >
                {getTranslation(category.nameKey)}
              </button>
            ))}
          </div>
                <input
                  type="text"
                  placeholder={getTranslation('menu.search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg focus:outline-none text-base min-w-[180px]"
            style={{
              background: theme.cardBackground,
              color: theme.textColor,
              border: `1px solid ${theme.borderColor}`,
              boxShadow: 'none'
            }}
                />
              </div>
        {/* Alt Kategoriler - Daha belirgin tasarım */}
        {showSubCategories && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{getTranslation('menu.subcategories')}</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedSubCategory('')}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md ${
                  selectedSubCategory === ''
                    ? 'bg-gray-800 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg border border-gray-200'
                }`}
              >
                {getTranslation('category.all')}
              </button>
              {(subCategories as any)[selectedCategory].map((sub: any) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubCategory(sub.id)}
                  className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md ${
                    selectedSubCategory === sub.id
                      ? 'bg-gray-800 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg border border-gray-200'
                  }`}
                >
                  {getTranslation(sub.nameKey)}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Menü Grid - Mobilde 1, tablette 2, masaüstünde 3 sütun */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl shadow-lg p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenu.map((item) => (
              <MenuCard
                key={item.id}
                {...item}
                onAdd={() => addToCart(item.id)}
                getTranslation={getTranslation}
              />
            ))}
          </div>
        )}
        {filteredMenu.length === 0 && (
          <div className="p-12 text-center mt-8 rounded-xl" style={{ background: theme.cardBackground, border: `1px solid ${theme.borderColor}` }}>
            <h3 className="text-lg font-medium mb-2" style={{ color: theme.textColor }}>{getTranslation('general.no_products')}</h3>
            <p style={{ color: theme.textColor }}>
              {searchTerm ? getTranslation('general.no_search_results') : getTranslation('general.no_category_products')}
            </p>
          </div>
        )}
        {/* Sepet Butonu */}
        {cart.length > 0 && orderStatus === 'idle' && (
          <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50">
            <button
              onClick={() => setShowCart(true)}
              className="text-white px-8 py-4 rounded-full shadow-xl text-lg font-bold flex items-center space-x-3 transition-all duration-200 hover:shadow-2xl hover:scale-105"
              style={{ background: theme.gradientColors?.length ? `linear-gradient(135deg, ${theme.gradientColors[0]} 0%, ${theme.gradientColors[1]} 100%)` : theme.primaryColor }}
            >
              <span>🛒 Sepet ({getCartItems().length})</span>
              <span className="text-base font-normal">{getCartTotal()}₺</span>
            </button>
          </div>
        )}
        {/* Sepet Modal */}
        {showCart && (
          <CartModal
            items={getCartItems()}
            note={cartNote}
            setNote={setCartNote}
            onClose={() => setShowCart(false)}
            onOrder={handleOrder}
            setCartQuantity={setCartQuantity}
            removeFromCart={removeFromCart}
            total={getCartTotal()}
            getTranslation={getTranslation}
          />
        )}
        {/* Onay Modalı */}
        {showConfirmation && (
          <ConfirmationModal
            items={getCartItems()}
            note={cartNote}
            total={getCartTotal()}
            onProceed={handleProceedToPayment}
            onBack={handleBackToCart}
            getTranslation={getTranslation}
          />
        )}
        {/* Ödeme Modalı */}
        {orderStatus === 'payment' && (
          <PaymentModal
            items={getCartItems()}
            note={cartNote}
            total={getCartTotal()}
            onPaymentSuccess={() => setOrderStatus('finalized')}
            onBack={() => setOrderStatus('idle')}
            getTranslation={getTranslation}
          />
        )}
        
        {/* Sipariş Finalize */}
        {orderStatus === 'finalized' && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
              <h2 className="text-2xl font-bold mb-4 text-blue-700">Siparişiniz mutfağa iletildi!</h2>
              <p className="text-gray-700 mb-4">Siparişiniz hazırlanıyor. Afiyet olsun!</p>
              <p className="text-sm text-gray-500">Bu pencere 3 saniye sonra otomatik olarak kapanacak...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MenuCard({ name, description, price, preparationTime, rating, image, allergens, service, onAdd, getTranslation }: {
  name: string;
  description: string;
  price: number;
  preparationTime: number;
  rating?: number;
  image?: string;
  allergens?: string[];
  service?: string;
  onAdd: () => void;
  getTranslation: (key: string) => string;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const isLongDescription = description.length > 80;
  const isLongAllergens = allergens && allergens.length > 2;
  const theme = useThemeStore();
  return (
    <div className="rounded-3xl shadow-lg flex flex-col overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300" style={{ background: theme.cardBackground, border: `1px solid ${theme.borderColor}` }}>
      {/* Görsel - Responsive ve optimize edilmiş */}
      <div className="relative w-full h-48 sm:h-56 md:h-52 lg:h-56">
        {image ? (
          <NextImage 
            src={image} 
            alt={name} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center" 
          />
        ) : (
          <div className="w-full h-48 sm:h-56 md:h-52 lg:h-56 bg-gradient-to-br from-orange-100 to-red-100 flex flex-col items-center justify-center">
            <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 text-orange-400 mb-2 sm:mb-3" />
            <span className="text-3xl sm:text-4xl font-bold text-orange-500">{name.charAt(0)}</span>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-xl leading-tight flex-1" style={{ color: theme.textColor }}>{name}</h3>
          <div className="text-2xl font-extrabold ml-3" style={{ color: theme.primaryColor }}>{price}₺</div>
        </div>
        
        <div className="mb-3">
          <p className="text-sm leading-relaxed" style={{ color: theme.textColor }}>
            {showDetails ? description : (isLongDescription ? description.substring(0, 80) + '...' : description)}
          </p>
          {isLongDescription && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-blue-600 hover:text-blue-800 mt-1 font-medium transition-colors"
            >
              {showDetails ? getTranslation('product.show_less') : getTranslation('product.show_details')}
            </button>
          )}
        </div>
        
        {service && (
          <p className="text-xs mb-4 italic px-3 py-2 rounded-lg" style={{ color: theme.secondaryColor, background: `${theme.secondaryColor}20` }}>
            {service}
          </p>
        )}
        
        <div className="flex items-center space-x-4 text-sm mb-4" style={{ color: theme.textColor }}>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{preparationTime} dakika</span>
          </div>
          {rating && (
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4" style={{ color: theme.accentColor }} />
              <span>{rating}</span>
              <span className="text-xs text-gray-400">(İşletme)</span>
            </div>
          )}
        </div>
        
        {allergens && allergens.length > 0 && (
          <div className="text-xs mb-4 px-3 py-2 rounded-lg" style={{ color: '#b91c1c', background: '#fee2e2' }}>
            {getTranslation('product.allergens')}: {showDetails ? allergens.join(', ') : (isLongAllergens ? allergens.slice(0, 2).join(', ') + '...' : allergens.join(', '))}
            {isLongAllergens && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs ml-2 font-medium transition-colors"
                style={{ color: theme.secondaryColor }}
              >
                {showDetails ? getTranslation('product.show_less') : getTranslation('product.show_details')}
              </button>
            )}
          </div>
        )}
        
        <button
          onClick={onAdd}
          className="mt-auto px-6 py-3 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          style={{ background: theme.gradientColors?.length ? `linear-gradient(135deg, ${theme.gradientColors[2]} 0%, ${theme.gradientColors[3]} 100%)` : theme.secondaryColor }}
        >
          {getTranslation('product.add_to_cart')}
        </button>
      </div>
    </div>
  );
}

function CartModal({ items, note, setNote, onClose, onOrder, setCartQuantity, removeFromCart, total, getTranslation }: {
  items: any[];
  note: string;
  setNote: (v: string) => void;
  onClose: () => void;
  onOrder: () => void;
  setCartQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  total: number;
  getTranslation: (key: string) => string;
}) {
  const theme = useThemeStore();
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="rounded-3xl max-w-lg w-full shadow-2xl max-h-[95vh] overflow-hidden mx-2 sm:mx-0" style={{ background: theme.cardBackground }}>
        <div className="flex justify-between items-center p-6" style={{ borderBottom: `1px solid ${theme.borderColor}` }}>
          <h2 className="text-2xl font-bold" style={{ color: theme.textColor }}>{getTranslation('cart.title')}</h2>
                <button
            onClick={onClose} 
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            style={{ background: theme.borderColor }}
                >
            <X className="w-5 h-5" style={{ color: theme.textColor }} />
                </button>
        </div>
        
        <div className="overflow-y-auto max-h-[60vh]">
          {items.length === 0 ? (
            <div className="text-center py-12" style={{ color: theme.textColor }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: theme.borderColor }}>
                <span className="text-2xl">🛒</span>
              </div>
              <p className="text-lg font-medium">{getTranslation('cart.empty')}</p>
              <p className="text-sm">{getTranslation('cart.add_products')}</p>
                </div>
              ) : (
                <>
              <div className="p-4 space-y-3">
                {items.map(item => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 rounded-xl" style={{ background: theme.borderColor }}>
                    {/* Ürün Görseli - Daha küçük */}
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <NextImage src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                          <span className="text-sm font-bold text-orange-500">{item.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate" style={{ color: theme.textColor }}>{item.name}</div>
                      <div className="text-xs" style={{ color: theme.textColor }}>{item.price}₺</div>
                      </div>
                    
                      <div className="flex items-center space-x-2">
                        <button
                        onClick={() => setCartQuantity(item.id, item.quantity - 1)} 
                        className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                        style={{ background: `${theme.primaryColor}20`, color: theme.primaryColor }}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-semibold text-sm" style={{ color: theme.textColor }}>{item.quantity}</span>
                      <button 
                        onClick={() => setCartQuantity(item.id, item.quantity + 1)} 
                        className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                        style={{ background: `${theme.primaryColor}20`, color: theme.primaryColor }}
                      >
                        <Plus className="w-3 h-3" />
                        </button>
                        <button
                        onClick={() => removeFromCart(item.id)} 
                        className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                        style={{ background: '#fee2e2', color: '#b91c1c' }}
                        >
                        <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
              
              <div className="p-4 sm:p-6" style={{ borderTop: `1px solid ${theme.borderColor}` }}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2" style={{ color: theme.textColor }}>Ekstra İstekleriniz</label>
                  <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="Örn: Soğansız olsun, yanında limon, az tuzlu..."
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent resize-none text-sm"
                    style={{
                      background: theme.backgroundColor,
                      color: theme.textColor,
                      border: `1px solid ${theme.borderColor}`,
                      boxShadow: 'none'
                    }}
                    rows={2}
                  />
                    </div>
                
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <span className="text-base sm:text-lg font-semibold" style={{ color: theme.textColor }}>Toplam</span>
                  <span className="text-xl sm:text-2xl font-bold" style={{ color: theme.primaryColor }}>{total}₺</span>
                  </div>
                  
                  <button
                  onClick={onOrder}
                  className="w-full py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  style={{ background: theme.gradientColors?.length ? `linear-gradient(135deg, ${theme.gradientColors[2]} 0%, ${theme.gradientColors[3]} 100%)` : theme.secondaryColor, color: 'white' }}
                  >
                  Siparişi Onayla
                  </button>
              </div>
                </>
              )}
            </div>
          </div>
        </div>
  );
}

function ConfirmationModal({ items, note, total, onProceed, onBack, getTranslation }: {
  items: any[];
  note: string;
  total: number;
  onProceed: () => void;
  onBack: () => void;
  getTranslation: (key: string) => string;
}) {
  const theme = useThemeStore();
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onBack();
        }
      }}
    >
      <div className="rounded-3xl max-w-lg w-full shadow-2xl max-h-[95vh] overflow-hidden mx-2 sm:mx-0" style={{ background: theme.cardBackground }}>
        <div className="flex justify-between items-center p-6" style={{ borderBottom: `1px solid ${theme.borderColor}` }}>
          <h2 className="text-2xl font-bold" style={{ color: theme.textColor }}>Siparişinizi Onaylayın</h2>
          <button
            onClick={onBack} 
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            style={{ background: theme.borderColor }}
          >
            <X className="w-5 h-5" style={{ color: theme.textColor }} />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
          <div className="p-6">
          {/* Uyarı Mesajı */}
          <div className="rounded-xl p-4 mb-6" style={{ background: `${theme.accentColor}20`, border: `1px solid ${theme.accentColor}40` }}>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: theme.accentColor }}>
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: theme.textColor }}>Önemli Uyarı</h3>
                <p className="text-sm" style={{ color: theme.textColor }}>
                  Siparişinizden emin misiniz? Ödeme yaptıktan sonra değişiklik yapamazsınız.
                </p>
              </div>
            </div>
          </div>

          {/* Sipariş Özeti */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3" style={{ color: theme.textColor }}>Sipariş Özeti</h3>
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                      {item.image ? (
                        <NextImage src={item.image} alt={item.name} fill sizes="40px" className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: `${theme.primaryColor}20` }}>
                          <span className="text-xs font-bold" style={{ color: theme.primaryColor }}>{item.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium" style={{ color: theme.textColor }}>{item.name}</div>
                      <div className="text-sm" style={{ color: theme.textColor }}>x {item.quantity}</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold" style={{ color: theme.textColor }}>{item.price * item.quantity}₺</div>
                </div>
              ))}
            </div>
            {note && (
              <div className="mt-3 p-3 rounded-lg" style={{ background: theme.borderColor }}>
                <div className="text-sm font-medium mb-1" style={{ color: theme.textColor }}>Özel İstek:</div>
                <div className="text-sm" style={{ color: theme.textColor }}>{note}</div>
              </div>
            )}
          </div>
          
          {/* Toplam */}
          <div className="pt-4 mb-6" style={{ borderTop: `1px solid ${theme.borderColor}` }}>
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold" style={{ color: theme.textColor }}>Toplam</span>
              <span className="text-2xl font-bold" style={{ color: theme.primaryColor }}>{total}₺</span>
            </div>
          </div>
          
          {/* Butonlar */}
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="flex-1 py-3 rounded-xl font-semibold transition-colors"
              style={{ background: theme.borderColor, color: theme.textColor }}
            >
              Değiştir
            </button>
            <button
              onClick={onProceed}
              className="flex-1 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              style={{ background: theme.gradientColors?.length ? `linear-gradient(135deg, ${theme.gradientColors[2]} 0%, ${theme.gradientColors[3]} 100%)` : theme.secondaryColor, color: 'white' }}
            >
              Ödemeye Geç
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentModal({ items, note, total, onPaymentSuccess, onBack, getTranslation }: {
  items: any[];
  note: string;
  total: number;
  onPaymentSuccess: () => void;
  onBack: () => void;
  getTranslation: (key: string) => string;
}) {
  const [selectedPayment, setSelectedPayment] = useState<'card' | 'cash' | 'room'>('card');
  const theme = useThemeStore();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="rounded-3xl max-w-lg w-full shadow-2xl max-h-[95vh] overflow-hidden" style={{ background: theme.cardBackground }}>
        <div className="flex justify-between items-center p-4 sm:p-6" style={{ borderBottom: `1px solid ${theme.borderColor}` }}>
          <h2 className="text-xl sm:text-2xl font-bold" style={{ color: theme.textColor }}>Ödeme</h2>
          <button 
            onClick={onBack} 
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors"
            style={{ background: theme.borderColor }}
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: theme.textColor }} />
          </button>
              </div>
              
        <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Sipariş Özeti */}
              <div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: theme.textColor }}>Sipariş Özeti</h3>
                <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                      {item.image ? (
                        <NextImage src={item.image} alt={item.name} fill sizes="40px" className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: `${theme.primaryColor}20` }}>
                          <span className="text-xs font-bold" style={{ color: theme.primaryColor }}>{item.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium" style={{ color: theme.textColor }}>{item.name}</div>
                      <div className="text-sm" style={{ color: theme.textColor }}>x {item.quantity}</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold" style={{ color: theme.textColor }}>{item.price * item.quantity}₺</div>
                </div>
              ))}
            </div>
            {note && (
              <div className="mt-3 p-3 rounded-lg" style={{ background: theme.borderColor }}>
                <div className="text-sm font-medium mb-1" style={{ color: theme.textColor }}>Özel İstek:</div>
                <div className="text-sm" style={{ color: theme.textColor }}>{note}</div>
              </div>
            )}
              </div>
              
          {/* Toplam */}
          <div className="pt-4" style={{ borderTop: `1px solid ${theme.borderColor}` }}>
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold" style={{ color: theme.textColor }}>Toplam</span>
              <span className="text-2xl font-bold" style={{ color: theme.primaryColor }}>{total}₺</span>
                </div>
              </div>
              
          {/* Ödeme Yöntemleri */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: theme.textColor }}>Ödeme Yöntemi</h3>
              <div className="space-y-3">
              <button
                onClick={() => setSelectedPayment('card')}
                className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all ${
                  selectedPayment === 'card'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={selectedPayment === 'card' 
                  ? { borderColor: theme.secondaryColor, background: `${theme.secondaryColor}20` }
                  : { borderColor: theme.borderColor }
                }
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: theme.secondaryColor }}>
                    <span className="text-white text-sm font-bold">💳</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold" style={{ color: theme.textColor }}>Kredi/Banka Kartı</div>
                    <div className="text-sm" style={{ color: theme.textColor }}>Online ödeme</div>
                  </div>
                </div>
              </button>
            
              <button
                onClick={() => setSelectedPayment('cash')}
                className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all ${
                  selectedPayment === 'cash'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={selectedPayment === 'cash' 
                  ? { borderColor: theme.accentColor, background: `${theme.accentColor}20` }
                  : { borderColor: theme.borderColor }
                }
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: theme.accentColor }}>
                    <span className="text-white text-sm font-bold">💰</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold" style={{ color: theme.textColor }}>Nakit Ödeme</div>
                    <div className="text-sm" style={{ color: theme.textColor }}>Teslimatta öde</div>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setSelectedPayment('room')}
                className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all ${
                  selectedPayment === 'room'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={selectedPayment === 'room' 
                  ? { borderColor: theme.primaryColor, background: `${theme.primaryColor}20` }
                  : { borderColor: theme.borderColor }
                }
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: theme.primaryColor }}>
                    <span className="text-white text-sm font-bold">🏨</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold" style={{ color: theme.textColor }}>Oda Hesabına</div>
                    <div className="text-sm" style={{ color: theme.textColor }}>Çıkışta öde</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
          
          {/* Ödeme Butonu */}
          <button
            onClick={onPaymentSuccess}
            className="w-full py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            style={{ background: theme.gradientColors?.length ? `linear-gradient(135deg, ${theme.gradientColors[0]} 0%, ${theme.gradientColors[1]} 100%)` : theme.primaryColor, color: 'white' }}
          >
            {selectedPayment === 'card' && '💳 Kart ile Öde'}
            {selectedPayment === 'cash' && '💰 Nakit ile Öde'}
            {selectedPayment === 'room' && '🏨 Oda Hesabına Ekle'}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}

