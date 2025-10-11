import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Ana Sayfa</h1>
      <p className="text-lg text-gray-700 mb-6">Bu basit bir statik ana sayfadır.</p>
      <Link href="/menu" className="px-6 py-3 bg-blue-600 text-white rounded-lg">
        Menüye Git
      </Link>
    </div>
  );
}