"use client";

import { useState, useEffect } from 'react';
import { useThemeStore, generateGradientColors } from '@/store/themeStore';
import Image from 'next/image';
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
  theme: 'light' | 'dark';
  fontFamily: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  cardBackground: string;
  borderColor: string;
  gradientColors?: string[];
}

interface LanguageSettings {
  defaultLanguage: string;
  supportedLanguages: string[];
}


export default function SettingsPage() {
  const themeStore = useThemeStore();
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

  // Önceden tanımlanmış güzel renk kombinasyonları
  const predefinedColorSchemes = [
    // Otel Teması - Altın & Koyu Mavi
    {
      primary: '#D4AF37',
      secondary: '#1E3A8A',
      name: 'Lüks Otel'
    },
    // Modern Mavi & Beyaz
    {
      primary: '#2563EB',
      secondary: '#1E40AF',
      name: 'Modern Mavi'
    },
    // Doğal Yeşil & Kahverengi
    {
      primary: '#059669',
      secondary: '#92400E',
      name: 'Doğal'
    },
    // Sıcak Turuncu & Kırmızı
    {
      primary: '#EA580C',
      secondary: '#DC2626',
      name: 'Sıcak'
    },
    // Mor & Pembe
    {
      primary: '#7C3AED',
      secondary: '#DB2777',
      name: 'Romantik'
    },
    // Koyu & Açık Gri
    {
      primary: '#374151',
      secondary: '#6B7280',
      name: 'Minimalist'
    },
    // Deniz Mavisi & Turkuaz
    {
      primary: '#0891B2',
      secondary: '#0D9488',
      name: 'Okyanus'
    },
    // Kırmızı & Altın
    {
      primary: '#B91C1C',
      secondary: '#D97706',
      name: 'Klasik'
    },
    // Yeşil & Mavi
    {
      primary: '#16A34A',
      secondary: '#2563EB',
      name: 'Fresh'
    },
    // Mor & Altın
    {
      primary: '#7C2D12',
      secondary: '#CA8A04',
      name: 'Royal'
    },
    // Mor Lale
    {
      primary: '#8B5CF6',
      secondary: '#7C3AED',
      name: 'Mor Lale'
    },
    // Yeşil Çam
    {
      primary: '#059669',
      secondary: '#047857',
      name: 'Yeşil Çam'
    },
    // Turuncu Güneş
    {
      primary: '#EA580C',
      secondary: '#C2410C',
      name: 'Turuncu Güneş'
    },
    // Pembe Şeker
    {
      primary: '#F472B6',
      secondary: '#EC4899',
      name: 'Pembe Şeker'
    },
    // Mavi Gece
    {
      primary: '#1E40AF',
      secondary: '#1E3A8A',
      name: 'Mavi Gece'
    },
    // Kırmızı Şarap
    {
      primary: '#B91C1C',
      secondary: '#991B1B',
      name: 'Kırmızı Şarap'
    },
    // Yeşil Zümrüt
    {
      primary: '#047857',
      secondary: '#065F46',
      name: 'Yeşil Zümrüt'
    },
    // Mor Ametist
    {
      primary: '#7C3AED',
      secondary: '#6D28D9',
      name: 'Mor Ametist'
    },
    // Turkuaz Deniz
    {
      primary: '#06B6D4',
      secondary: '#0891B2',
      name: 'Turkuaz Deniz'
    },
    // Altın Lüks
    {
      primary: '#D4AF37',
      secondary: '#B8860B',
      name: 'Altın Lüks'
    },
    // Gümüş Modern
    {
      primary: '#6B7280',
      secondary: '#4B5563',
      name: 'Gümüş Modern'
    }
  ];

  // Gradient renkler oluşturma fonksiyonu
  const generateGradientColors = (primary: string, secondary: string) => {
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

    // Gradient renkler oluştur
    const gradientColors = [];
    const steps = 5;
    for (let i = 0; i < steps; i++) {
      const ratio = i / (steps - 1);
      const h = h1 + (h2 - h1) * ratio;
      const s = s1 + (s2 - s1) * ratio;
      const l = l1 + (l2 - l1) * ratio;
      gradientColors.push(hslToHex(h, s, l));
    }

    return gradientColors;
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
    primaryColor: themeStore.primaryColor,
    secondaryColor: themeStore.secondaryColor,
    theme: themeStore.mode,
    fontFamily: themeStore.fontFamily,
    accentColor: themeStore.accentColor,
    backgroundColor: themeStore.backgroundColor,
    textColor: themeStore.textColor,
    cardBackground: themeStore.cardBackground,
    borderColor: themeStore.borderColor,
    gradientColors: themeStore.gradientColors,
  });

  const [languageSettings, setLanguageSettings] = useState<LanguageSettings>({
    defaultLanguage: 'tr',
    supportedLanguages: ['tr', 'en', 'de', 'fr'],
  });

  const [showPaletteModal, setShowPaletteModal] = useState(false);


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
    const next = { ...themeSettings, [field]: value } as ThemeSettings;
    setThemeSettings(next);
    // eşzamanlı store uygulama
    themeStore.setTheme({
      [field]: value,
    } as any);
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
                          <Image src={hotelSettings.logo} alt="Logo" width={80} height={80} className="w-full h-full object-contain rounded-lg" />
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
                  
                  {/* Responsive Layout: Sol seçenekler, Sağ önizleme */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Sol Taraf - Seçenekler */}
                    <div className="space-y-6">

                      {/* Renk Seçimi */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                          <Palette className="w-4 h-4" />
                          <span>Marka Renkleri</span>
                        </h4>
                        
                        <div className="space-y-4">
                          {/* Hazır Kombinasyonlar */}
                          <div>
                            <button
                              onClick={() => setShowPaletteModal(true)}
                              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                            >
                              <Palette className="w-5 h-5" />
                              <span>🎨 Hazır Renk Kombinasyonları</span>
                              <Sparkles className="w-4 h-4" />
                            </button>
                            <p className="text-xs text-gray-500 mt-2 text-center">
                              20+ profesyonel renk paleti arasından seçin
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Ana Renk
                            </label>
                            <div className="flex items-center space-x-3">
                              <input
                                type="color"
                                value={themeSettings.primaryColor}
                                onChange={(e) => {
                                  console.log('Ana renk değiştirildi:', e.target.value);
                              const newPrimaryColor = e.target.value;
                              const newGradientColors = generateGradientColors(newPrimaryColor, themeSettings.secondaryColor);
                              const next = { ...themeSettings, primaryColor: newPrimaryColor, gradientColors: newGradientColors };
                              setThemeSettings(next);
                              themeStore.setTheme({ primaryColor: newPrimaryColor, gradientColors: newGradientColors });
                                }}
                                className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer hover:scale-105 transition-transform"
                              />
                              <input
                                type="text"
                                value={themeSettings.primaryColor}
                                onChange={(e) => {
                                  const newPrimaryColor = e.target.value;
                                  const newGradientColors = generateGradientColors(newPrimaryColor, themeSettings.secondaryColor);
                                  const next = { ...themeSettings, primaryColor: newPrimaryColor, gradientColors: newGradientColors };
                                  setThemeSettings(next);
                                  themeStore.setTheme({ primaryColor: newPrimaryColor, gradientColors: newGradientColors });
                                }}
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
                                onChange={(e) => {
                                  console.log('İkincil renk değiştirildi:', e.target.value);
                                  const newSecondaryColor = e.target.value;
                                  const newGradientColors = generateGradientColors(themeSettings.primaryColor, newSecondaryColor);
                                  const next = { ...themeSettings, secondaryColor: newSecondaryColor, gradientColors: newGradientColors };
                                  setThemeSettings(next);
                                  themeStore.setTheme({ secondaryColor: newSecondaryColor, gradientColors: newGradientColors });
                                }}
                                className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer hover:scale-105 transition-transform"
                              />
                              <input
                                type="text"
                                value={themeSettings.secondaryColor}
                                onChange={(e) => {
                                  const newSecondaryColor = e.target.value;
                                  const newGradientColors = generateGradientColors(themeSettings.primaryColor, newSecondaryColor);
                                  const next = { ...themeSettings, secondaryColor: newSecondaryColor, gradientColors: newGradientColors };
                                  setThemeSettings(next);
                                  themeStore.setTheme({ secondaryColor: newSecondaryColor, gradientColors: newGradientColors });
                                }}
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
                            onChange={(e) => {
                              console.log('Font değiştirildi:', e.target.value);
                              setThemeSettings({...themeSettings, fontFamily: e.target.value});
                              themeStore.setTheme({ fontFamily: e.target.value });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-colors"
                            style={{ fontFamily: themeSettings.fontFamily }}
                          >
                            {fontOptions.map((font) => (
                              <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                                {font.label}
                              </option>
                            ))}
                          </select>
                        </div>

                      </div>

                      {/* Tema Modu */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                          <Monitor className="w-4 h-4" />
                          <span>Tema Modu</span>
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { value: 'light', label: 'Açık', icon: Sun, bg: 'bg-yellow-100', text: 'text-yellow-800' },
                            { value: 'dark', label: 'Koyu', icon: Moon, bg: 'bg-gray-800', text: 'text-white' }
                          ].map((mode) => {
                            const Icon = mode.icon;
                            return (
                              <button
                                key={mode.value}
                                onClick={() => {
                                  console.log('Tema modu değiştirildi:', mode.value);
                                  
                                  // Sadece tema modunu değiştir, renkleri mevcut değerlerle koru
                                  const next = {
                                    ...themeSettings,
                                    theme: mode.value as any,
                                    backgroundColor: mode.value === 'light' ? '#FFFFFF' : '#0F172A',
                                    textColor: mode.value === 'light' ? '#1F2937' : '#F9FAFB',
                                    cardBackground: mode.value === 'light' ? '#F9FAFB' : '#1E293B',
                                    borderColor: mode.value === 'light' ? '#E5E7EB' : '#334155'
                                  };
                                  setThemeSettings(next);
                                  themeStore.setTheme({
                                    mode: mode.value as any,
                                    backgroundColor: next.backgroundColor,
                                    textColor: next.textColor,
                                    cardBackground: next.cardBackground,
                                    borderColor: next.borderColor,
                                  });
                                }}
                                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                                  themeSettings.theme === mode.value 
                                    ? 'border-blue-500 bg-blue-50' 
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="flex flex-col items-center space-y-2">
                                  <div className={`p-2 rounded-full ${mode.bg}`}>
                                    <Icon className={`w-4 h-4 ${mode.text}`} />
                                  </div>
                                  <span className="text-xs font-medium text-gray-700">{mode.label}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Sağ Taraf - Canlı Önizleme */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                        <Smartphone className="w-4 h-4" />
                        <span>Canlı Önizleme</span>
                      </h4>
                      
                      {/* QR Menü Önizlemesi */}
                      <div className="flex justify-center">
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
                              style={{ 
                                background: themeSettings.gradientColors && themeSettings.gradientColors.length > 0 
                                  ? `linear-gradient(135deg, ${themeSettings.gradientColors[0]} 0%, ${themeSettings.gradientColors[themeSettings.gradientColors.length - 1]} 100%)`
                                  : themeSettings.primaryColor 
                              }}
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
                                  style={{ 
                                    background: themeSettings.gradientColors && themeSettings.gradientColors.length > 2 
                                      ? `linear-gradient(135deg, ${themeSettings.gradientColors[1]} 0%, ${themeSettings.gradientColors[2]} 100%)`
                                      : themeSettings.secondaryColor 
                                  }}
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
                                  style={{ 
                                    background: themeSettings.gradientColors && themeSettings.gradientColors.length > 3 
                                      ? `linear-gradient(135deg, ${themeSettings.gradientColors[2]} 0%, ${themeSettings.gradientColors[3]} 100%)`
                                      : themeSettings.accentColor 
                                  }}
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
                                  style={{ 
                                    background: themeSettings.gradientColors && themeSettings.gradientColors.length > 0 
                                      ? `linear-gradient(135deg, ${themeSettings.gradientColors[0]} 0%, ${themeSettings.gradientColors[1]} 100%)`
                                      : themeSettings.primaryColor 
                                  }}
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

                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Renk Kombinasyonları Modal */}
            {showPaletteModal && (
              <div 
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setShowPaletteModal(false);
                  }
                }}
              >
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-2xl w-full max-h-[80vh] overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-800">Hazır Renk Kartları</h4>
                    <button 
                      onClick={() => setShowPaletteModal(false)} 
                      className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm transition-colors"
                    >
                      ✕ Kapat
                    </button>
                  </div>
                  <div className="p-4 overflow-y-auto max-h-[60vh]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {predefinedColorSchemes.map((scheme) => (
                        <button
                          key={scheme.name}
                          onClick={() => {
                            const gradient = generateGradientColors(scheme.primary, scheme.secondary);
                            const backgroundColor = themeSettings.theme === 'light' ? '#FFFFFF' : '#0F172A';
                            const textColor = themeSettings.theme === 'light' ? '#1F2937' : '#F9FAFB';
                            const cardBackground = themeSettings.theme === 'light' ? '#F9FAFB' : '#1E293B';
                            const borderColor = themeSettings.theme === 'light' ? '#E5E7EB' : '#334155';
                            setThemeSettings(prev => ({
                              ...prev,
                              primaryColor: scheme.primary,
                              secondaryColor: scheme.secondary,
                              gradientColors: gradient,
                              backgroundColor,
                              textColor,
                              cardBackground,
                              borderColor,
                            }));
                            themeStore.setTheme({
                              primaryColor: scheme.primary,
                              secondaryColor: scheme.secondary,
                              gradientColors: gradient,
                              backgroundColor,
                              textColor,
                              cardBackground,
                              borderColor,
                            });
                            setShowPaletteModal(false);
                          }}
                          className="group rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all text-left"
                        >
                          <div className="h-20" style={{
                            background: `linear-gradient(135deg, ${scheme.primary} 0%, ${scheme.secondary} 100%)`
                          }} />
                          <div className="p-3">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">{scheme.name}</span>
                              <div className="flex -space-x-2">
                                <span className="inline-block w-5 h-5 rounded-full border border-white" style={{ backgroundColor: scheme.primary }} />
                                <span className="inline-block w-5 h-5 rounded-full border border-white" style={{ backgroundColor: scheme.secondary }} />
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
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
