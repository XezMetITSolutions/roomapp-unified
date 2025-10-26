'use client';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaWifi, 
  FaClock, 
  FaSwimmingPool, 
  FaChild, 
  FaUtensils, 
  FaParking, 
  FaConciergeBell,
  FaArrowLeft,
  FaPhone,
  FaMapMarkerAlt,
  FaCar,
  FaBaby,
  FaSpa,
  FaDumbbell,
  FaShieldAlt,
  FaCoffee,
  FaWineGlassAlt,
  FaBed,
  FaShower,
  FaTv,
  FaWind,
  FaSnowflake
} from 'react-icons/fa';
import { useLanguageStore } from '@/store/languageStore';
import { SimpleTranslator } from '@/components/RealtimeTranslator';

export default function BilgiPage() {
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const { currentLanguage, getTranslation } = useLanguageStore();

  // Hydration kontrolü
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleGoBack = () => {
    // Oda QR sayfasına geri dön (dil seçimi ve resepsiyona istek sayfası)
    const roomId = localStorage.getItem('currentRoomId') || 'room-102';
    router.push(`/guest/${roomId}`);
  };

  // sections array'ini currentLanguage değiştiğinde yeniden oluştur
  const sections = useMemo(() => {
    if (!isHydrated) return []; // Hydration tamamlanana kadar boş array döndür
    return [
    {
      id: 'wifi',
      icon: FaWifi,
      title: 'WiFi & İnternet',
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
      content: (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-2">
              <SimpleTranslator
                text="WiFi Bilgileri"
                targetLang={currentLanguage as any}
              />
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <SimpleTranslator
                  text="Ağ Adı:"
                  targetLang={currentLanguage as any}
                  className="text-gray-600"
                />
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">HotelLuxury_Guest</span>
              </div>
              <div className="flex justify-between">
                <SimpleTranslator
                  text="Şifre:"
                  targetLang={currentLanguage as any}
                  className="text-gray-600"
                />
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">Luxury2024!</span>
              </div>
              <div className="flex justify-between">
                <SimpleTranslator
                  text="Hız:"
                  targetLang={currentLanguage as any}
                  className="text-gray-600"
                />
                <span className="text-green-600 font-medium">100 Mbps</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <SimpleTranslator
              text="İnternet Kullanımı"
              targetLang={currentLanguage as any}
              className="font-semibold text-gray-900 mb-2"
            />
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <SimpleTranslator text="Sınırsız internet erişimi" targetLang={currentLanguage as any} /></li>
              <li>• <SimpleTranslator text="Tüm odalar WiFi kapsamında" targetLang={currentLanguage as any} /></li>
              <li>• <SimpleTranslator text="Lobi ve ortak alanlarda ücretsiz WiFi" targetLang={currentLanguage as any} /></li>
              <li>• <SimpleTranslator text="Teknik destek:" targetLang={currentLanguage as any} /> +90 212 555 0199</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'hours',
      icon: FaClock,
      title: 'Çalışma Saatleri',
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600',
      content: (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <SimpleTranslator
              text="Otel Hizmetleri"
              targetLang={currentLanguage as any}
              className="font-semibold text-gray-900 mb-3"
            />
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <SimpleTranslator
                  text="Resepsiyon"
                  targetLang={currentLanguage as any}
                  className="text-gray-600"
                />
                <span className="font-medium">24 Saat</span>
              </div>
              <div className="flex justify-between items-center">
                <SimpleTranslator
                  text="Restoran"
                  targetLang={currentLanguage as any}
                  className="text-gray-600"
                />
                <span className="font-medium">06:00 - 23:00</span>
              </div>
              <div className="flex justify-between items-center">
                <SimpleTranslator
                  text="Bar"
                  targetLang={currentLanguage as any}
                  className="text-gray-600"
                />
                <span className="font-medium">18:00 - 02:00</span>
              </div>
              <div className="flex justify-between items-center">
                <SimpleTranslator
                  text="Spa & Wellness"
                  targetLang={currentLanguage as any}
                  className="text-gray-600"
                />
                <span className="font-medium">08:00 - 22:00</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'amenities',
      icon: FaSwimmingPool,
      title: 'Otel Olanakları',
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600',
      content: (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <SimpleTranslator
              text="Temel Olanaklar"
              targetLang={currentLanguage as any}
              className="font-semibold text-gray-900 mb-3"
            />
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <SimpleTranslator text="Ücretsiz WiFi" targetLang={currentLanguage as any} /></li>
              <li>• <SimpleTranslator text="Otopark" targetLang={currentLanguage as any} /></li>
              <li>• <SimpleTranslator text="Fitness Center" targetLang={currentLanguage as any} /></li>
              <li>• <SimpleTranslator text="Yüzme Havuzu" targetLang={currentLanguage as any} /></li>
              <li>• <SimpleTranslator text="Spa & Wellness" targetLang={currentLanguage as any} /></li>
              <li>• <SimpleTranslator text="Çocuk Oyun Alanı" targetLang={currentLanguage as any} /></li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'dining',
      icon: FaUtensils,
      title: 'Yemek & İçecek',
      color: 'bg-orange-50 border-orange-200',
      iconColor: 'text-orange-600',
      content: (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <SimpleTranslator
              text="Restoran Hizmetleri"
              targetLang={currentLanguage as any}
              className="font-semibold text-gray-900 mb-3"
            />
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <SimpleTranslator text="Kahvaltı Buffet" targetLang={currentLanguage as any} /> (06:00-10:00)</li>
              <li>• <SimpleTranslator text="Öğle Yemeği" targetLang={currentLanguage as any} /> (12:00-15:00)</li>
              <li>• <SimpleTranslator text="Akşam Yemeği" targetLang={currentLanguage as any} /> (18:00-22:00)</li>
              <li>• <SimpleTranslator text="Room Service" targetLang={currentLanguage as any} /> (24 saat)</li>
              <li>• <SimpleTranslator text="Havlu değişimi" targetLang={currentLanguage as any} /> (günlük)</li>
              <li>• <SimpleTranslator text="Teknik destek" targetLang={currentLanguage as any} /> (24 saat)</li>
            </ul>
          </div>
        </div>
      )
    }
    ];
  }, [currentLanguage, isHydrated]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {!isHydrated ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleGoBack}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer active:scale-95 hover:bg-gray-100 px-2 py-1 rounded-lg"
                >
                  <FaArrowLeft className="mr-1 sm:mr-2 text-sm sm:text-base" />
                  <span className="hidden sm:inline text-sm sm:text-base">
                    <SimpleTranslator
                      text="Geri Dön"
                      targetLang={currentLanguage as any}
                    />
                  </span>
                </button>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
                  <SimpleTranslator
                    text="Otel Bilgileri"
                    targetLang={currentLanguage as any}
                  />
                </h1>
                <div className="w-16 sm:w-20"></div> {/* Spacer for centering */}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
            <div className="space-y-3 sm:space-y-4">
              {sections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <div
                    key={section.id}
                    className={`border-2 rounded-2xl transition-all duration-200 ${section.color} ${
                      expandedSection === section.id ? 'shadow-lg' : 'shadow-sm hover:shadow-md'
                    }`}
                  >
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full p-3 sm:p-6 text-left flex items-center justify-between hover:bg-opacity-50 transition-all duration-200"
                    >
                      <div className="flex items-center">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${section.color.replace('50', '100')} flex items-center justify-center mr-3 sm:mr-4`}>
                          <IconComponent className={`text-lg sm:text-xl ${section.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base sm:text-xl font-semibold text-gray-900">
                            <SimpleTranslator
                              text={section.title}
                              targetLang={currentLanguage as any}
                            />
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            <SimpleTranslator
                              text={expandedSection === section.id ? 'Bilgileri gizle' : 'Detayları görüntüle'}
                              targetLang={currentLanguage as any}
                            />
                          </p>
                        </div>
                      </div>
                      <div className={`transform transition-transform duration-200 ml-2 ${
                        expandedSection === section.id ? 'rotate-180' : ''
                      }`}>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    
                    {expandedSection === section.id && (
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                        {section.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Hızlı İletişim */}
            <div className="mt-8 bg-white rounded-2xl shadow-sm p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 text-center">
                <SimpleTranslator
                  text="Hızlı İletişim"
                  targetLang={currentLanguage as any}
                />
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 text-center">
                <SimpleTranslator
                  text="Acil durumlar için direkt arayabilirsiniz"
                  targetLang={currentLanguage as any}
                />
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {/* Resepsiyon */}
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center mb-2">
                    <FaPhone className="text-red-600 mr-2 text-sm sm:text-base" />
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">
                      <SimpleTranslator
                        text="Resepsiyon"
                        targetLang={currentLanguage as any}
                      />
                    </span>
                  </div>
                  <button
                    onClick={() => window.open('tel:+902125550100')}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-colors"
                  >
                    +90 212 555 0100
                  </button>
                </div>

                {/* Güvenlik */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center mb-2">
                    <FaShieldAlt className="text-blue-600 mr-2 text-sm sm:text-base" />
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">
                      <SimpleTranslator
                        text="Güvenlik"
                        targetLang={currentLanguage as any}
                      />
                    </span>
                  </div>
                  <button
                    onClick={() => window.open('tel:+902125550101')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-colors"
                  >
                    +90 212 555 0101
                  </button>
                </div>

                {/* Concierge */}
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center mb-2">
                    <FaConciergeBell className="text-green-600 mr-2 text-sm sm:text-base" />
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">
                      <SimpleTranslator
                        text="Concierge"
                        targetLang={currentLanguage as any}
                      />
                    </span>
                  </div>
                  <button
                    onClick={() => window.open('tel:+902125550102')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-colors"
                  >
                    +90 212 555 0102
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}