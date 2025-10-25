'use client';

import { Home, ShoppingCart, User, Heart } from 'lucide-react';
import { useHotelStore } from '@/store/hotelStore';
import { translate } from '@/lib/translations';

interface BottomNavigationProps {
  activeTab: 'home' | 'cart' | 'waiter' | 'favorites';
  onTabChange: (tab: 'home' | 'cart' | 'waiter' | 'favorites') => void;
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const { currentLanguage, getCartItemCount } = useHotelStore();
  const cartItemCount = getCartItemCount();

  const tabs = [
    {
      id: 'home' as const,
      label: translate('menu', currentLanguage as any),
      icon: Home,
      color: 'text-orange-500'
    },
    {
      id: 'cart' as const,
      label: translate('cart', currentLanguage as any),
      icon: ShoppingCart,
      color: 'text-orange-500',
      badge: cartItemCount > 0 ? cartItemCount : undefined
    },
    {
      id: 'waiter' as const,
      label: 'Garson',
      icon: User,
      color: 'text-orange-500'
    },
    {
      id: 'favorites' as const,
      label: 'Favoriler',
      icon: Heart,
      color: 'text-orange-500'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2 px-4">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-orange-50 text-orange-600' 
                  : 'text-gray-500 hover:text-orange-500'
              }`}
            >
              <div className="relative">
                <IconComponent className={`w-6 h-6 ${isActive ? 'text-orange-600' : 'text-gray-500'}`} />
                {tab.badge && (
                  <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {tab.badge}
                  </div>
                )}
              </div>
              <span className={`text-xs font-medium mt-1 ${isActive ? 'text-orange-600' : 'text-gray-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
