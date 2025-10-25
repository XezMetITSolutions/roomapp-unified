import Link from 'next/link';

export default function ReceptionPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Resepsiyon Paneli</h1>
      <p className="text-lg text-gray-700 mb-6">Bu basit bir statik resepsiyon sayfasıdır.</p>
      <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Ana Sayfaya Geri Dön
      </Link>
    </div>
  );
}