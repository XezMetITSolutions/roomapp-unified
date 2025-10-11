import Link from 'next/link';

export async function generateStaticParams() {
  return [
    { roomId: '101' },
    { roomId: '102' },
    { roomId: '103' },
    { roomId: '201' },
    { roomId: '202' },
    { roomId: '203' }
  ];
}

export default function GuestInterface({ params }: { params: { roomId: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              ← Ana Sayfa
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Oda {params.roomId}</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hoş Geldiniz!</h2>
          <p className="text-gray-600 mb-4">
            Oda {params.roomId} için konuk arayüzüne hoş geldiniz.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/menu" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                🍽️
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Menü</h3>
            </div>
            <p className="text-gray-600">Yemek menüsünü görüntüleyin ve sipariş verin.</p>
          </Link>

          <Link href="/bilgi" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                ℹ️
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Bilgi</h3>
            </div>
            <p className="text-gray-600">Otel hizmetleri ve bilgileri.</p>
          </Link>
        </div>

        {/* Room Info */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Oda Bilgileri</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Oda Numarası</p>
              <p className="font-semibold">{params.roomId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Durum</p>
              <p className="font-semibold text-green-600">Aktif</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}