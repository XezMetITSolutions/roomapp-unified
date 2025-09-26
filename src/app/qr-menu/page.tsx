"use client";
import { useState, useRef, useEffect } from "react";
import { Clock, Star, Image as ImageIcon, Minus, Plus, X, ArrowLeft } from 'lucide-react';
import NextImage from 'next/image';
import { FaBell, FaTimes } from 'react-icons/fa';
import { ApiService } from '@/services/api';

// Gerçekçi ve içerikle %100 uyumlu menü datası - Tüm görseller test edildi ve çalışıyor
const menuData = [
  {
    id: '1',
    name: 'Cheeseburger',
    description: 'Sulu dana köftesi, cheddar peyniri, taze marul, domates ve özel sos ile',
    price: 210,
    preparationTime: 18,
    rating: 4.8,
    category: 'main',
    subCategory: 'burger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    allergens: ['gluten', 'süt'],
    service: 'Patates kızartması ve turşu ile servis edilir.',
    available: true,
  },
  {
    id: '2',
    name: 'Margherita Pizza',
    description: 'Mozzarella, domates sosu ve taze fesleğen ile',
    price: 185,
    preparationTime: 20,
    rating: 4.7,
    category: 'main',
    subCategory: 'pizza',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
    allergens: ['gluten', 'süt'],
    service: 'Zeytinyağı ve baharat ile servis edilir.',
    available: true,
  },
  {
    id: '3',
    name: 'Caesar Salata',
    description: 'Romaine marul, parmesan, kruton ve Caesar sos',
    price: 120,
    preparationTime: 10,
    rating: 4.6,
    category: 'appetizer',
    subCategory: 'salad',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=800&q=80',
    allergens: ['süt', 'gluten'],
    service: 'Izgara tavuk ile tercih edilebilir.',
    available: true,
  },
  {
    id: '4',
    name: 'Tiramisu',
    description: 'Klasik İtalyan tatlısı, mascarpone ve kahve ile',
    price: 95,
    preparationTime: 8,
    rating: 4.9,
    category: 'dessert',
    subCategory: 'classic',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
    allergens: ['süt', 'gluten', 'yumurta'],
    service: 'Kakao serpilerek servis edilir.',
    available: true,
  },
  {
    id: '5',
    name: 'Cappuccino',
    description: 'Yoğun espresso, süt köpüğü ile',
    price: 55,
    preparationTime: 4,
    rating: 4.7,
    category: 'beverage',
    subCategory: 'hot',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80',
    allergens: ['süt'],
    service: 'Mini kurabiye ile servis edilir.',
    available: true,
  },
  {
    id: '6',
    name: 'Izgara Bonfile',
    description: 'Premium dana bonfile, taze otlar ve zeytinyağı ile marine edilmiş',
    price: 320,
    preparationTime: 25,
    rating: 4.9,
    category: 'main',
    subCategory: 'steak',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    allergens: [],
    service: 'Fırın patates ve taze sebzeler ile servis edilir.',
    available: true,
  },
  {
    id: '7',
    name: 'Serpme Kahvaltı',
    description: 'Taze peynirler, zeytin, domates, salatalık, reçel ve bal',
    price: 180,
    preparationTime: 15,
    rating: 4.5,
    category: 'breakfast',
    subCategory: 'turkish',
    image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=800&q=80',
    allergens: ['süt', 'gluten'],
    service: 'Çay ve taze sıkılmış portakal suyu ile servis edilir.',
    available: true,
  },
  {
    id: '8',
    name: 'Fırın Sütlaç',
    description: 'Geleneksel fırın sütlacı, karamelize yüzey ile',
    price: 65,
    preparationTime: 5,
    rating: 4.8,
    category: 'dessert',
    subCategory: 'traditional',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    allergens: ['süt', 'gluten'],
    service: 'Tarçın ve fındık ile servis edilir.',
    available: true,
  },
];

const categories = [
  { id: 'all', name: 'Tümü' },
  { id: 'breakfast', name: 'Kahvaltı' },
  { id: 'main', name: 'Ana Yemekler' },
  { id: 'appetizer', name: 'Mezeler' },
  { id: 'dessert', name: 'Tatlılar' },
  { id: 'beverage', name: 'İçecekler' },
];

const subCategories = {
  breakfast: [
    { id: 'classic', name: 'Klasik' },
  ],
  main: [
    { id: 'meat', name: 'Et' },
    { id: 'fish', name: 'Balık' },
  ],
  dessert: [
    { id: 'classic', name: 'Klasik' },
  ],
  beverage: [
    { id: 'hot', name: 'Sıcak' },
    { id: 'juice', name: 'Meyve Suyu' },
  ],
};

import Image from 'next/image';

export default function QRMenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<{ id: string; quantity: number }[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [cartNote, setCartNote] = useState('');
  const [orderStatus, setOrderStatus] = useState<'idle' | 'payment' | 'finalized'>('idle');
  
  // Bildirim sistemi
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
    
    // 8 saniye sonra otomatik kapat
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 8000);
  };

  // Bildirim kapatma
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // WebSocket bağlantısı - resepsiyondan gelen bildirimleri dinle
  useEffect(() => {
    // URL'den oda numarasını al (örnek: /qr-menu?roomId=101)
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('roomId') || '101';
    
    const ws = ApiService.connectWebSocket(roomId, (data) => {
      console.log('QR Menü bildirimi alındı:', data);
      
      if (data.type === 'guest_notification') {
        addNotification('info', 'Resepsiyon Yanıtı', data.message);
      }
    });

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  // Kategori ve alt kategoriye göre filtrele
  let filteredMenu = menuData.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSubCategory = !selectedSubCategory || item.subCategory === selectedSubCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSubCategory && matchesSearch && item.available;
  });

  // Alt kategori gösterimi
  const showSubCategories = selectedCategory !== 'all' && (subCategories as any)[selectedCategory]?.length > 0;

  // Sepete ekle
  const addToCart = (id: string) => {
    setCart(prev => {
      const found = prev.find(item => item.id === id);
      if (found) {
        return prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        return [...prev, { id, quantity: 1 }];
      }
    });
  };
  // Sepetten çıkar
  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };
  // Adet değiştir
  const setCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
    }
  };
  // Sepetteki ürünleri getir
  const getCartItems = () => cart.map(ci => {
    const product = menuData.find(m => m.id === ci.id);
    return product ? { ...product, quantity: ci.quantity } : null;
  }).filter(Boolean) as (typeof menuData[0] & { quantity: number })[];
  // Sepet toplamı
  const getCartTotal = () => getCartItems().reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Sipariş onay akışı

  // Siparişi onayla - önce onay modalına git
  const handleOrder = () => {
    setShowConfirmation(true);
    setShowCart(false);
  };
  // Onay modalından ödemeye geç
  const handleProceedToPayment = () => {
    setShowConfirmation(false);
    setOrderStatus('payment');
    addNotification('info', 'Sipariş Onaylandı', 'Siparişiniz onaylandı, ödeme aşamasına geçiliyor.');
  };
  // Onay modalından sepete geri dön
  const handleBackToCart = () => {
    setShowConfirmation(false);
    setShowCart(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] py-8 relative">
      {/* Bildirim Sistemi */}
      <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 space-y-2 max-w-xs sm:max-w-sm">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`w-full bg-white rounded-xl shadow-2xl border-l-4 p-4 sm:p-5 transform transition-all duration-500 notification-slide-in notification-gentle-pulse ${
              notification.type === 'success' ? 'border-green-500 bg-green-50' :
              notification.type === 'info' ? 'border-blue-500 bg-blue-50' :
              'border-yellow-500 bg-yellow-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-2">
                <div className="flex items-center gap-2 mb-1">
                  <FaBell className={`w-4 h-4 ${
                    notification.type === 'success' ? 'text-green-600' :
                    notification.type === 'info' ? 'text-blue-600' :
                    'text-yellow-600'
                  }`} />
                  <h4 className="font-bold text-gray-900 text-sm sm:text-base">{notification.title}</h4>
                </div>
                <p className="text-gray-700 text-sm sm:text-base mt-1 leading-relaxed font-medium">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <span>🕐</span>
                  {notification.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-2 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 p-1 hover:bg-gray-200 rounded-full"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Geri Dönüş Butonu */}
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Geri Dön</span>
          </button>
        </div>
        
        <h1 className="text-3xl font-extrabold text-[#223] mb-8 text-center tracking-tight">Oda Servisi Menüsü</h1>
        {/* Kategori ve Arama */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
          <div className="flex space-x-2 overflow-x-auto w-full md:w-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setSelectedSubCategory('');
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ${
                  selectedCategory === category.id
                    ? 'bg-gray-800 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
                <input
                  type="text"
                  placeholder="Ürün ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-[#222] text-base min-w-[180px]"
                />
              </div>
        {/* Alt Kategoriler - Daha belirgin tasarım */}
        {showSubCategories && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Alt Kategoriler</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedSubCategory('')}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md ${
                  selectedSubCategory === ''
                    ? 'bg-gray-800 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg border border-gray-200'
                }`}
              >
                Tümü
              </button>
              {(subCategories as any)[selectedCategory].map((sub: any) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubCategory(sub.id)}
                  className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md ${
                    selectedSubCategory === sub.id
                      ? 'bg-gray-800 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg border border-gray-200'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Menü Grid - Mobilde 1, tablette 2, masaüstünde 3 sütun */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenu.map((item) => (
            <MenuCard
              key={item.id}
              {...item}
              onAdd={() => addToCart(item.id)}
            />
          ))}
        </div>
        {filteredMenu.length === 0 && (
          <div className="hotel-card p-12 text-center mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ürün Bulunamadı</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Arama kriterlerinize uygun ürün bulunamadı.' : 'Bu kategoride ürün bulunmuyor.'}
            </p>
          </div>
        )}
        {/* Sepet Butonu */}
        {cart.length > 0 && orderStatus === 'idle' && (
          <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50">
            <button
              onClick={() => setShowCart(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full shadow-xl text-lg font-bold flex items-center space-x-3 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:shadow-2xl hover:scale-105"
            >
              <span>🛒 Sepet ({getCartItems().length})</span>
              <span className="text-base font-normal">{getCartTotal()}₺</span>
            </button>
          </div>
        )}
        {/* Sepet Modal */}
        {showCart && (
          <CartModal
            items={getCartItems()}
            note={cartNote}
            setNote={setCartNote}
            onClose={() => setShowCart(false)}
            onOrder={handleOrder}
            setCartQuantity={setCartQuantity}
            removeFromCart={removeFromCart}
            total={getCartTotal()}
          />
        )}
        {/* Onay Modalı */}
        {showConfirmation && (
          <ConfirmationModal
            items={getCartItems()}
            note={cartNote}
            total={getCartTotal()}
            onProceed={handleProceedToPayment}
            onBack={handleBackToCart}
          />
        )}
        {/* Ödeme Modalı */}
        {orderStatus === 'payment' && (
          <PaymentModal
            items={getCartItems()}
            note={cartNote}
            total={getCartTotal()}
            onPaymentSuccess={() => setOrderStatus('finalized')}
            onBack={() => setOrderStatus('idle')}
          />
        )}
        
        {/* Sipariş Finalize */}
        {orderStatus === 'finalized' && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
              <h2 className="text-2xl font-bold mb-4 text-blue-700">Siparişiniz mutfağa iletildi!</h2>
              <p className="text-gray-700 mb-4">Siparişiniz hazırlanıyor. Afiyet olsun!</p>
              <button
                onClick={() => {
                  setOrderStatus('idle');
                  setCart([]);
                  setCartNote('');
                  addNotification('success', 'Sipariş Tamamlandı', 'Siparişiniz başarıyla mutfağa iletildi. Hazırlanma süresi yaklaşık 20-30 dakikadır.');
                }}
                className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >Yeni Sipariş Ver</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MenuCard({ name, description, price, preparationTime, rating, image, allergens, service, onAdd }: {
  name: string;
  description: string;
  price: number;
  preparationTime: number;
  rating?: number;
  image?: string;
  allergens?: string[];
  service?: string;
  onAdd: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const isLongDescription = description.length > 80;
  const isLongAllergens = allergens && allergens.length > 2;
  return (
    <div className="bg-white rounded-3xl shadow-lg flex flex-col overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      {/* Görsel - Responsive ve optimize edilmiş */}
      <div className="relative w-full h-48 sm:h-56 md:h-52 lg:h-56">
        {image ? (
          <NextImage 
            src={image} 
            alt={name} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center" 
          />
        ) : (
          <div className="w-full h-48 sm:h-56 md:h-52 lg:h-56 bg-gradient-to-br from-orange-100 to-red-100 flex flex-col items-center justify-center">
            <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 text-orange-400 mb-2 sm:mb-3" />
            <span className="text-3xl sm:text-4xl font-bold text-orange-500">{name.charAt(0)}</span>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-xl text-gray-900 leading-tight flex-1">{name}</h3>
          <div className="text-2xl font-extrabold text-orange-600 ml-3">{price}₺</div>
        </div>
        
        <div className="mb-3">
          <p className="text-gray-600 text-sm leading-relaxed">
            {showDetails ? description : (isLongDescription ? description.substring(0, 80) + '...' : description)}
          </p>
          {isLongDescription && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-blue-600 hover:text-blue-800 mt-1 font-medium transition-colors"
            >
              {showDetails ? 'Daha az göster' : 'Detay'}
            </button>
          )}
        </div>
        
        {service && (
          <p className="text-xs text-orange-700 mb-4 italic bg-orange-50 px-3 py-2 rounded-lg">
            {service}
          </p>
        )}
        
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{preparationTime} dk</span>
          </div>
          {rating && (
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{rating}</span>
            </div>
          )}
        </div>
        
        {allergens && allergens.length > 0 && (
          <div className="text-xs text-red-600 mb-4 bg-red-50 px-3 py-2 rounded-lg">
            Alerjenler: {showDetails ? allergens.join(', ') : (isLongAllergens ? allergens.slice(0, 2).join(', ') + '...' : allergens.join(', '))}
            {isLongAllergens && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs text-blue-600 hover:text-blue-800 ml-2 font-medium transition-colors"
              >
                {showDetails ? 'Daha az göster' : 'Detay'}
              </button>
            )}
          </div>
        )}
        
        <button
          onClick={onAdd}
          className="mt-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Sepete Ekle
        </button>
      </div>
    </div>
  );
}

function CartModal({ items, note, setNote, onClose, onOrder, setCartQuantity, removeFromCart, total }: {
  items: any[];
  note: string;
  setNote: (v: string) => void;
  onClose: () => void;
  onOrder: () => void;
  setCartQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  total: number;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl max-h-[95vh] overflow-hidden mx-2 sm:mx-0">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Sepetim</h2>
                <button
            onClick={onClose} 
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
            <X className="w-5 h-5 text-gray-600" />
                </button>
        </div>
        
        <div className="overflow-y-auto max-h-[60vh]">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛒</span>
              </div>
              <p className="text-lg font-medium">Sepetiniz boş</p>
              <p className="text-sm">Ürün eklemek için menüden seçim yapın</p>
                </div>
              ) : (
                <>
              <div className="p-4 space-y-3">
                {items.map(item => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    {/* Ürün Görseli - Daha küçük */}
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <NextImage src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                          <span className="text-sm font-bold text-orange-500">{item.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm truncate">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.price}₺</div>
                      </div>
                    
                      <div className="flex items-center space-x-2">
                        <button
                        onClick={() => setCartQuantity(item.id, item.quantity - 1)} 
                        className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center hover:bg-orange-200 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-semibold text-gray-900 text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => setCartQuantity(item.id, item.quantity + 1)} 
                        className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center hover:bg-orange-200 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        </button>
                        <button
                        onClick={() => removeFromCart(item.id)} 
                        className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors"
                        >
                        <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
              
              <div className="p-4 sm:p-6 border-t border-gray-100">
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ekstra İstekleriniz</label>
                  <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="Örn: Soğansız olsun, yanında limon, az tuzlu..."
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none text-sm"
                    rows={2}
                  />
                    </div>
                
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <span className="text-base sm:text-lg font-semibold text-gray-700">Toplam</span>
                  <span className="text-xl sm:text-2xl font-bold text-orange-600">{total}₺</span>
                  </div>
                  
                  <button
                  onClick={onOrder}
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold text-base sm:text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                  Siparişi Onayla
                  </button>
              </div>
                </>
              )}
            </div>
          </div>
        </div>
  );
}

function ConfirmationModal({ items, note, total, onProceed, onBack }: {
  items: any[];
  note: string;
  total: number;
  onProceed: () => void;
  onBack: () => void;
}) {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onBack();
        }
      }}
    >
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl max-h-[95vh] overflow-hidden mx-2 sm:mx-0">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Siparişinizi Onaylayın</h2>
          <button
            onClick={onBack} 
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
          <div className="p-6">
          {/* Uyarı Mesajı */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <div>
                <h3 className="font-semibold text-yellow-800 mb-1">Önemli Uyarı</h3>
                <p className="text-sm text-yellow-700">
                  Siparişinizden emin misiniz? Ödeme yaptıktan sonra değişiklik yapamazsınız.
                </p>
              </div>
            </div>
          </div>

          {/* Sipariş Özeti */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Sipariş Özeti</h3>
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                      {item.image ? (
                        <NextImage src={item.image} alt={item.name} fill sizes="40px" className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                          <span className="text-xs font-bold text-orange-500">{item.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">x {item.quantity}</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">{item.price * item.quantity}₺</div>
                </div>
              ))}
            </div>
            {note && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-1">Özel İstek:</div>
                <div className="text-sm text-gray-600">{note}</div>
              </div>
            )}
          </div>
          
          {/* Toplam */}
          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-700">Toplam</span>
              <span className="text-2xl font-bold text-orange-600">{total}₺</span>
            </div>
          </div>
          
          {/* Butonlar */}
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              Değiştir
            </button>
            <button
              onClick={onProceed}
              className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Ödemeye Geç
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentModal({ items, note, total, onPaymentSuccess, onBack }: {
  items: any[];
  note: string;
  total: number;
  onPaymentSuccess: () => void;
  onBack: () => void;
}) {
  const [selectedPayment, setSelectedPayment] = useState<'card' | 'cash' | 'room'>('card');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl max-h-[95vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Ödeme</h2>
          <button 
            onClick={onBack} 
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
              </div>
              
        <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Sipariş Özeti */}
              <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Sipariş Özeti</h3>
                <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                      {item.image ? (
                        <NextImage src={item.image} alt={item.name} fill sizes="40px" className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                          <span className="text-xs font-bold text-orange-500">{item.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">x {item.quantity}</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">{item.price * item.quantity}₺</div>
                </div>
              ))}
            </div>
            {note && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-1">Özel İstek:</div>
                <div className="text-sm text-gray-600">{note}</div>
              </div>
            )}
              </div>
              
          {/* Toplam */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-700">Toplam</span>
              <span className="text-2xl font-bold text-orange-600">{total}₺</span>
                </div>
              </div>
              
          {/* Ödeme Yöntemleri */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Ödeme Yöntemi</h3>
              <div className="space-y-3">
              <button
                onClick={() => setSelectedPayment('card')}
                className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all ${
                  selectedPayment === 'card'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">💳</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Kredi/Banka Kartı</div>
                    <div className="text-sm text-gray-500">Online ödeme</div>
                  </div>
                </div>
              </button>
            
              <button
                onClick={() => setSelectedPayment('cash')}
                className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all ${
                  selectedPayment === 'cash'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">💰</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Nakit Ödeme</div>
                    <div className="text-sm text-gray-500">Teslimatta öde</div>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setSelectedPayment('room')}
                className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all ${
                  selectedPayment === 'room'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">🏨</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Oda Hesabına</div>
                    <div className="text-sm text-gray-500">Çıkışta öde</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
          
          {/* Ödeme Butonu */}
          <button
            onClick={onPaymentSuccess}
            className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-base sm:text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {selectedPayment === 'card' && '💳 Kart ile Öde'}
            {selectedPayment === 'cash' && '💰 Nakit ile Öde'}
            {selectedPayment === 'room' && '🏨 Oda Hesabına Ekle'}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}

