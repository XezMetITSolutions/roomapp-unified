import Link from 'next/link';

export default function BilgiPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              ← Geri Dön
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Otel Bilgileri</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* WiFi */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                📶
              </div>
              <h3 className="text-xl font-semibold text-gray-900">WiFi</h3>
            </div>
            <p className="text-gray-600">Ücretsiz WiFi hizmeti tüm otel genelinde mevcuttur.</p>
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <p className="font-mono text-sm">Ağ: HotelGuest</p>
              <p className="font-mono text-sm">Şifre: Welcome2024</p>
            </div>
          </div>

          {/* Restoran */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                🍽️
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Restoran</h3>
            </div>
            <p className="text-gray-600">Ana restoranımızda lezzetli yemekler.</p>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Açılış: 07:00</p>
              <p className="text-sm text-gray-500">Kapanış: 23:00</p>
            </div>
          </div>

          {/* Havuz */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mr-4">
                🏊
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Havuz</h3>
            </div>
            <p className="text-gray-600">Yıl boyunca açık kapalı havuz.</p>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Açılış: 06:00</p>
              <p className="text-sm text-gray-500">Kapanış: 22:00</p>
            </div>
          </div>

          {/* Spa */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                💆
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Spa & Wellness</h3>
            </div>
            <p className="text-gray-600">Rahatlatıcı spa hizmetleri.</p>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Açılış: 09:00</p>
              <p className="text-sm text-gray-500">Kapanış: 21:00</p>
            </div>
          </div>
        </div>

        {/* Hızlı İletişim */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Hızlı İletişim</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">📞 Resepsiyon</h4>
              <a href="tel:+902125550100" className="text-red-600 font-mono">+90 212 555 0100</a>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">🛡️ Güvenlik</h4>
              <a href="tel:+902125550101" className="text-blue-600 font-mono">+90 212 555 0101</a>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">🔔 Concierge</h4>
              <a href="tel:+902125550102" className="text-green-600 font-mono">+90 212 555 0102</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}