export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-hotel-gold mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Yükleniyor...
        </h2>
        <p className="text-gray-600">
          Lütfen bekleyin, sayfa yükleniyor.
        </p>
      </div>
    </div>
  )
}
