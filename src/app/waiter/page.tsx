'use client';

import { useState } from 'react';
import { User, Phone, MessageCircle, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useHotelStore } from '@/store/hotelStore';
import { translate } from '@/lib/translations';
import BottomNavigation from '@/components/BottomNavigation';

export default function WaiterPage() {
  const { currentLanguage } = useHotelStore();
  const [activeTab, setActiveTab] = useState<'home' | 'cart' | 'waiter' | 'favorites'>('waiter');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isRequestSent, setIsRequestSent] = useState(false);

  const services = [
    {
      id: 'menu',
      title: translate('menu_request', currentLanguage),
      description: translate('menu_request_desc', currentLanguage),
      icon: '📋',
      color: 'bg-blue-50 border-blue-200 text-blue-700'
    },
    {
      id: 'bill',
      title: translate('bill_request', currentLanguage),
      description: translate('bill_request_desc', currentLanguage),
      icon: '🧾',
      color: 'bg-green-50 border-green-200 text-green-700'
    },
    {
      id: 'water',
      title: translate('water_request', currentLanguage),
      description: translate('water_request_desc', currentLanguage),
      icon: '💧',
      color: 'bg-cyan-50 border-cyan-200 text-cyan-700'
    },
    {
      id: 'napkin',
      title: translate('napkin_request', currentLanguage),
      description: translate('napkin_request_desc', currentLanguage),
      icon: '🧻',
      color: 'bg-purple-50 border-purple-200 text-purple-700'
    },
    {
      id: 'clean',
      title: translate('clean_request', currentLanguage),
      description: translate('clean_request_desc', currentLanguage),
      icon: '🧽',
      color: 'bg-yellow-50 border-yellow-200 text-yellow-700'
    },
    {
      id: 'other',
      title: translate('other_request', currentLanguage),
      description: translate('other_request_desc', currentLanguage),
      icon: '❓',
      color: 'bg-gray-50 border-gray-200 text-gray-700'
    }
  ];

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setIsRequestSent(false);
  };

  const handleSendRequest = () => {
    if (selectedService) {
      setIsRequestSent(true);
      // Burada gerçek API çağrısı yapılabilir
      setTimeout(() => {
        setIsRequestSent(false);
        setSelectedService(null);
        setMessage('');
      }, 3000);
    }
  };

  if (isRequestSent) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-orange-500 text-white p-4">
          <h1 className="text-2xl font-bold">Garson Çağır</h1>
        </div>

        {/* Success Message */}
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Talebiniz Gönderildi!</h2>
          <p className="text-gray-600 text-center mb-8">
            Garsonunuz en kısa sürede masanıza gelecektir. Lütfen bekleyiniz.
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 w-full max-w-sm">
            <div className="flex items-center space-x-2 text-orange-700">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">Tahmini Süre: 2-3 dakika</span>
            </div>
          </div>
        </div>

        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-orange-500 text-white p-4">
        <h1 className="text-2xl font-bold">Garson Çağır</h1>
        <p className="text-orange-100 mt-1">Size nasıl yardımcı olabiliriz?</p>
      </div>

      {/* Services Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => handleServiceSelect(service.id)}
              className={`p-4 rounded-2xl border-2 transition-all ${
                selectedService === service.id
                  ? 'border-orange-500 bg-orange-50'
                  : service.color
              }`}
            >
              <div className="text-3xl mb-2">{service.icon}</div>
              <h3 className="font-semibold text-lg mb-1">{service.title}</h3>
              <p className="text-sm opacity-75">{service.description}</p>
            </button>
          ))}
        </div>

        {/* Custom Message */}
        {selectedService && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Ek Mesaj (İsteğe Bağlı)</h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Eklemek istediğiniz detayları yazın..."
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>
        )}

        {/* Send Button */}
        {selectedService && (
          <button
            onClick={handleSendRequest}
            className="w-full bg-orange-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg flex items-center justify-center space-x-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Talep Gönder</span>
          </button>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
        <div className="space-y-3">
          <button className="w-full bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Telefon Et</h4>
                <p className="text-sm text-gray-600">Direkt arama yapın</p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </button>

          <button className="w-full bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Garson Bul</h4>
                <p className="text-sm text-gray-600">Yakındaki garsonu bulun</p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Bilgi</h4>
              <p className="text-sm text-blue-700">
                Talebiniz otomatik olarak en yakın garsona iletilecektir. 
                Acil durumlar için lütfen resepsiyonu arayın.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
