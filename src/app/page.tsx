import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">🏨 RoomApp</h1>
              </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/bilgi" className="text-gray-600 hover:text-gray-900">Bilgi</Link>
              <Link href="/menu" className="text-gray-600 hover:text-gray-900">Menü</Link>
              <Link href="/isletme" className="text-gray-600 hover:text-gray-900">İşletme</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Hoş Geldiniz
          </h2>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Otel yönetim sisteminize hoş geldiniz. Tüm hizmetlerimizden yararlanabilirsiniz.
          </p>
      </div>

        {/* Quick Actions */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/menu" className="group relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div>
              <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                🍽️
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium">
                <span className="absolute inset-0" />
                Menü
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Yemek menüsünü görüntüleyin ve sipariş verin.
              </p>
          </div>
          </Link>

          <Link href="/bilgi" className="group relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div>
              <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                ℹ️
              </span>
                  </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium">
                <span className="absolute inset-0" />
                Bilgi
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Otel hizmetleri ve bilgileri.
              </p>
                </div>
          </Link>

          <Link href="/isletme" className="group relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div>
              <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                ⚙️
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium">
                <span className="absolute inset-0" />
                İşletme
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                İşletme yönetim paneli.
              </p>
          </div>
          </Link>
      </div>

        {/* Features */}
        <div className="mt-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Özellikler</h2>
            <p className="mt-4 text-lg text-gray-600">
              Modern otel yönetim sistemi
            </p>
          </div>
          
          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                📱
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Mobil Uyumlu</h3>
              <p className="mt-2 text-base text-gray-500">
                Tüm cihazlarda mükemmel görünüm
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                ⚡
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Hızlı</h3>
              <p className="mt-2 text-base text-gray-500">
                Anında yükleme ve yanıt
              </p>
          </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                🔒
                  </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Güvenli</h3>
              <p className="mt-2 text-base text-gray-500">
                Veri güvenliği öncelik
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                🎨
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Modern</h3>
              <p className="mt-2 text-base text-gray-500">
                Çağdaş tasarım ve kullanım
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-16">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-base text-gray-400">
              © 2024 RoomApp. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}