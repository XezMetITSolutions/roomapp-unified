'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Minus, Trash2, Edit3, ShoppingBag } from 'lucide-react';
import { useHotelStore } from '@/store/hotelStore';
import { translate } from '@/lib/translations';
import BottomNavigation from '@/components/BottomNavigation';
import Image from 'next/image';

export default function CartPage() {
  const router = useRouter();
  const { cart, updateCartItemQuantity, removeFromCart, updateCartItemSpecialRequests, clearCart, currentLanguage } = useHotelStore();
  const [activeTab, setActiveTab] = useState<'home' | 'cart' | 'waiter' | 'favorites'>('cart');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [specialInstructions, setSpecialInstructions] = useState(cart.specialInstructions || '');

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateCartItemQuantity(itemId, newQuantity);
    }
  };

  const handleSpecialRequestsChange = (itemId: string, requests: string) => {
    updateCartItemSpecialRequests(itemId, requests);
  };

  const handleCheckout = () => {
    // Sepeti güncelle
    // clearCart();
    router.push('/checkout');
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-orange-500 text-white p-4">
          <h1 className="text-2xl font-bold">{translate('cart', currentLanguage)}</h1>
        </div>

        {/* Empty Cart */}
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sepetiniz Boş</h2>
          <p className="text-gray-500 text-center mb-8">
            Henüz sepetinize ürün eklemediniz. Menüden beğendiğiniz ürünleri sepete ekleyebilirsiniz.
          </p>
          <button
            onClick={() => router.push('/menu')}
            className="bg-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
          >
            Menüye Git
          </button>
        </div>

        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-orange-500 text-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Sepetim</h1>
          <button
            onClick={clearCart}
            className="text-orange-100 hover:text-white transition-colors"
          >
            Temizle
          </button>
        </div>
      </div>

      {/* Cart Items */}
      <div className="p-4 space-y-4">
        {cart.items.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-start space-x-4">
              {/* Item Image */}
              <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                {item.menuItem.image ? (
                  <Image
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    fill
                    sizes="64px"
                    className="object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-500 text-lg font-bold">
                      {item.menuItem.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Item Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">{item.menuItem.name}</h3>
                <p className="text-orange-500 font-bold text-lg">₺{item.totalPrice.toFixed(2)}</p>
                
                {/* Special Requests */}
                {editingItem === item.id ? (
                  <div className="mt-3">
                    <textarea
                      value={item.specialRequests || ''}
                      onChange={(e) => handleSpecialRequestsChange(item.id, e.target.value)}
                      placeholder="Özel isteklerinizi yazın..."
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                      rows={2}
                    />
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => setEditingItem(null)}
                        className="text-orange-500 text-sm font-semibold"
                      >
                        Kaydet
                      </button>
                      <button
                        onClick={() => setEditingItem(null)}
                        className="text-gray-500 text-sm"
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2">
                    {item.specialRequests && (
                      <p className="text-gray-600 text-sm mb-2">
                        <span className="font-medium">Özel İstek:</span> {item.specialRequests}
                      </p>
                    )}
                    <button
                      onClick={() => setEditingItem(item.id)}
                      className="text-orange-500 text-sm font-semibold flex items-center space-x-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Düzenle</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Quantity Controls */}
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Special Instructions */}
      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Siparişinizle İlgili Bir İsteğiniz Var mı?</h3>
          <textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Özel talimatlarınızı yazın..."
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>
      </div>

      {/* Order Summary */}
      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-900">Toplam</span>
            <span className="text-2xl font-bold text-orange-500">₺{cart.totalAmount.toFixed(2)}</span>
          </div>
          
          <button
            onClick={handleCheckout}
            className="w-full bg-orange-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg"
          >
            Siparişi Tamamla
          </button>
        </div>
      </div>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
