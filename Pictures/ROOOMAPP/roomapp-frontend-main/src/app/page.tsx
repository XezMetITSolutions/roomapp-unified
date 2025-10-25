'use client';

import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [menuItems, setMenuItems] = useState<any[]>([]);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const health = await apiClient.healthCheck();
        setBackendStatus('connected');
        
        // Menü öğelerini yükle
        try {
          const menu = await apiClient.getMenuItems();
          setMenuItems(menu.menuItems || []);
        } catch (menuError) {
          console.log('Menü yüklenemedi:', menuError);
        }
      } catch (error) {
        console.error('Backend bağlantı hatası:', error);
        setBackendStatus('error');
      }
    };

    checkBackend();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
          RoomXQR - Otel Yönetim Sistemi
        </h1>
        
        {/* Backend Durumu */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Sistem Durumu</h2>
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              backendStatus === 'checking' ? 'bg-yellow-400' :
              backendStatus === 'connected' ? 'bg-green-400' : 'bg-red-400'
            }`}></div>
            <span className="text-gray-700">
              {backendStatus === 'checking' && 'Backend bağlantısı kontrol ediliyor...'}
              {backendStatus === 'connected' && 'Backend bağlantısı başarılı ✅'}
              {backendStatus === 'error' && 'Backend bağlantısı başarısız ❌'}
            </span>
          </div>
        </div>

        {/* Menü Önizleme */}
        {menuItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Mevcut Menü Öğeleri ({menuItems.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.slice(0, 6).map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-gray-600">₺{item.price}</p>
                </div>
              ))}
            </div>
            {menuItems.length > 6 && (
              <p className="text-gray-500 text-sm mt-4">
                +{menuItems.length - 6} daha fazla öğe...
              </p>
            )}
          </div>
        )}

        {/* Navigasyon */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/menu" className="px-6 py-4 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700 transition-colors">
            <div className="font-semibold">QR Menü</div>
            <div className="text-sm opacity-90">Müşteri Menüsü</div>
          </Link>
          
          <Link href="/isletme" className="px-6 py-4 bg-green-600 text-white rounded-lg text-center hover:bg-green-700 transition-colors">
            <div className="font-semibold">İşletme Paneli</div>
            <div className="text-sm opacity-90">Yönetim</div>
          </Link>
          
          <Link href="/reception" className="px-6 py-4 bg-purple-600 text-white rounded-lg text-center hover:bg-purple-700 transition-colors">
            <div className="font-semibold">Resepsiyon</div>
            <div className="text-sm opacity-90">Check-in/out</div>
          </Link>
          
          <Link href="/kitchen" className="px-6 py-4 bg-orange-600 text-white rounded-lg text-center hover:bg-orange-700 transition-colors">
            <div className="font-semibold">Mutfak</div>
            <div className="text-sm opacity-90">Siparişler</div>
          </Link>
        </div>

        {/* Demo Link */}
        <div className="text-center mt-8">
          <Link href="/guest/demo" className="text-blue-600 hover:text-blue-800 underline">
            Demo Sayfasını Görüntüle
          </Link>
        </div>
      </div>
    </div>
  );
}