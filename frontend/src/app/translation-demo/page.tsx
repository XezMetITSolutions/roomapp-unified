"use client";

import { useState } from 'react';
import { MenuTranslator } from '@/components/MenuTranslator';
import { RealtimeTranslator, SimpleTranslator } from '@/components/RealtimeTranslator';
import { useTranslation, SupportedLanguage, LANGUAGE_FLAGS, LANGUAGE_NAMES } from '@/hooks/useTranslation';

export default function TranslationDemo() {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('en');
  const [testText, setTestText] = useState('Merhaba, bu bir test metnidir.');
  
  const sampleMenuItems = [
    {
      id: '1',
      name: 'Margherita Pizza',
      description: 'Taze mozzarella, domates sosu ve fesleğen ile hazırlanan klasik İtalyan pizzası'
    },
    {
      id: '2', 
      name: 'Tavuk Şinitzel',
      description: 'Çıtır kaplamalı tavuk göğsü, patates kızartması ve salata ile servis edilir'
    },
    {
      id: '3',
      name: 'Çikolatalı Tiramisu',
      description: 'Kahve aromalı mascarpone kreması ve çikolata parçacıkları ile hazırlanan İtalyan tatlısı'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🌍 DeepL Çeviri Entegrasyonu Demo
          </h1>
          <p className="text-lg text-gray-600">
            RoomXQR menü çeviri sistemi test sayfası
          </p>
        </div>
        
        {/* Dil Seçimi */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dil Seçimi (9 Dil)</h2>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
            {(['tr', 'en', 'de', 'fr', 'es', 'it', 'ru', 'ar', 'zh'] as SupportedLanguage[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`px-3 py-2 rounded-lg border-2 transition-all text-sm ${
                  selectedLang === lang
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-center">
                  <div className="text-lg">{LANGUAGE_FLAGS[lang]}</div>
                  <div className="text-xs">{LANGUAGE_NAMES[lang]}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Gerçek Zamanlı Çeviri Testi */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Gerçek Zamanlı Çeviri</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Metni:
              </label>
              <textarea
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Çevrilecek metni buraya yazın..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Çeviri Sonucu ({LANGUAGE_FLAGS[selectedLang]} {LANGUAGE_NAMES[selectedLang]}):
              </label>
              <div className="p-4 bg-gray-50 rounded-lg border">
                <SimpleTranslator
                  text={testText}
                  targetLang={selectedLang}
                  className="text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Menü Çeviri Testi */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Menü Çeviri Testi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleMenuItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                <MenuTranslator
                  menuItem={item}
                  onTranslated={(translated) => {
                    console.log('Çeviri tamamlandı:', translated);
                  }}
                  className="text-sm"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* API Durumu */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">API Durumu</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">DeepL API: Aktif</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Çeviri Hook: Hazır</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Menü Entegrasyonu: Tamamlandı</span>
            </div>
          </div>
        </div>
        
        {/* Kullanım Talimatları */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">📋 Kullanım Talimatları</h2>
          <div className="space-y-3 text-blue-800">
            <p>1. <strong>Menü Yönetimi:</strong> İşletme panelinde "Çeviri" butonuna tıklayarak menü öğelerini çevirebilirsiniz.</p>
            <p>2. <strong>Gerçek Zamanlı:</strong> QR menü sayfasında dil değiştirdiğinizde menü öğeleri otomatik çevrilir.</p>
            <p>3. <strong>API Limiti:</strong> DeepL Free API günde 500.000 karakter çeviri hakkı verir.</p>
            <p>4. <strong>Desteklenen Diller:</strong> Türkçe, İngilizce, Almanca, Fransızca, İspanyolca, İtalyanca, Rusça, Arapça, Çince</p>
          </div>
        </div>
      </div>
    </div>
  );
}
