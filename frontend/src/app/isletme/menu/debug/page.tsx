"use client";

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface DebugResult {
  test: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  details?: any;
  timestamp: Date;
}

export default function MenuDebugPage() {
  const [results, setResults] = useState<DebugResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    setApiUrl(process.env.NEXT_PUBLIC_API_URL || 'https://roomxqr-backend.onrender.com');
  }, []);

  const addResult = (test: string, status: 'success' | 'error' | 'pending', message: string, details?: any) => {
    setResults(prev => [...prev, {
      test,
      status,
      message,
      details,
      timestamp: new Date()
    }]);
  };

  const testMenuLoad = async () => {
    addResult('Menü Yükleme', 'pending', 'Test başlatılıyor...');
    try {
      const response = await fetch('/api/menu');
      const data = await response.json();
      
      if (response.ok) {
        addResult('Menü Yükleme', 'success', `Başarılı: ${data.menu?.length || 0} ürün bulundu`, data);
      } else {
        addResult('Menü Yükleme', 'error', `Hata: ${data.error || 'Bilinmeyen hata'}`, data);
      }
    } catch (error: any) {
      addResult('Menü Yükleme', 'error', `Hata: ${error.message}`, error);
    }
  };

  const testMenuSave = async () => {
    addResult('Menü Kaydetme', 'pending', 'Test başlatılıyor...');
    try {
      const testItem = {
        name: `Test Ürün ${Date.now()}`,
        description: 'Debug test ürünü',
        price: 25.50,
        category: 'Test',
        image: '',
        allergens: [],
        calories: 100,
        preparationTime: 15,
        rating: 4.0,
        available: true
      };

      const response = await fetch('/api/menu/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: [testItem] }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        addResult('Menü Kaydetme', 'success', 'Başarılı: Ürün kaydedildi', data);
      } else {
        addResult('Menü Kaydetme', 'error', `Hata: ${data.error || 'Bilinmeyen hata'}`, data);
      }
    } catch (error: any) {
      addResult('Menü Kaydetme', 'error', `Hata: ${error.message}`, error);
    }
  };

  const testMenuDelete = async () => {
    addResult('Menü Silme', 'pending', 'Test başlatılıyor...');
    try {
      // Önce menüyü yükle
      const menuResponse = await fetch('/api/menu');
      const menuData = await menuResponse.json();
      
      if (!menuResponse.ok || !menuData.menu || menuData.menu.length === 0) {
        addResult('Menü Silme', 'error', 'Silinecek ürün bulunamadı (menü boş)');
        return;
      }

      const firstItem = menuData.menu[0];
      
      // Silme işlemi - kalan tüm ürünleri kaydet
      const remainingItems = menuData.menu.slice(1).map((item: any) => ({
        name: item.name,
        description: item.description || '',
        price: item.price,
        category: item.category || 'Diğer',
        image: item.image || '',
        allergens: item.allergens || [],
        calories: item.calories,
        preparationTime: item.preparationTime,
        rating: item.rating || 4,
        available: item.available !== false,
      }));

      const response = await fetch('/api/menu/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: remainingItems }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        addResult('Menü Silme', 'success', `Başarılı: "${firstItem.name}" silindi, ${remainingItems.length} ürün kaldı`, data);
      } else {
        addResult('Menü Silme', 'error', `Hata: ${data.error || 'Bilinmeyen hata'}`, data);
      }
    } catch (error: any) {
      addResult('Menü Silme', 'error', `Hata: ${error.message}`, error);
    }
  };

  const testBackendConnection = async () => {
    addResult('Backend Bağlantısı', 'pending', 'Test başlatılıyor...');
    try {
      const response = await fetch(`${apiUrl}/health`);
      const data = await response.json();
      
      if (response.ok) {
        addResult('Backend Bağlantısı', 'success', 'Backend erişilebilir', data);
      } else {
        addResult('Backend Bağlantısı', 'error', `Backend yanıt vermiyor: ${response.status}`, data);
      }
    } catch (error: any) {
      addResult('Backend Bağlantısı', 'error', `Backend'e ulaşılamıyor: ${error.message}`, error);
    }
  };

  const testBackendMenuSave = async () => {
    addResult('Backend Menü Kaydetme', 'pending', 'Test başlatılıyor...');
    try {
      // Tenant bilgisini subdomain'den al
      let tenantSlug = 'demo';
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        const subdomain = hostname.split('.')[0];
        if (subdomain && subdomain !== 'www' && subdomain !== 'roomxqr' && subdomain !== 'roomxqr-backend' && subdomain !== 'localhost') {
          tenantSlug = subdomain;
        }
      }

      const testItem = {
        name: `Backend Test ${Date.now()}`,
        description: 'Backend debug test',
        price: 30.00,
        category: 'Test',
        image: '',
        allergens: [],
        calories: 150,
        preparationTime: 20,
        rating: 4.5,
        available: true
      };

      const response = await fetch(`${apiUrl}/api/menu/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant': tenantSlug,
        },
        body: JSON.stringify({ items: [testItem] }),
      });

      const data = await response.json();
      
      if (response.ok) {
        addResult('Backend Menü Kaydetme', 'success', 'Backend kaydetme başarılı', data);
      } else {
        addResult('Backend Menü Kaydetme', 'error', `Backend hatası: ${data.error || response.status}`, data);
      }
    } catch (error: any) {
      addResult('Backend Menü Kaydetme', 'error', `Backend hatası: ${error.message}`, error);
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setResults([]);
    
    await testBackendConnection();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testMenuLoad();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testBackendMenuSave();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testMenuSave();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testMenuDelete();
    
    setLoading(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Menü İşlemleri Debug Sayfası</h1>
        <p className="text-gray-600">Silme, düzenleme ve kaydetme işlemlerini test edin</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Backend URL:</strong> {apiUrl || 'Yükleniyor...'}
        </p>
        <p className="text-sm text-blue-800 mt-2">
          <strong>NEXT_PUBLIC_API_URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'Tanımlı değil'}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={runAllTests}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Tüm Testleri Çalıştır</span>
        </button>
        
        <button
          onClick={testBackendConnection}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Backend Bağlantısı
        </button>
        
        <button
          onClick={testMenuLoad}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Menü Yükleme
        </button>
        
        <button
          onClick={testMenuSave}
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
        >
          Menü Kaydetme
        </button>
        
        <button
          onClick={testBackendMenuSave}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
        >
          Backend Menü Kaydetme
        </button>
        
        <button
          onClick={testMenuDelete}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Menü Silme
        </button>
        
        <button
          onClick={clearResults}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          Sonuçları Temizle
        </button>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Test Sonuçları</h2>
        
        {results.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Henüz test çalıştırılmadı. Yukarıdaki butonlardan birini tıklayın.
          </div>
        )}

        {results.map((result, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 ${
              result.status === 'success'
                ? 'bg-green-50 border-green-200'
                : result.status === 'error'
                ? 'bg-red-50 border-red-200'
                : 'bg-yellow-50 border-yellow-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                {result.status === 'success' && (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                )}
                {result.status === 'error' && (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                {result.status === 'pending' && (
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                )}
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{result.test}</h3>
                  <p className="text-sm text-gray-700 mt-1">{result.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {result.timestamp.toLocaleTimeString()}
                  </p>
                  
                  {result.details && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">
                        Detayları göster
                      </summary>
                      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

