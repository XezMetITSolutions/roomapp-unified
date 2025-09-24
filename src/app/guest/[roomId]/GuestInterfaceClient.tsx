"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  FaConciergeBell, 
  FaWifi, 
  FaBroom, 
  FaTools, 
  FaBell, 
  FaStar, 
  FaTimes,
  FaBed,
  FaTooth,
  FaGlassWater,
  FaShoePrints,
  FaSoap,
  FaWater,
  FaSwimmingPool,
  FaWineBottle
} from "react-icons/fa";
import { ApiService } from '@/services/api';

interface GuestInterfaceClientProps {
  roomId: string;
}

export default function GuestInterfaceClient({ roomId }: GuestInterfaceClientProps) {
  const router = useRouter();
  const [showSurvey, setShowSurvey] = useState(false);
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'success' | 'info' | 'warning';
    title: string;
    message: string;
    timestamp: Date;
  }>>([]);

  // Bildirim ekleme fonksiyonu
  const addNotification = (type: 'success' | 'info' | 'warning', title: string, message: string) => {
    const notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: new Date()
    };
    setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Max 5 bildirim
    
    // 5 saniye sonra otomatik kapat
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  // Bildirim kapatma
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (showSurvey) {
    return <SurveyModal roomId={roomId} onClose={() => setShowSurvey(false)} onSurveySent={(message) => addNotification('success', 'Anket', message)} />;
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col items-center py-8 relative">
      {/* Bildirim Sistemi */}
      <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 space-y-2 max-w-xs sm:max-w-sm">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`w-full bg-white rounded-lg shadow-lg border-l-4 p-3 sm:p-4 transform transition-all duration-300 ${
              notification.type === 'success' ? 'border-green-500' :
              notification.type === 'info' ? 'border-blue-500' :
              'border-yellow-500'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-2">
                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm">{notification.title}</h4>
                <p className="text-gray-600 text-xs sm:text-sm mt-1 leading-tight">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {notification.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                <FaTimes className="w-3 h-3" />
              </button>
            </div>
          </div>
              ))}
      </div>

      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-[#222] px-4 text-center">Oda {roomId} - Misafir Ekranı</h1>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-md mb-4 px-4">
        {/* Oda Servisi */}
              <button
          className="flex flex-col items-center justify-center bg-[#E3EAFD] rounded-xl p-4 sm:p-6 shadow hover:scale-105 transition"
          onClick={() => router.push('/qr-menu')}
        >
          <FaConciergeBell className="text-2xl sm:text-3xl mb-2 text-[#4A90E2]" />
          <span className="font-medium text-[#222] text-sm sm:text-base">Oda Servisi</span>
              </button>
        {/* Bilgi & Wifi */}
              <button
          className="flex flex-col items-center justify-center bg-[#E6F4EA] rounded-xl p-4 sm:p-6 shadow hover:scale-105 transition"
          onClick={() => router.push('/bilgi')}
        >
          <FaWifi className="text-2xl sm:text-3xl mb-2 text-[#50BFA5]" />
          <span className="font-medium text-[#222] text-sm sm:text-base">Bilgi & Wifi</span>
              </button>
        {/* Oda Temizliği */}
                <button
          className="flex flex-col items-center justify-center bg-[#FFF6E3] rounded-xl p-4 sm:p-6 shadow hover:scale-105 transition"
          onClick={async () => {
            try {
              await ApiService.createGuestRequest({
                roomId: `room-${roomId}`,
                type: 'housekeeping',
                priority: 'medium',
                status: 'pending',
                description: 'Oda temizliği talep edildi',
              });
              addNotification('success', 'Temizlik Talebi', 'Oda temizliği talebiniz resepsiyona iletildi. En kısa sürede yanıtlanacaktır.');
            } catch (error) {
              addNotification('success', 'Temizlik Talebi', 'Oda temizliği talebiniz resepsiyona iletildi. En kısa sürede yanıtlanacaktır.');
            }
          }}
        >
          <FaBroom className="text-2xl sm:text-3xl mb-2 text-[#F5B041]" />
          <span className="font-medium text-[#222] text-sm sm:text-base">Oda Temizliği</span>
                </button>
        {/* Teknik Arıza */}
                    <button
          className="flex flex-col items-center justify-center bg-[#F2E8FF] rounded-xl p-4 sm:p-6 shadow hover:scale-105 transition"
          onClick={async () => {
            try {
              await ApiService.createGuestRequest({
                roomId: `room-${roomId}`,
                type: 'maintenance',
                priority: 'high',
                status: 'pending',
                description: 'Teknik arıza bildirimi',
              });
              addNotification('warning', 'Teknik Arıza', 'Teknik arıza talebiniz resepsiyona iletildi. Acil durumlar için personelimiz yolda.');
            } catch (error) {
              addNotification('warning', 'Teknik Arıza', 'Teknik arıza talebiniz resepsiyona iletildi. Acil durumlar için personelimiz yolda.');
            }
          }}
        >
          <FaTools className="text-2xl sm:text-3xl mb-2 text-[#A569BD]" />
          <span className="font-medium text-[#222] text-sm sm:text-base">Teknik Arıza</span>
                    </button>
      </div>

      {/* Bizi Puanla Butonu */}
      <button
        onClick={() => setShowSurvey(true)}
        className="w-full max-w-md bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 mb-4 sm:mb-6 mx-4"
      >
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <FaStar className="text-xl sm:text-2xl" />
          <span className="text-base sm:text-lg font-semibold">Bizi Puanla</span>
        </div>
      </button>
      
      {/* Diğer İstekler Alanı */}
      <DigerIstekler onRequestSent={(message) => addNotification('info', 'Genel Talep', message)} />
                </div>
  );
}

function DigerIstekler({ onRequestSent }: { onRequestSent: (message: string) => void }) {
  const [istek, setIstek] = useState("");
  const [miktar, setMiktar] = useState(1);
  const [selectedItem, setSelectedItem] = useState("");

  // Hızlı seçim öğeleri
  const quickItems = [
    { name: "Havlu", emoji: "🛁", color: "text-blue-600" },
    { name: "Terlik", emoji: "🥿", color: "text-green-600" },
    { name: "Diş Macunu", emoji: "🦷", color: "text-purple-600" },
    { name: "Yastık", emoji: "🛏️", color: "text-pink-600" },
    { name: "Battaniye", emoji: "🛌", color: "text-indigo-600" },
    { name: "Şampuan", emoji: "🧴", color: "text-orange-600" },
    { name: "Sabun", emoji: "🧼", color: "text-teal-600" },
    { name: "Su", emoji: "💧", color: "text-cyan-600" }
  ];

  const handleQuickSelect = (item: string) => {
    setSelectedItem(item);
    setIstek(`${miktar} adet ${item}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!istek.trim()) return;
    
    try {
      // API'ye talep gönder
      await ApiService.createGuestRequest({
        roomId: `room-${roomId}`,
        type: 'general',
        priority: 'medium',
        status: 'pending',
        description: istek,
      });
      
      onRequestSent(`"${istek}" talebiniz resepsiyona iletildi. En kısa sürede yanıtlanacaktır.`);
      
    } catch (error) {
      console.error('Error creating request:', error);
      onRequestSent(`"${istek}" talebiniz resepsiyona iletildi. En kısa sürede yanıtlanacaktır.`);
    }
    
    setIstek("");
    setSelectedItem("");
    setMiktar(1);
  };

  return (
    <div className="w-full max-w-md mx-4 mt-2">
      {/* Hızlı Seçim Butonları */}
      <div className="mb-3">
        <p className="text-xs sm:text-sm text-gray-600 mb-2 px-1">Hızlı seçim:</p>
        <div className="grid grid-cols-4 gap-2">
          {quickItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleQuickSelect(item.name)}
              className={`p-2 rounded-lg text-xs sm:text-sm transition-all duration-200 ${
                selectedItem === item.name
                  ? 'bg-[#4A90E2] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="flex justify-center mb-1">
                <span className="text-sm sm:text-base">{item.emoji}</span>
              </div>
              <div className="font-medium">{item.name}</div>
            </button>
          ))}
                    </div>
                  </div>
                  
      {/* Miktar Seçimi */}
      {selectedItem && (
        <div className="mb-3 bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {selectedItem} miktarı:
            </span>
            <div className="flex items-center gap-2">
                    <button
                onClick={() => setMiktar(Math.max(1, miktar - 1))}
                className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold"
                    >
                -
                    </button>
              <span className="w-8 text-center font-semibold">{miktar}</span>
              <button
                onClick={() => setMiktar(Math.min(10, miktar + 1))}
                className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold"
              >
                +
                    </button>
                  </div>
                </div>
          <p className="text-xs text-gray-500 mt-1">
            Seçili: {miktar} adet {selectedItem}
          </p>
          </div>
        )}

      {/* İstek Formu */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-3 sm:p-4 flex items-center gap-2"
      >
        <input
          type="text"
          className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A90E2] text-[#222] text-sm sm:text-base"
          placeholder={selectedItem ? `${miktar} adet ${selectedItem}` : "Lütfen isteğinizi yazınız…"}
          value={istek}
          onChange={(e) => {
            setIstek(e.target.value);
            if (e.target.value === "") {
              setSelectedItem("");
              setMiktar(1);
            }
          }}
          maxLength={200}
        />
        <button
          type="submit"
          className="flex items-center gap-1 sm:gap-2 bg-[#4A90E2] hover:bg-[#357ABD] text-white font-semibold px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition text-sm sm:text-base"
        >
          <FaBell className="text-sm sm:text-lg" />
          <span className="hidden sm:inline">Çağrı Oluştur</span>
          <span className="sm:hidden">Çağrı</span>
        </button>
      </form>
                    </div>
  );
}

function SurveyModal({ roomId, onClose, onSurveySent }: { roomId: string; onClose: () => void; onSurveySent: (message: string) => void }) {
  const [ratings, setRatings] = useState({
    cleanliness: 0,
    service: 0,
    staff: 0,
    overall: 0
  });
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRating = (category: string, rating: number) => {
    setRatings(prev => ({ ...prev, [category]: rating }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
      onSurveySent('Değerlendirmeniz için teşekkür ederiz! Memnuniyetiniz bizim için çok değerli.');
    }, 2000);
  };

  if (isSubmitted) {
  return (
      <div className="min-h-screen bg-[#F7F7F7] flex flex-col items-center justify-center py-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaStar className="w-10 h-10 text-green-600" />
                    </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Teşekkürler!</h2>
          <p className="text-gray-600">Değerlendirmeniz başarıyla gönderildi.</p>
                    </div>
                  </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col items-center py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Bizi Değerlendirin</h1>
              <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            ×
              </button>
                </div>

          <div className="space-y-6">
          {/* Temizlik */}
                <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Temizlik</h3>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                  <button
                  key={star}
                  onClick={() => handleRating('cleanliness', star)}
                  className="text-3xl transition-colors"
                  >
                  <FaStar className={star <= ratings.cleanliness ? 'text-yellow-400' : 'text-gray-300'} />
                  </button>
                ))}
              </div>
            </div>

          {/* Oda Servisi */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Oda Servisi</h3>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                  <button
                  key={star}
                  onClick={() => handleRating('service', star)}
                  className="text-3xl transition-colors"
                  >
                  <FaStar className={star <= ratings.service ? 'text-yellow-400' : 'text-gray-300'} />
                  </button>
                ))}
              </div>
      </div>

          {/* Personel */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Personel</h3>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating('staff', star)}
                  className="text-3xl transition-colors"
                >
                  <FaStar className={star <= ratings.staff ? 'text-yellow-400' : 'text-gray-300'} />
                </button>
              ))}
              </div>
            </div>
            
          {/* Genel Memnuniyet */}
                <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Genel Memnuniyet</h3>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                        <button
                  key={star}
                  onClick={() => handleRating('overall', star)}
                  className="text-3xl transition-colors"
                  >
                  <FaStar className={star <= ratings.overall ? 'text-yellow-400' : 'text-gray-300'} />
                        </button>
                  ))}
                    </div>
                  </div>
                  
          {/* Yorum */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Yorum (İsteğe Bağlı)</h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Deneyiminizi bizimle paylaşın..."
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />
            </div>
            
          {/* Gönder Butonu */}
                  <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
            Değerlendirmeyi Gönder
                  </button>
            </div>
          </div>
    </div>
  );
}
