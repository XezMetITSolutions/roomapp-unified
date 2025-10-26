import { useState } from 'react';

export type SupportedLanguage = 'tr' | 'en' | 'de' | 'fr' | 'es' | 'it' | 'ru' | 'ar' | 'zh';

interface TranslationResult {
  translatedText: string;
  detectedLanguage: string;
  success: boolean;
}

interface UseTranslationReturn {
  translate: (text: string, targetLang: SupportedLanguage, sourceLang?: SupportedLanguage) => Promise<TranslationResult | null>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useTranslation(): UseTranslationReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const translate = async (
    text: string, 
    targetLang: SupportedLanguage, 
    sourceLang?: SupportedLanguage
  ): Promise<TranslationResult | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Eğer hedef dil Türkçe ise çeviri yapma
      if (targetLang === 'tr') {
        return {
          translatedText: text,
          detectedLanguage: 'tr',
          success: true,
        };
      }
      
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          targetLang,
          sourceLang,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Çeviri başarısız');
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';
      setError(errorMessage);
      console.error('Translation error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const clearError = () => setError(null);
  
  return { translate, loading, error, clearError };
}

// Dil kodları mapping
export const LANGUAGE_CODES: Record<SupportedLanguage, string> = {
  'tr': 'TR',
  'en': 'EN',
  'de': 'DE', 
  'fr': 'FR',
  'es': 'ES',
  'it': 'IT',
  'ru': 'RU',
  'ar': 'AR',
  'zh': 'ZH',
};

// Dil isimleri
export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  'tr': 'Türkçe',
  'en': 'English',
  'de': 'Deutsch',
  'fr': 'Français',
  'es': 'Español',
  'it': 'Italiano',
  'ru': 'Русский',
  'ar': 'العربية',
  'zh': '中文',
};

// Dil bayrakları
export const LANGUAGE_FLAGS: Record<SupportedLanguage, string> = {
  'tr': '🇹🇷',
  'en': '🇺🇸',
  'de': '🇩🇪',
  'fr': '🇫🇷',
  'es': '🇪🇸',
  'it': '🇮🇹',
  'ru': '🇷🇺',
  'ar': '🇸🇦',
  'zh': '🇨🇳',
};
