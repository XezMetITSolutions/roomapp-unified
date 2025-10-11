import Link from 'next/link';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' }
  ];
}

export default function MenuItemDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/menu" className="flex items-center text-gray-600 hover:text-gray-900">
              ← Menü
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Ürün Detayı</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ürün #{params.id}</h2>
          <p className="text-gray-600 mb-6">
            Bu ürün için detaylı bilgiler burada görüntülenecek.
          </p>

          {/* Product Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Ürün Bilgileri</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Ürün ID:</span>
                  <span className="ml-2 font-medium">{params.id}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Durum:</span>
                  <span className="ml-2 font-medium text-green-600">Müsait</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Fiyat</h3>
              <div className="text-2xl font-bold text-blue-600">₺85</div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex space-x-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Sepete Ekle
            </button>
            <Link href="/menu" className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300">
              Geri Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}