import dynamic from 'next/dynamic';

const MenuClient = dynamic(() => import('./MenuManagementClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Menü yönetimi yükleniyor...</p>
      </div>
    </div>
  )
});

export default function MenuPage() {
  return <MenuClient />;
}