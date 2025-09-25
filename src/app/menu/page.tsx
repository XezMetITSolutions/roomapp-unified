'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Heart, Plus, Star, Wheat, Egg, Milk, Nut, ChevronDown, ChevronRight, Sun, Leaf, Utensils, ChefHat, Cake, Coffee } from 'lucide-react';
import { useHotelStore } from '@/store/hotelStore';
import { translate } from '@/lib/translations';
import { MenuItem } from '@/types';
// import { menuCategories } from '@/lib/sampleData';
import BottomNavigation from '@/components/BottomNavigation';
import MenuUploadPanel from './MenuUploadPanel';

export default function MenuPage() {
  const { menu, currentLanguage, addToCart } = useHotelStore();
  const [activeCategory, setActiveCategory] = useState<string>('popular');
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'home' | 'cart' | 'favorites' | 'waiter'>('home');
  const [isLowData, setIsLowData] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'connection' in navigator) {
      // Tarayıcı bağlantı hızını algıla
      const connection = (navigator as any).connection;
      if (connection && (connection.saveData || connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g')) {
        setIsLowData(true);
      }
    }
  }, []);

  useEffect(() => {
    // Menü yüklendiğinde loading'i kapat
    if (menu && menu.length > 0) {
      setLoading(false);
    }
  }, [menu]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 250);
    return () => clearTimeout(t);
  }, [searchQuery]);

  function getCategoryIcon(iconName: string) {
    switch (iconName) {
      case 'heart': return Heart;
      case 'sun': return Sun;
      case 'leaf': return Leaf;
      case 'utensils': return Utensils;
      case 'chef-hat': return ChefHat;
      case 'cake': return Cake;
      case 'coffee': return Coffee;
      default: return Star;
    }
  }

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(menu.map(item => item.category)));
    return uniqueCategories.map(category => ({
      id: category,
      name: category,
      icon: getCategoryIcon(category),
      color: 'blue'
    }));
  }, [menu]);

  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      const matchesCategory = activeCategory === 'popular' ? item.isPopular : item.category === activeCategory;
      const matchesSubCategory = !activeSubCategory || item.category === activeSubCategory;
      const q = debouncedQuery.toLowerCase();
      const matchesSearch = !q || item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
      return matchesCategory && matchesSubCategory && matchesSearch && item.available;
    });
  }, [menu, activeCategory, activeSubCategory, debouncedQuery]);

  

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    setActiveSubCategory(null);
  };

  const handleSubCategoryClick = (subCategoryId: string) => {
    setActiveSubCategory(subCategoryId);
  };

  const getDietaryIcon = (type: string) => {
    switch (type) {
      case 'wheat': return <Wheat className="w-4 h-4" />;
      case 'egg': return <Egg className="w-4 h-4" />;
      case 'milk': return <Milk className="w-4 h-4" />;
      case 'nuts': return <Nut className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item, 1);
    // Kısa bildirim göster
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = 'Ürün sepete eklendi';
    document.body.appendChild(notification);
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 2000);
  };

  const handleRefreshMenu = async () => {
    try {
      const res = await fetch('/api/menu', { cache: 'no-store' });
      if (!res.ok) return;
      const json = await res.json();
      if (Array.isArray(json.menu)) {
        // Store ve cache güncelle
        useHotelStore.setState(state => ({ ...state, menu: json.menu }));
        if (typeof window !== 'undefined') {
          localStorage.setItem('menuCache', JSON.stringify(json.menu));
        }
        const n = document.createElement('div');
        n.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow z-50';
        n.textContent = 'Menü yenilendi';
        document.body.appendChild(n);
        setTimeout(() => document.body.removeChild(n), 1500);
      }
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Menü Dosyası Yükleme Paneli */}
      <MenuUploadPanel />
      {/* Header */}
      <div className="bg-orange-500 text-white p-3 sm:p-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">{translate('menu', currentLanguage)}</h1>
            <p className="text-orange-100 text-sm sm:text-base">Gerçek misafir beğenilerine göre</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleRefreshMenu} className="bg-white/10 hover:bg-white/20 text-white text-sm px-3 py-1.5 rounded-lg">
              Menüyü Yenile
            </button>
            <button className="p-1.5 sm:p-2">
              <Filter className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder={translate('search', currentLanguage)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Category Tabs - Horizontal */}
      <div className="bg-white px-2 sm:px-4 py-3 border-b border-gray-200">
        <div className="flex space-x-2 sm:space-x-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => {
            const IconComponent = getCategoryIcon(category.name);
            const isActive = activeCategory === category.id;
            const hasSubCategories = false;
            
            return (
              <div key={category.id} className="flex-shrink-0">
                <button
                  onClick={() => handleCategoryClick(category.id)}
                  className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-full whitespace-nowrap transition-all text-xs sm:text-sm ${
                    isActive
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <IconComponent className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="font-medium hidden xs:inline">{category.name}</span>
                  <span className="font-medium xs:hidden">{category.name.split(' ')[0]}</span>
                  {hasSubCategories && (
                    <ChevronDown className="w-2 h-2 sm:w-3 sm:h-3" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
        
      </div>

      {/* Menu Items */}
      <div className="p-2 sm:p-4 space-y-3 sm:space-y-4">
        {loading ? (
          // Skeleton ekranı
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="bg-gray-200 animate-pulse rounded-xl sm:rounded-2xl h-24 sm:h-32 flex items-center px-4">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-300 rounded-xl mr-4" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/2" />
                <div className="h-3 bg-gray-300 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))
        ) : filteredMenu.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500 text-sm sm:text-base">Bu kategoride ürün bulunamadı</p>
          </div>
        ) : (
          filteredMenu.map((item) => (
            <div key={item.id} className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex">
                {/* Item Image */}
                <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gray-200 rounded-l-xl sm:rounded-l-2xl flex items-center justify-center relative overflow-hidden">
                  {!isLowData && item.image ? (
                    <picture>
                      <source srcSet={item.image.replace(/\.(jpg|jpeg|png)$/i, '.webp')} type="image/webp" />
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                      />
                    </picture>
                  ) : (
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-500 text-lg sm:text-2xl font-bold">
                        {item.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  {item.likes && !isLowData && (
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-white rounded-full p-1 shadow-sm">
                      <Heart className="w-2 h-2 sm:w-3 sm:h-3 text-red-500" />
                      <span className="text-xs text-gray-600 ml-0.5 sm:ml-1">{item.likes}</span>
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="flex-1 p-2 sm:p-4">
                  <div className="flex justify-between items-start mb-1 sm:mb-2">
                    <div className="flex-1 pr-2">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-lg leading-tight">{item.name}</h3>
                      {item.description && (
                        <p className="text-gray-600 text-xs sm:text-sm mt-1 line-clamp-2">{item.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-orange-500 font-bold text-sm sm:text-lg">₺{item.price.toFixed(2)}</div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center space-x-1 sm:space-x-2 mb-2 sm:mb-3">
                    {item.isNew && (
                      <span className="bg-red-500 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">YENİ</span>
                    )}
                    {item.isPopular && (
                      <span className="bg-yellow-500 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">⭐</span>
                    )}
                  </div>

                  {/* Dietary Info */}
                  {item.dietaryInfo && item.dietaryInfo.length > 0 && (
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-2 sm:mb-3">
                      {item.dietaryInfo.map((diet, index) => (
                        <div key={index} className="w-4 h-4 sm:w-6 sm:h-6 bg-gray-100 rounded-full flex items-center justify-center">
                          {getDietaryIcon(diet)}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-orange-500 text-white py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg sm:rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{translate('add_to_cart', currentLanguage)}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
