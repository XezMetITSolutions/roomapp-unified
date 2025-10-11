import Link from 'next/link';

export default function IsletmeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-blue-600 font-medium">
              ← Ana Sayfa
            </Link>
            <h1 className="text-xl font-bold text-gray-900">İşletme Paneli</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
}