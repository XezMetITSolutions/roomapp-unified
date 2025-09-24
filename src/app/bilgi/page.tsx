'use client';
import { useState } from 'react';
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

export default function BilgiPage() {
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: 'wifi',
      icon: FaWifi,
      title: 'WiFi & İnternet',
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
      content: (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-2">WiFi Bilgileri</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Ağ Adı:</span>
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">HotelLuxury_Guest</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Şifre:</span>
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">Luxury2024!</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hız:</span>
                <span className="text-green-600 font-medium">100 Mbps</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-2">İnternet Kullanımı</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Sınırsız internet erişimi</li>
              <li>• Tüm odalar WiFi kapsamında</li>
              <li>• Lobi ve ortak alanlarda ücretsiz WiFi</li>
              <li>• Teknik destek: +90 212 555 0199</li>
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
            <h4 className="font-semibold text-gray-900 mb-3">Otel Hizmetleri</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Resepsiyon</span>
                <span className="font-medium">24 Saat</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Oda Servisi</span>
                <span className="font-medium">06:00 - 23:00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Restoran</span>
                <span className="font-medium">07:00 - 22:00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Bar</span>
                <span className="font-medium">18:00 - 01:00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Spa & Wellness</span>
                <span className="font-medium">09:00 - 21:00</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center mb-3">
              <FaSwimmingPool className="text-blue-500 mr-2" />
              <h4 className="font-semibold text-gray-900">Havuz & Spa</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Açık yüzme havuzu (07:00-20:00)</li>
              <li>• Kapalı yüzme havuzu (24 saat)</li>
              <li>• Sauna ve buhar odası</li>
              <li>• Masaj hizmetleri</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center mb-3">
              <FaDumbbell className="text-green-500 mr-2" />
              <h4 className="font-semibold text-gray-900">Fitness</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Modern fitness center</li>
              <li>• Kişisel antrenör</li>
              <li>• Yoga dersleri (09:00-10:00)</li>
              <li>• Pilates dersleri (17:00-18:00)</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center mb-3">
              <FaCar className="text-gray-500 mr-2" />
              <h4 className="font-semibold text-gray-900">Ulaşım</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Valet park hizmeti</li>
              <li>• Otopark (günlük 50₺)</li>
              <li>• Havaalanı transferi</li>
              <li>• Şehir merkezi servisi</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center mb-3">
              <FaChild className="text-orange-500 mr-2" />
              <h4 className="font-semibold text-gray-900">Çocuklar İçin</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Çocuk havuzu</li>
              <li>• Oyun alanı</li>
              <li>• Bebek bakım hizmeti</li>
              <li>• Çocuk menüsü</li>
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
            <h4 className="font-semibold text-gray-900 mb-3">Restoranlar</h4>
            <div className="space-y-3">
              <div className="border-l-4 border-orange-400 pl-4">
                <h5 className="font-medium text-gray-900">Ana Restoran</h5>
                <p className="text-sm text-gray-600">Uluslararası mutfak • 07:00-22:00</p>
              </div>
              <div className="border-l-4 border-blue-400 pl-4">
                <h5 className="font-medium text-gray-900">Deniz Ürünleri Restoranı</h5>
                <p className="text-sm text-gray-600">Taze balık ve deniz ürünleri • 18:00-23:00</p>
              </div>
              <div className="border-l-4 border-green-400 pl-4">
                <h5 className="font-medium text-gray-900">Teras Bar</h5>
                <p className="text-sm text-gray-600">Kokteyl ve hafif yemekler • 18:00-01:00</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-2">Yemek Saatleri</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Kahvaltı:</span>
                <span className="font-medium ml-2">07:00-11:00</span>
              </div>
              <div>
                <span className="text-gray-600">Öğle Yemeği:</span>
                <span className="font-medium ml-2">12:00-15:00</span>
              </div>
              <div>
                <span className="text-gray-600">Akşam Yemeği:</span>
                <span className="font-medium ml-2">18:00-22:00</span>
              </div>
              <div>
                <span className="text-gray-600">Gece Atıştırmalığı:</span>
                <span className="font-medium ml-2">22:00-01:00</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'room',
      icon: FaBed,
      title: 'Oda Hizmetleri',
      color: 'bg-indigo-50 border-indigo-200',
      iconColor: 'text-indigo-600',
      content: (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-3">Oda Özellikleri</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <FaTv className="text-blue-500 mr-2" />
                  <span>Smart TV</span>
                </div>
                <div className="flex items-center text-sm">
                  <FaWind className="text-green-500 mr-2" />
                  <span>Klima</span>
                </div>
                <div className="flex items-center text-sm">
                  <FaShower className="text-purple-500 mr-2" />
                  <span>Jakuzili Banyo</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <FaWifi className="text-blue-500 mr-2" />
                  <span>Ücretsiz WiFi</span>
                </div>
                <div className="flex items-center text-sm">
                  <FaCoffee className="text-orange-500 mr-2" />
                  <span>Kahve Makinesi</span>
                </div>
                <div className="flex items-center text-sm">
                  <FaSnowflake className="text-gray-500 mr-2" />
                  <span>Minibar</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-2">Temizlik & Bakım</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Günlük oda temizliği (09:00-15:00)</li>
              <li>• Yatak değişimi (3 günde bir)</li>
              <li>• Havlu değişimi (günlük)</li>
              <li>• Teknik destek (24 saat)</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaArrowLeft className="mr-1 sm:mr-2 text-sm sm:text-base" />
              <span className="hidden sm:inline text-sm sm:text-base">Geri Dön</span>
            </button>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Otel Bilgileri</h1>
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
                        {section.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        {expandedSection === section.id ? 'Bilgileri gizle' : 'Detayları görüntüle'}
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

        {/* Hızlı Arama */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 text-center">Hızlı İletişim</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 text-center">
            Acil durumlar için direkt arayabilirsiniz
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Resepsiyon */}
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 sm:p-4">
              <div className="flex items-center mb-2">
                <FaPhone className="text-red-600 mr-2 text-sm sm:text-base" />
                <span className="font-semibold text-gray-900 text-sm sm:text-base">Resepsiyon</span>
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
                <span className="font-semibold text-gray-900 text-sm sm:text-base">Güvenlik</span>
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
                <span className="font-semibold text-gray-900 text-sm sm:text-base">Concierge</span>
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
    </div>
  );
}
