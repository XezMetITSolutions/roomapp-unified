import { useEffect, useState } from 'react';
import { useTranslation, SupportedLanguage } from '@/hooks/useTranslation';

interface RealtimeTranslatorProps {
  text: string;
  targetLang: SupportedLanguage;
  sourceLang?: SupportedLanguage;
  children?: (translatedText: string, loading: boolean, error: string | null) => React.ReactNode;
  className?: string;
}

export function RealtimeTranslator({ 
  text, 
  targetLang, 
  sourceLang, 
  children, 
  className = '' 
}: RealtimeTranslatorProps) {
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { translate } = useTranslation();
  
  useEffect(() => {
    const translateText = async () => {
      if (!text.trim()) {
        setTranslatedText('');
        return;
      }
      
      // Eğer hedef dil Türkçe ise çeviri yapma
      if (targetLang === 'tr') {
        setTranslatedText(text);
        setError(null);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await translate(text, targetLang, sourceLang);
        if (result) {
          setTranslatedText(result.translatedText);
        } else {
          setError('Çeviri başarısız');
          setTranslatedText(text); // Fallback olarak orijinal metni göster
        }
      } catch (err) {
        setError('Çeviri hatası');
        setTranslatedText(text); // Fallback olarak orijinal metni göster
      } finally {
        setIsLoading(false);
      }
    };
    
    // Debounce için timeout
    const timeoutId = setTimeout(translateText, 300);
    
    return () => clearTimeout(timeoutId);
  }, [text, targetLang, sourceLang, translate]);
  
  return (
    <div className={className}>
      {children ? children(translatedText, isLoading, error) : translatedText}
    </div>
  );
}

// Basit çeviri komponenti
interface SimpleTranslatorProps {
  text: string;
  targetLang: SupportedLanguage;
  sourceLang?: SupportedLanguage;
  className?: string;
  showLoading?: boolean;
}

export function SimpleTranslator({ 
  text, 
  targetLang, 
  sourceLang, 
  className = '',
  showLoading = true 
}: SimpleTranslatorProps) {
  return (
    <RealtimeTranslator 
      text={text} 
      targetLang={targetLang} 
      sourceLang={sourceLang}
      className={className}
    >
      {(translatedText, loading, error) => (
        <span className={className}>
          {loading && showLoading && (
            <span className="inline-block w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin mr-1"></span>
          )}
          {error && (
            <span className="text-red-500 text-xs" title={error}>⚠️</span>
          )}
          {translatedText}
        </span>
      )}
    </RealtimeTranslator>
  );
}

// Menü öğesi çeviri komponenti
interface MenuItemTranslatorProps {
  name: string;
  description: string;
  targetLang: SupportedLanguage;
  sourceLang?: SupportedLanguage;
  className?: string;
}

export function MenuItemTranslator({ 
  name, 
  description, 
  targetLang, 
  sourceLang,
  className = '' 
}: MenuItemTranslatorProps) {
  return (
    <div className={className}>
      <RealtimeTranslator 
        text={name} 
        targetLang={targetLang} 
        sourceLang={sourceLang}
      >
        {(translatedName, loading, error) => (
          <div>
            <h3 className="font-semibold text-gray-900">
              {loading && <span className="inline-block w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin mr-1"></span>}
              {error && <span className="text-red-500 text-xs mr-1" title={error}>⚠️</span>}
              {translatedName}
            </h3>
          </div>
        )}
      </RealtimeTranslator>
      
      <RealtimeTranslator 
        text={description} 
        targetLang={targetLang} 
        sourceLang={sourceLang}
      >
        {(translatedDesc, loading, error) => (
          <p className="text-gray-600 text-sm mt-1">
            {loading && <span className="inline-block w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin mr-1"></span>}
            {error && <span className="text-red-500 text-xs mr-1" title={error}>⚠️</span>}
            {translatedDesc}
          </p>
        )}
      </RealtimeTranslator>
    </div>
  );
}
