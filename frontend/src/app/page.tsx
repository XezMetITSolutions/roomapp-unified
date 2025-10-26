import Link from 'next/link';
import { QrCode, Menu, Users, Settings, BarChart3, Bell } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">RoomApp</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="w-6 h-6 text-gray-600" />
              <Settings className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Otel Yönetim Sistemine Hoş Geldiniz
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            QR kod tabanlı misafir hizmetleri ile modern otel yönetimi. 
            Menü, siparişler, analitikler ve daha fazlası tek platformda.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* QR Menü */}
          <Link href="/qr-menu" className="group">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <QrCode className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">QR Menü</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Misafirlerin QR kod ile menüye erişmesini sağlayın
              </p>
              <div className="text-blue-600 font-medium group-hover:text-blue-700">
                QR Menü Oluştur →
              </div>
            </div>
          </Link>

          {/* Menü Yönetimi */}
          <Link href="/menu" className="group">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <Menu className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Menü Yönetimi</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Yemek menülerini düzenleyin ve kategorilere ayırın
              </p>
              <div className="text-blue-600 font-medium group-hover:text-blue-700">
                Menüyü Düzenle →
              </div>
            </div>
          </Link>

          {/* Mutfak */}
          <Link href="/kitchen" className="group">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <Menu className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Mutfak Paneli</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Gelen siparişleri görüntüleyin ve durumlarını güncelleyin
              </p>
              <div className="text-blue-600 font-medium group-hover:text-blue-700">
                Mutfağa Git →
              </div>
            </div>
          </Link>

          {/* Resepsiyon */}
          <Link href="/reception" className="group">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Resepsiyon</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Misafir kayıtları ve oda yönetimi
              </p>
              <div className="text-blue-600 font-medium group-hover:text-blue-700">
                Resepsiyona Git →
              </div>
            </div>
          </Link>

          {/* Analitikler */}
          <Link href="/isletme/analytics" className="group">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Analitikler</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Satış raporları ve performans analizi
              </p>
              <div className="text-blue-600 font-medium group-hover:text-blue-700">
                Raporları Gör →
              </div>
            </div>
          </Link>

          {/* Paneller */}
          <Link href="/paneller" className="group">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mr-4">
                  <Settings className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Paneller</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Sistem panelleri ve ayarları
              </p>
              <div className="text-blue-600 font-medium group-hover:text-blue-700">
                Panellere Git →
              </div>
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            RoomApp Özellikleri
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">QR Kod Entegrasyonu</h4>
              <p className="text-sm text-gray-600">Temassız menü erişimi</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Menu className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Gerçek Zamanlı Sipariş</h4>
              <p className="text-sm text-gray-600">Anlık sipariş takibi</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Detaylı Raporlama</h4>
              <p className="text-sm text-gray-600">Kapsamlı analitikler</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Kolay Yönetim</h4>
              <p className="text-sm text-gray-600">Kullanıcı dostu arayüz</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">RoomApp</span>
          </div>
          <p className="text-gray-400">
            © 2024 XezMet IT Solutions. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
}