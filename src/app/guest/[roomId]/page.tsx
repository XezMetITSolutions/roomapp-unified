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
            <Link href="/" className="flex items-center text-gray-600">
              ← Ana Sayfa
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Oda {params.roomId}</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Hoş Geldiniz!</h2>
        <p className="text-gray-600 mb-6">Oda numaranız: <span className="font-bold text-blue-600">{params.roomId}</span></p>
        <p className="text-gray-600 mb-8">Bu sayfa statik olarak oluşturulmuştur.</p>
        <Link href="/menu" className="px-6 py-3 bg-green-600 text-white rounded-lg">
          Menüyü Görüntüle
        </Link>
      </div>
    </div>
  );
}