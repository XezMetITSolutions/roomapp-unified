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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Menü Detay Sayfası</h1>
      <p className="text-lg text-gray-700 mb-6">Ürün ID: {params.id}</p>
      <Link href="/menu" className="px-6 py-3 bg-blue-600 text-white rounded-lg">
        Menüye Geri Dön
      </Link>
    </div>
  );
}