"use client";

import { useState } from 'react';

export default function APITest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testText, setTestText] = useState('Merhaba dünya');
  const [targetLang, setTargetLang] = useState('en');

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      console.log('API test başlatılıyor...', { testText, targetLang });
      
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: testText,
          targetLang: targetLang,
          sourceLang: 'tr',
        }),
      });
      
      console.log('API response:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error Data:', errorData);
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }
      
      const data = await response.json();
      console.log('API Success Data:', data);
      setResult(data);
    } catch (err) {
      console.error('API Test Error:', err);
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  };

  const testDirectAPI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      console.log('Direct DeepL API test başlatılıyor...');
      
      const response = await fetch('https://api-free.deepl.com/v2/translate', {
        method: 'POST',
        headers: {
          'Authorization': 'DeepL-Auth-Key bf2e3c01-d17a-43dc-a2f9-31cfa6d7ef2a:fx',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'text': testText,
          'target_lang': targetLang,
          'source_lang': 'TR',
        }),
      });
      
      console.log('Direct API response:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Direct API Error Data:', errorData);
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }
      
      const data = await response.json();
      console.log('Direct API Success Data:', data);
      setResult(data);
    } catch (err) {
      console.error('Direct API Test Error:', err);
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🔧 DeepL API Test Sayfası</h1>
          <p className="text-lg text-gray-600">RoomXQR çeviri sistemi API testleri</p>
        </div>
        
        {/* Test Formu */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Parametreleri</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Metni:
              </label>
              <input
                type="text"
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Çevrilecek metin"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hedef Dil:
              </label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="en">🇺🇸 English</option>
                <option value="de">🇩🇪 Deutsch</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="es">🇪🇸 Español</option>
                <option value="it">🇮🇹 Italiano</option>
                <option value="ru">🇷🇺 Русский</option>
                <option value="ar">🇸🇦 العربية</option>
                <option value="zh">🇨🇳 中文</option>
              </select>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={testAPI}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Test Ediliyor...</span>
                </>
              ) : (
                <>
                  <span>🔗</span>
                  <span>Next.js API Test Et</span>
                </>
              )}
            </button>
            
            <button
              onClick={testDirectAPI}
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Test Ediliyor...</span>
                </>
              ) : (
                <>
                  <span>🌐</span>
                  <span>Direct DeepL API Test</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Sonuçlar */}
        {error && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-red-800 mb-4">❌ Hata:</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <pre className="text-red-700 text-sm whitespace-pre-wrap">{error}</pre>
            </div>
          </div>
        )}
        
        {result && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-green-800 mb-4">✅ Başarılı Sonuç:</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="space-y-3">
                <div>
                  <strong className="text-green-800">Çevrilen Metin:</strong>
                  <p className="text-green-700 text-lg font-medium">{result.translatedText || result.translations?.[0]?.text}</p>
                </div>
                <div>
                  <strong className="text-green-800">Tespit Edilen Dil:</strong>
                  <p className="text-green-700">{result.detectedLanguage || result.translations?.[0]?.detected_source_language}</p>
                </div>
                <div>
                  <strong className="text-green-800">Ham Veri:</strong>
                  <pre className="text-green-700 text-xs mt-2 bg-white p-2 rounded border overflow-auto max-h-40">{JSON.stringify(result, null, 2)}</pre>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* API Bilgileri */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">📋 API Bilgileri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
            <div>
              <strong>DeepL API Key:</strong>
              <p className="text-sm font-mono bg-white p-2 rounded mt-1">bf2e3c01-d17a-43dc-a2f9-31cfa6d7ef2a:fx</p>
            </div>
            <div>
              <strong>API Endpoint:</strong>
              <p className="text-sm font-mono bg-white p-2 rounded mt-1">https://api-free.deepl.com/v2/translate</p>
            </div>
            <div>
              <strong>Next.js API Route:</strong>
              <p className="text-sm font-mono bg-white p-2 rounded mt-1">/api/translate</p>
            </div>
            <div>
              <strong>Desteklenen Diller:</strong>
              <p className="text-sm bg-white p-2 rounded mt-1">TR, EN, DE, FR, ES, IT, RU, AR, ZH</p>
            </div>
          </div>
        </div>
        
        {/* Test Talimatları */}
        <div className="bg-yellow-50 rounded-lg p-6 mt-6">
          <h2 className="text-2xl font-bold text-yellow-900 mb-4">📝 Test Talimatları</h2>
          <div className="space-y-2 text-yellow-800">
            <p>1. <strong>Next.js API Test:</strong> Kendi API endpoint'imizi test eder</p>
            <p>2. <strong>Direct DeepL API Test:</strong> DeepL API'yi doğrudan test eder</p>
            <p>3. <strong>Hata Durumu:</strong> Eğer Next.js API çalışmıyorsa, Direct API'yi deneyin</p>
            <p>4. <strong>Console Log:</strong> Tarayıcı konsolunda (F12) detaylı logları görebilirsiniz</p>
            <p>5. <strong>API Limiti:</strong> DeepL Free API günde 500.000 karakter çeviri hakkı verir</p>
          </div>
        </div>
      </div>
    </div>
  );
}