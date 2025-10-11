import dynamic from 'next/dynamic';

// Announcements sayfasını dynamic import ile yükle
const AnnouncementsClient = dynamic(() => import('./AnnouncementsClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Yükleniyor...</p>
      </div>
    </div>
  )
});

export default function AnnouncementsPage() {
  return <AnnouncementsClient />;
}