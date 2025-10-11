"use client";

import { useState, useEffect } from 'react';
import { useSocialMediaStore } from '@/store/socialMediaStore';
import { 
  Save, 
  Upload, 
  Globe, 
  Palette, 
  Bell, 
  Shield,
  Hotel,
  Mail,
  Phone,
  MapPin,
  Globe as GlobeIcon,
  Sun,
  Moon,
  Monitor,
  Smartphone,
  Sparkles,
  Type
} from 'lucide-react';

interface HotelSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
  description: string;
  socialMedia: {
    instagram: string;
    facebook: string;
    twitter: string;
    googleMaps: string;
  };
}

interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  theme: 'light' | 'dark' | 'system';
  fontFamily: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  cardBackground: string;
  borderColor: string;
}

interface LanguageSettings {
  defaultLanguage: string;
  supportedLanguages: string[];
}


export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'hotel' | 'theme' | 'language' | 'social'>('hotel');
  const { links, setLinks } = useSocialMediaStore();

  // URL parametresinden tab'ı belirle
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab === 'social') {
      setActiveTab('social');
    }
  }, []);
  const [isSaving, setIsSaving] = useState(false);

  // Sayfa yüklendiğinde kaydedilen ayarları yükle
  useEffect(() => {
    const savedSettings = localStorage.getItem('hotel-settings');
    if (savedSettings) {
      try {
        const settingsData = JSON.parse(savedSettings);
        if (settingsData.hotel) setHotelSettings(settingsData.hotel);
        if (settingsData.theme) setThemeSettings(settingsData.theme);
        if (settingsData.language) setLanguageSettings(settingsData.language);
        if (settingsData.socialMedia) {
          // Social media store'u güncelle
          useSocialMediaStore.getState().setLinks(settingsData.socialMedia);
        }
      } catch (error) {
        console.error('Kaydedilen ayarlar yüklenirken hata oluştu:', error);
      }
    }
  }, []);

  // Font seçenekleri
  const fontOptions = [
    { name: 'Inter', label: 'Inter (Modern)', value: 'Inter' },
    { name: 'Roboto', label: 'Roboto (Klasik)', value: 'Roboto' },
    { name: 'Poppins', label: 'Poppins (Yuvarlak)', value: 'Poppins' },
    { name: 'Open Sans', label: 'Open Sans (Temiz)', value: 'Open Sans' },
    { name: 'Montserrat', label: 'Montserrat (Şık)', value: 'Montserrat' },
    { name: 'Nunito', label: 'Nunito (Sıcak)', value: 'Nunito' },
  ];

  // Otomatik renk uyumu fonksiyonu
  const generateHarmoniousColors = (primary: string, secondary: string) => {
    // HSL dönüşümü
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;

      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      return [h * 360, s * 100, l * 100];
    };

    const hslToHex = (h: number, s: number, l: number) => {
      l /= 100;
      const a = s * Math.min(l, 1 - l) / 100;
      const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
      };
      return `#${f(0)}${f(8)}${f(4)}`;
    };

    const [h1, s1, l1] = hexToHsl(primary);
    const [h2, s2, l2] = hexToHsl(secondary);

    // Uyumlu renkler oluştur
    const accentHue = (h1 + h2) / 2;
    const accentColor = hslToHex(accentHue, Math.min(s1, s2) * 0.8, Math.min(l1, l2) * 0.9);
    
    const backgroundColor = l1 > 50 ? '#FFFFFF' : '#0F172A';
    const textColor = l1 > 50 ? '#1F2937' : '#F9FAFB';
    const cardBackground = l1 > 50 ? '#F9FAFB' : '#1E293B';
    const borderColor = l1 > 50 ? '#E5E7EB' : '#334155';

    return {
      accentColor,
      backgroundColor,
      textColor,
      cardBackground,
      borderColor
    };
  };

  const handleAutoColorGeneration = () => {
    const harmoniousColors = generateHarmoniousColors(themeSettings.primaryColor, themeSettings.secondaryColor);
    setThemeSettings(prev => ({
      ...prev,
      ...harmoniousColors
    }));
  };

  const [hotelSettings, setHotelSettings] = useState<HotelSettings>({
    name: 'Grand Hotel Istanbul',
    address: 'Sultanahmet Mah. Divanyolu Cad. No:123, Fatih/İstanbul',
    phone: '+90 212 555 0123',
    email: 'info@grandhotel.com',
    website: 'https://www.grandhotel.com',
    logo: '',
    description: 'İstanbul\'un kalbinde, tarihi yarımadada konumlanmış lüks otelimiz.',
    socialMedia: {
      instagram: 'https://www.instagram.com/grandhotelistanbul',
      facebook: 'https://www.facebook.com/grandhotelistanbul',
      twitter: 'https://www.twitter.com/grandhotelistanbul',
      googleMaps: 'https://www.google.com/maps/search/?api=1&query=Grand+Hotel+Istanbul'
    }
  });

  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    primaryColor: '#D4AF37',
    secondaryColor: '#1E3A8A',
    theme: 'light',
    fontFamily: 'Inter',
    accentColor: '#F59E0B',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    cardBackground: '#F9FAFB',
    borderColor: '#E5E7EB',
  });

  const [languageSettings, setLanguageSettings] = useState<LanguageSettings>({
    defaultLanguage: 'tr',
    supportedLanguages: ['tr', 'en', 'de', 'fr'],
  });


  const tabs = [
    { id: 'hotel', label: 'Otel Bilgileri', icon: Hotel },
    { id: 'social', label: 'Sosyal Medya', icon: GlobeIcon },
    { id: 'theme', label: 'Tema & Görünüm', icon: Palette },
    { id: 'language', label: 'Dil Ayarları', icon: Globe },
  ];

  const languages = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Gerçek kaydetme işlemi - localStorage'a kaydet
      const settingsData = {
        hotel: hotelSettings,
        theme: themeSettings,
        language: languageSettings,
        socialMedia: links,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem('hotel-settings', JSON.stringify(settingsData));
      
      // API call simulation
    await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Ayarlar başarıyla kaydedildi!');
    } catch (error) {
      console.error('Ayarlar kaydedilirken hata oluştu:', error);
      alert('Ayarlar kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
    setIsSaving(false);
    }
  };

  const handleHotelSettingsChange = (field: keyof HotelSettings, value: string) => {
    setHotelSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialMediaChange = (platform: keyof HotelSettings['socialMedia'], value: string) => {
    // Store'u güncelle
    setLinks({ [platform]: value });
    
    // Local state'i de güncelle
    setHotelSettings(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const handleThemeSettingsChange = (field: keyof ThemeSettings, value: string) => {
    setThemeSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleLanguageSettingsChange = (field: keyof LanguageSettings, value: any) => {
    setLanguageSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle logo upload logic here
      console.log('Logo uploaded:', file.name);
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setHotelSettings(prev => ({ ...prev, logo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ayarlar</h1>
            <p className="text-gray-600">Sistem ayarlarını yönetin</p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-hotel-gold text-white px-4 py-2 rounded-lg hover:bg-hotel-navy transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            <span>{isSaving ? 'Kaydediliyor...' : 'Kaydet'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-hotel-gold text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="hotel-card p-6">
            {/* Hotel Settings */}
            {activeTab === 'hotel' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Otel Bilgileri</h3>
                  
                  {/* Logo Upload */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                        {hotelSettings.logo ? (
                          <img src={hotelSettings.logo} alt="Logo" className="w-full h-full object-contain rounded-lg" />
                        ) : (
                          <Hotel className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-2"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Logo Yükle</span>
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG formatında, maksimum 2MB
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Otel Adı
                      </label>
                      <input
                        type="text"
                        value={hotelSettings.name}
                        onChange={(e) => handleHotelSettingsChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        value={hotelSettings.phone}
                        onChange={(e) => handleHotelSettingsChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-posta
                    </label>
                    <input
                      type="email"
                      value={hotelSettings.email}
                      onChange={(e) => handleHotelSettingsChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      value={hotelSettings.website}
                      onChange={(e) => handleHotelSettingsChange('website', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adres
                    </label>
                    <textarea
                      value={hotelSettings.address}
                      onChange={(e) => handleHotelSettingsChange('address', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Açıklama
                    </label>
                    <textarea
                      value={hotelSettings.description}
                      onChange={(e) => handleHotelSettingsChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Social Media Settings */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Sosyal Medya Linkleri</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Bu linkler QR menüdeki sosyal medya butonlarında kullanılacaktır.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Instagram
                      </label>
                      <input
                        type="url"
                        value={links.instagram}
                        onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                        placeholder="https://www.instagram.com/yourhotel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Facebook
                      </label>
                      <input
                        type="url"
                        value={links.facebook}
                        onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                        placeholder="https://www.facebook.com/yourhotel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Twitter
                      </label>
                      <input
                        type="url"
                        value={links.twitter}
                        onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                        placeholder="https://www.twitter.com/yourhotel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Google Maps
                      </label>
                      <input
                        type="url"
                        value={links.googleMaps}
                        onChange={(e) => handleSocialMediaChange('googleMaps', e.target.value)}
                        placeholder="https://www.google.com/maps/search/?api=1&query=Your+Hotel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Google yorumları için kullanılacak link
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Önizleme</h4>
                    <p className="text-xs text-blue-700 mb-3">
                      Bu linkler QR menüde şu şekilde görünecek:
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-pink-500 rounded"></div>
                        <span className="text-xs">Sosyal Medyadan Takip Edin</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span className="text-xs">Google'da Değerlendirin</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Theme Settings */}
            {activeTab === 'theme' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Tema & Görünüm</h3>
                  
                  {/* Otomatik Renk Uyumu Butonu */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-gray-900">Otomatik Renk Uyumu</span>
                      </div>
                      <button
                        onClick={handleAutoColorGeneration}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Otomatik Ayarla</span>
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">
                      Ana ve ikincil renklerinize uyumlu diğer tüm renkleri otomatik olarak ayarlar.
                    </p>
                  </div>

                  {/* Tema Modu Seçimi */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 flex items-center space-x-2 mb-4">
                      <Sun className="w-4 h-4" />
                      <span>Tema Modu</span>
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setThemeSettings({...themeSettings, theme: 'light'})}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                          themeSettings.theme === 'light' 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Sun className="w-6 h-6" />
                        <span className="text-sm font-medium">Açık</span>
                      </button>
                      <button
                        onClick={() => setThemeSettings({...themeSettings, theme: 'dark'})}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                          themeSettings.theme === 'dark' 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Moon className="w-6 h-6" />
                        <span className="text-sm font-medium">Koyu</span>
                      </button>
                          <button
                        onClick={() => setThemeSettings({...themeSettings, theme: 'system'})}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                          themeSettings.theme === 'system' 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Monitor className="w-6 h-6" />
                        <span className="text-sm font-medium">Sistem</span>
                          </button>
                    </div>
                  </div>

                  {/* Ana İçerik - Sol: Seçenekler, Sağ: Önizleme */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Sol Taraf - Seçenekler */}
                    <div className="space-y-6">
                      {/* Renk Seçimi */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                          <Palette className="w-4 h-4" />
                          <span>Marka Renkleri</span>
                        </h4>
                      
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ana Renk
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={themeSettings.primaryColor}
                          onChange={(e) => setThemeSettings({...themeSettings, primaryColor: e.target.value})}
                            className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={themeSettings.primaryColor}
                          onChange={(e) => setThemeSettings({...themeSettings, primaryColor: e.target.value})}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="#D4AF37"
                        />
                      </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        İkincil Renk
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={themeSettings.secondaryColor}
                          onChange={(e) => setThemeSettings({...themeSettings, secondaryColor: e.target.value})}
                            className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={themeSettings.secondaryColor}
                          onChange={(e) => setThemeSettings({...themeSettings, secondaryColor: e.target.value})}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="#1E3A8A"
                          />
                        </div>
                      </div>
                      </div>
                    </div>

                      {/* Yazı Tipi */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                          <Type className="w-4 h-4" />
                          <span>Yazı Tipi</span>
                        </h4>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Font Ailesi
                          </label>
                          <select
                            value={themeSettings.fontFamily}
                            onChange={(e) => setThemeSettings({...themeSettings, fontFamily: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            style={{ fontFamily: themeSettings.fontFamily }}
                          >
                            {fontOptions.map((font) => (
                              <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                                {font.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-2">Önizleme:</p>
                          <div className="space-y-1">
                            <p className="text-lg font-bold" style={{ fontFamily: themeSettings.fontFamily, color: themeSettings.primaryColor }}>
                              Başlık Örneği
                            </p>
                            <p className="text-sm" style={{ fontFamily: themeSettings.fontFamily, color: themeSettings.textColor }}>
                              Bu yazı tipi nasıl görünüyor?
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sağ Taraf - Canlı Önizleme */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                        <Smartphone className="w-4 h-4" />
                        <span>Canlı Önizleme</span>
                      </h4>
                    
                    <div className="flex flex-col xl:flex-row gap-6">
                      {/* QR Menü Önizlemesi */}
                      <div className="flex-1 flex justify-center">
                        <div className="relative mx-auto w-72 sm:w-80 h-[540px] sm:h-[600px] bg-black rounded-[2.5rem] p-2 shadow-2xl">
                          <div 
                            className="w-full h-full rounded-[2rem] overflow-hidden relative"
                            style={{ backgroundColor: themeSettings.backgroundColor }}
                          >
                            {/* Status Bar */}
                            <div className="h-8 flex items-center justify-between px-4 text-xs font-medium" style={{ color: themeSettings.textColor }}>
                              <span>9:41</span>
                              <div className="flex items-center space-x-1">
                                <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
                                <span>100%</span>
                              </div>
                            </div>

                            {/* Header */}
                            <div 
                              className="px-4 py-3 flex items-center justify-between"
                              style={{ backgroundColor: themeSettings.primaryColor }}
                            >
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                                <span className="text-white font-semibold text-sm" style={{ fontFamily: themeSettings.fontFamily }}>
                                  QR Menü
                                </span>
                              </div>
                              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: themeSettings.secondaryColor }}></div>
                              </div>
                            </div>

                            {/* Menu Categories */}
                            <div className="px-4 py-4 space-y-3">
                              <div 
                                className="px-3 py-2 rounded-lg flex items-center space-x-3"
                                style={{ backgroundColor: themeSettings.cardBackground, borderColor: themeSettings.borderColor, borderWidth: '1px' }}
                              >
                                <div 
                                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                                  style={{ backgroundColor: themeSettings.secondaryColor }}
                                >
                                  🍔
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-sm" style={{ color: themeSettings.textColor, fontFamily: themeSettings.fontFamily }}>
                                    Cheeseburger
                                  </p>
                                  <p className="text-xs opacity-70" style={{ color: themeSettings.textColor }}>
                                    Sulu dana köftesi, cheddar peyniri
                                  </p>
                                </div>
                                <span 
                                  className="font-bold text-sm"
                                  style={{ color: themeSettings.primaryColor }}
                                >
                                  210₺
                                </span>
                              </div>

                              <div 
                                className="px-3 py-2 rounded-lg flex items-center space-x-3"
                                style={{ backgroundColor: themeSettings.cardBackground, borderColor: themeSettings.borderColor, borderWidth: '1px' }}
                              >
                                <div 
                                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                                  style={{ backgroundColor: themeSettings.accentColor }}
                                >
                                  🍕
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-sm" style={{ color: themeSettings.textColor, fontFamily: themeSettings.fontFamily }}>
                                    Margherita Pizza
                                  </p>
                                  <p className="text-xs opacity-70" style={{ color: themeSettings.textColor }}>
                                    Mozzarella, domates sosu
                                  </p>
                                </div>
                                <span 
                                  className="font-bold text-sm"
                                  style={{ color: themeSettings.primaryColor }}
                                >
                                  185₺
                                </span>
                              </div>
                            </div>

                            {/* Bottom Navigation */}
                            <div 
                              className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-center justify-around"
                              style={{ backgroundColor: themeSettings.cardBackground, borderTopColor: themeSettings.borderColor, borderTopWidth: '1px' }}
                            >
                              <div className="flex flex-col items-center space-y-1">
                                <div 
                                  className="w-6 h-6 rounded-full flex items-center justify-center"
                                  style={{ backgroundColor: themeSettings.primaryColor }}
                                >
                                  <div className="w-3 h-3 bg-white rounded-full"></div>
                                </div>
                                <span className="text-xs font-medium" style={{ color: themeSettings.textColor, fontFamily: themeSettings.fontFamily }}>
                                  Menü
                                </span>
                              </div>
                              <div className="flex flex-col items-center space-y-1">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center opacity-50">
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: themeSettings.textColor }}></div>
                                </div>
                                <span className="text-xs opacity-50" style={{ color: themeSettings.textColor, fontFamily: themeSettings.fontFamily }}>
                                  Sepet
                                </span>
                              </div>
                              <div className="flex flex-col items-center space-y-1">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center opacity-50">
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: themeSettings.textColor }}></div>
                                </div>
                                <span className="text-xs opacity-50" style={{ color: themeSettings.textColor, fontFamily: themeSettings.fontFamily }}>
                                  Profil
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Renk Önizlemesi */}
                      <div className="flex-1 space-y-4">
                        <div className="space-y-3">
                          <h5 className="font-medium text-gray-900">Renk Paleti</h5>
                          
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <div className="space-y-2">
                              <div 
                                className="w-full h-16 rounded-lg flex items-center justify-center text-white font-semibold shadow-md"
                                style={{ backgroundColor: themeSettings.primaryColor }}
                              >
                                Ana Renk
                              </div>
                              <p className="text-xs text-gray-600 text-center">{themeSettings.primaryColor}</p>
                            </div>
                            
                            <div className="space-y-2">
                              <div 
                                className="w-full h-16 rounded-lg flex items-center justify-center text-white font-semibold shadow-md"
                                style={{ backgroundColor: themeSettings.secondaryColor }}
                              >
                                İkincil
                              </div>
                              <p className="text-xs text-gray-600 text-center">{themeSettings.secondaryColor}</p>
                            </div>
                            
                            <div className="space-y-2">
                              <div 
                                className="w-full h-16 rounded-lg flex items-center justify-center text-white font-semibold shadow-md"
                                style={{ backgroundColor: themeSettings.accentColor }}
                              >
                                Vurgu
                              </div>
                              <p className="text-xs text-gray-600 text-center">{themeSettings.accentColor}</p>
                            </div>
                            
                            <div className="space-y-2">
                              <div 
                                className="w-full h-16 rounded-lg flex items-center justify-center font-semibold shadow-md border-2"
                                style={{ 
                                  backgroundColor: themeSettings.cardBackground,
                                  color: themeSettings.textColor,
                                  borderColor: themeSettings.borderColor
                                }}
                              >
                                Kart
                              </div>
                              <p className="text-xs text-gray-600 text-center">Kart & Metin</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h5 className="font-medium text-gray-900">Tipografi Önizleme</h5>
                          <div 
                            className="p-4 rounded-lg border"
                            style={{ 
                              backgroundColor: themeSettings.cardBackground,
                              borderColor: themeSettings.borderColor,
                              fontFamily: themeSettings.fontFamily
                            }}
                          >
                            <h6 
                              className="text-lg font-bold mb-2"
                              style={{ color: themeSettings.primaryColor }}
                            >
                              Başlık Örneği
                            </h6>
                            <p 
                              className="text-sm mb-2"
                              style={{ color: themeSettings.textColor }}
                            >
                              Bu yazı tipi seçiminiz nasıl görünüyor? Metin okunabilirliği ve genel estetik açısından değerlendirin.
                            </p>
                            <button 
                              className="px-4 py-2 rounded-lg text-white font-medium text-sm"
                              style={{ backgroundColor: themeSettings.secondaryColor }}
                            >
                              Örnek Buton
                            </button>
                          </div>
                        </div>
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Language Settings */}
            {activeTab === 'language' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Dil Ayarları</h3>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Varsayılan Dil
                    </label>
                    <select
                      value={languageSettings.defaultLanguage}
                      onChange={(e) => setLanguageSettings({...languageSettings, defaultLanguage: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Desteklenen Diller
                    </label>
                    <div className="space-y-2">
                      {languages.map((lang) => (
                        <label key={lang.code} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={languageSettings.supportedLanguages.includes(lang.code)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setLanguageSettings({
                                  ...languageSettings,
                                  supportedLanguages: [...languageSettings.supportedLanguages, lang.code]
                                });
                              } else {
                                setLanguageSettings({
                                  ...languageSettings,
                                  supportedLanguages: languageSettings.supportedLanguages.filter(l => l !== lang.code)
                                });
                              }
                            }}
                            className="rounded border-gray-300 text-hotel-gold focus:ring-hotel-gold"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {lang.flag} {lang.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
