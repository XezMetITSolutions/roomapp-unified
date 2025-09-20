'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Share, Heart, Plus, Minus, Wheat, Egg, Milk, Nut } from 'lucide-react';
import { useHotelStore } from '@/store/hotelStore';
import { MenuItem } from '@/types';
import BottomNavigation from '@/components/BottomNavigation';

export default function MenuItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { menu, addToCart } = useHotelStore();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [activeTab, setActiveTab] = useState<'home' | 'cart' | 'waiter' | 'favorites'>('home');

  useEffect(() => {
    const menuItem = menu.find(item => item.id === params.id);
    if (menuItem) {
      setItem(menuItem);
    }
  }, [params.id, menu]);

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Ürün bulunamadı</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-orange-500 font-semibold"
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  const getDietaryIcon = (type: string) => {
    switch (type) {
      case 'wheat': return <Wheat className="w-4 h-4" />;
      case 'egg': return <Egg className="w-4 h-4" />;
      case 'milk': return <Milk className="w-4 h-4" />;
      case 'nuts': return <Nut className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleAddToCart = () => {
    addToCart(item, quantity, specialRequests);
    // Kısa bildirim göster
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = 'Ürün sepete eklendi';
    document.body.appendChild(notification);
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-orange-500 text-white p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-orange-600 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button className="p-2 hover:bg-orange-600 rounded-lg transition-colors">
            <Share className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Item Image */}
      <div className="relative">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-80 object-cover"
          />
        ) : (
          <div className="w-full h-80 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
            <div className="w-32 h-32 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-4xl font-bold">
                {item.name.charAt(0)}
              </span>
            </div>
          </div>
        )}
        
        {item.likes && (
          <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-xs text-gray-600 ml-1">{item.likes}</span>
          </div>
        )}
      </div>

      {/* Item Details */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.name}</h1>
            <p className="text-gray-600 leading-relaxed">{item.description}</p>
          </div>
          <div className="text-right">
            <div className="text-orange-500 font-bold text-2xl">₺{item.price.toFixed(2)}</div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center space-x-2 mb-4">
          {item.isNew && (
            <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">YENİ</span>
          )}
          {item.isPopular && (
            <span className="bg-yellow-500 text-white text-sm px-3 py-1 rounded-full">⭐</span>
          )}
        </div>

        {/* Dietary Info */}
        {item.dietaryInfo && item.dietaryInfo.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">İçerik Bilgileri</h3>
            <div className="flex items-center space-x-3">
              {item.dietaryInfo.map((diet, index) => (
                <div key={index} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  {getDietaryIcon(diet)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Miktar</h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Special Requests */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Özel İstekler</h3>
          <textarea
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="Özel isteklerinizi yazın..."
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-orange-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Sepete Ekle - ₺{(item.price * quantity).toFixed(2)}</span>
        </button>
      </div>

      {/* Comments Section */}
      <div className="px-6 pb-6">
        <div className="bg-orange-500 text-white p-4 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Henüz herhangi bir yorum yok.</span>
            <button className="bg-white text-orange-500 px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
              Yorum Ekle
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
