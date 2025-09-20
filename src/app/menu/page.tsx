'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Heart, Plus, Star, Wheat, Egg, Milk, Nut } from 'lucide-react';
import { useHotelStore } from '@/store/hotelStore';
import { translate } from '@/lib/translations';
import { MenuItem } from '@/types';
import BottomNavigation from '@/components/BottomNavigation';

export default function MenuPage() {
  const { menu, currentLanguage, addToCart } = useHotelStore();
  const [activeCategory, setActiveCategory] = useState<string>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'home' | 'cart' | 'waiter' | 'favorites'>('home');

  const categories = [
    { id: 'popular', name: translate('most_popular', currentLanguage), icon: Heart },
    { id: 'breakfast', name: translate('breakfasts', currentLanguage), icon: Star },
    { id: 'fit', name: translate('fit_breakfast', currentLanguage), icon: Star },
    { id: 'appetizer', name: translate('appetizers', currentLanguage), icon: Star },
    { id: 'main', name: translate('main_courses', currentLanguage), icon: Star },
    { id: 'dessert', name: translate('desserts', currentLanguage), icon: Star },
    { id: 'beverage', name: translate('beverages', currentLanguage), icon: Star }
  ];

  const filteredMenu = menu.filter(item => {
    const matchesCategory = activeCategory === 'popular' ? item.isPopular : item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && item.available;
  });

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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-orange-500 text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{translate('menu', currentLanguage)}</h1>
            <p className="text-orange-100">Gerçek misafir beğenilerine göre</p>
          </div>
          <button className="p-2">
            <Filter className="w-6 h-6" />
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={translate('search', currentLanguage)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex space-x-3 overflow-x-auto">
          {categories.map((category) => {
            const IconComponent = category.icon;
            const isActive = activeCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-4">
        {filteredMenu.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Bu kategoride ürün bulunamadı</p>
          </div>
        ) : (
          filteredMenu.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex">
                {/* Item Image */}
                <div className="w-24 h-24 bg-gray-200 rounded-l-2xl flex items-center justify-center relative">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-l-2xl"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-500 text-2xl font-bold">
                        {item.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  {item.likes && (
                    <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
                      <Heart className="w-3 h-3 text-red-500" />
                      <span className="text-xs text-gray-600 ml-1">{item.likes}</span>
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                      {item.description && (
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-orange-500 font-bold text-lg">₺{item.price.toFixed(2)}</div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center space-x-2 mb-3">
                    {item.isNew && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">YENİ</span>
                    )}
                    {item.isPopular && (
                      <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">⭐</span>
                    )}
                  </div>

                  {/* Dietary Info */}
                  {item.dietaryInfo && item.dietaryInfo.length > 0 && (
                    <div className="flex items-center space-x-2 mb-3">
                      {item.dietaryInfo.map((diet, index) => (
                        <div key={index} className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                          {getDietaryIcon(diet)}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-orange-500 text-white py-2 px-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
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
