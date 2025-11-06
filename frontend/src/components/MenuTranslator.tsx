import { useState } from 'react';
import { useTranslation, SupportedLanguage, LANGUAGE_FLAGS, LANGUAGE_NAMES } from '@/hooks/useTranslation';
import { translateText } from '@/lib/translateService';
import { Language } from '@/types';

interface MenuTranslatorProps {
  menuItem: {
    name: string;
    description: string;
  };
  onTranslated: (translated: { name: string; description: string }) => void;
  className?: string;
}

export function MenuTranslator({ menuItem, onTranslated, className = '' }: MenuTranslatorProps) {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('en');
  const [translatedName, setTranslatedName] = useState('');
  const [translatedDesc, setTranslatedDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleTranslate = async () => {
    setError(null);
    setLoading(true);
    
    try {
      // İsim çevirisi
      const translatedNameResult = await translateText(menuItem.name, selectedLang);
      setTranslatedName(translatedNameResult);
      
      // Açıklama çevirisi
      const translatedDescResult = await translateText(menuItem.description, selectedLang);
      setTranslatedDesc(translatedDescResult);
      
      // Her ikisi de başarılıysa callback'i çağır
      onTranslated({
        name: translatedNameResult,
        description: translatedDescResult,
      });
    } catch (err) {
      setError('Çeviri hatası: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveTranslation = () => {
    if (translatedName && translatedDesc) {
      onTranslated({
        name: translatedName,
        description: translatedDesc,
      });
    }
  };
  
  return (
    <div className={`space-y-4 p-4 border rounded-lg bg-white shadow-sm ${className}`}>
      <div className="flex items-center space-x-2">
        <span className="text-lg">🌍</span>
        <h3 className="font-semibold text-gray-900">Menü Çevirisi</h3>
      </div>
      
      {/* Dil Seçimi */}
      <div className="flex flex-wrap gap-2">
        <select 
          value={selectedLang} 
          onChange={(e) => setSelectedLang(e.target.value as SupportedLanguage)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="en">{LANGUAGE_FLAGS.en} English</option>
          <option value="de">{LANGUAGE_FLAGS.de} Deutsch</option>
          <option value="fr">{LANGUAGE_FLAGS.fr} Français</option>
          <option value="es">{LANGUAGE_FLAGS.es} Español</option>
          <option value="it">{LANGUAGE_FLAGS.it} Italiano</option>
          <option value="ru">{LANGUAGE_FLAGS.ru} Русский</option>
          <option value="ar">{LANGUAGE_FLAGS.ar} العربية</option>
          <option value="zh">{LANGUAGE_FLAGS.zh} 中文</option>
        </select>
        
        <button
          onClick={handleTranslate}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Çeviriliyor...</span>
            </>
          ) : (
            <>
              <span>🔄</span>
              <span>Çevir</span>
            </>
          )}
        </button>
      </div>
      
      {/* Hata Mesajı */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-red-500">⚠️</span>
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </div>
      )}
      
      {/* Çeviri Sonuçları */}
      {(translatedName || translatedDesc) && (
        <div className="space-y-3">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">
              {LANGUAGE_FLAGS[selectedLang]} {LANGUAGE_NAMES[selectedLang]} Çevirisi:
            </h4>
            
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-gray-600">İsim:</label>
                <p className="text-gray-900 font-medium">{translatedName}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Açıklama:</label>
                <p className="text-gray-700">{translatedDesc}</p>
              </div>
            </div>
            
            <button
              onClick={handleSaveTranslation}
              className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <span>💾</span>
              <span>Çeviriyi Kaydet</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Orijinal Metin */}
      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">Orijinal Metin:</h4>
        <div className="space-y-1">
          <p className="text-gray-900 font-medium">{menuItem.name}</p>
          <p className="text-gray-700 text-sm">{menuItem.description}</p>
        </div>
      </div>
    </div>
  );
}
