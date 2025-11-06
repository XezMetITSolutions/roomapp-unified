"use client";

import { useState, useEffect } from 'react';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  data?: any;
  duration?: number;
}

export default function DebugPage() {
  // Environment variable'dan API URL'ini al, yoksa Render backend URL'ini kullan
  const defaultApiUrl = process.env.NEXT_PUBLIC_API_URL || 
    (typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
      ? 'https://roomapp-backend-1.onrender.com' 
      : 'http://localhost:3001');
  
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [apiBaseUrl, setApiBaseUrl] = useState(defaultApiUrl);
  const [tenantSlug, setTenantSlug] = useState('demo'); // Default tenant slug (seed'de oluşturulur)
  const [envVars, setEnvVars] = useState<Record<string, string>>({});

  useEffect(() => {
    // Çevre değişkenlerini al (sadece client-side'da erişilebilir olanlar)
    setEnvVars({
      'NEXT_PUBLIC_API_URL': process.env.NEXT_PUBLIC_API_URL || 'Not set',
      'NODE_ENV': process.env.NODE_ENV || 'Not set',
    });
    
    // API URL'ini environment variable'dan güncelle
    if (process.env.NEXT_PUBLIC_API_URL) {
      setApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);
    }
  }, []);

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, result]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const testBackendHealth = async (): Promise<TestResult> => {
    const startTime = Date.now();
    try {
      const requestUrl = `${apiBaseUrl}/health`;
      const requestHeaders = { 
        'Content-Type': 'application/json',
        'Origin': typeof window !== 'undefined' ? window.location.origin : 'unknown'
      };
      
      console.log('🔍 Backend Health Check başlatılıyor...');
      console.log('📍 Request URL:', requestUrl);
      console.log('📤 Request Headers:', requestHeaders);
      console.log('🌐 Origin:', typeof window !== 'undefined' ? window.location.origin : 'unknown');
      
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: requestHeaders,
        mode: 'cors',
        credentials: 'include',
      });
      const duration = Date.now() - startTime;
      
      console.log('📥 Response Status:', response.status, response.statusText);
      console.log('📥 Response Headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Backend Health Check başarılı:', data);
        return {
          name: 'Backend Health Check',
          status: 'success',
          message: `Backend çalışıyor (${duration}ms)`,
          data: {
            ...data,
            _debug: {
              requestUrl,
              requestHeaders,
              responseStatus: response.status,
              responseHeaders: Object.fromEntries(response.headers.entries()),
            }
          },
          duration,
        };
      } else {
        const errorText = await response.text().catch(() => '');
        console.log('❌ Backend Health Check hatası:', response.status, errorText);
        return {
          name: 'Backend Health Check',
          status: 'error',
          message: `Backend yanıt verdi ama hata: ${response.status} ${response.statusText}${errorText ? ` - ${errorText.substring(0, 100)}` : ''}`,
          data: { 
            status: response.status, 
            statusText: response.statusText, 
            error: errorText,
            _debug: {
              requestUrl,
              requestHeaders,
              responseHeaders: Object.fromEntries(response.headers.entries()),
            }
          },
          duration,
        };
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      const isCorsError = errorMessage.includes('CORS') || errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError');
      
      console.error('❌ Backend Health Check exception:', error);
      console.error('🔍 Error details:', {
        message: errorMessage,
        isCorsError,
        apiUrl: apiBaseUrl,
        origin: typeof window !== 'undefined' ? window.location.origin : 'unknown',
      });
      
      return {
        name: 'Backend Health Check',
        status: 'error',
        message: isCorsError 
          ? `CORS hatası: Backend CORS ayarlarını kontrol edin. Origin: ${typeof window !== 'undefined' ? window.location.origin : 'unknown'}`
          : `Backend'e bağlanılamadı: ${errorMessage}`,
        data: { 
          error: errorMessage,
          errorType: error instanceof Error ? error.constructor.name : typeof error,
          isCorsError,
          apiUrl: apiBaseUrl,
          origin: typeof window !== 'undefined' ? window.location.origin : 'unknown',
          possibleCauses: isCorsError ? [
            'Backend servisi Render.com\'da deploy edilmedi',
            'Backend CORS ayarları yanlış yapılandırılmış',
            'Backend servisi çalışmıyor',
            'Network bağlantı sorunu'
          ] : [
            'Backend servisi çalışmıyor',
            'Network bağlantı sorunu',
            'URL yanlış'
          ]
        },
        duration,
      };
    }
  };

  const testDatabaseConnection = async (): Promise<TestResult> => {
    const startTime = Date.now();
    try {
      const response = await fetch(`${apiBaseUrl}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const duration = Date.now() - startTime;
      
      if (response.ok) {
        const data = await response.json();
        const dbStatus = data.database === 'Connected' ? 'success' : 'error';
        return {
          name: 'Veritabanı Bağlantısı',
          status: dbStatus,
          message: data.database === 'Connected' 
            ? `Veritabanı bağlı (${duration}ms)` 
            : `Veritabanı bağlı değil: ${data.error || 'Bilinmeyen hata'}`,
          data: {
            database: data.database,
            error: data.error,
          },
          duration,
        };
      } else {
        return {
          name: 'Veritabanı Bağlantısı',
          status: 'error',
          message: 'Health check başarısız',
          duration,
        };
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        name: 'Veritabanı Bağlantısı',
        status: 'error',
        message: `Bağlantı hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`,
        duration,
      };
    }
  };

  const testApiEndpoint = async (endpoint: string, method: string = 'GET', body?: any): Promise<TestResult> => {
    const startTime = Date.now();
    try {
      const headers: Record<string, string> = { 
        'Content-Type': 'application/json',
      };
      
      // x-tenant header'ını ekle (API endpoint'leri için gerekli)
      if (endpoint.startsWith('/api/') && tenantSlug) {
        headers['x-tenant'] = tenantSlug;
      }
      
      const options: RequestInit = {
        method,
        headers,
        mode: 'cors',
        credentials: 'include',
      };
      
      if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${apiBaseUrl}${endpoint}`, options);
      const duration = Date.now() - startTime;
      
      let responseData;
      try {
        responseData = await response.json();
      } catch {
        responseData = await response.text();
      }

      if (response.ok) {
        return {
          name: `${method} ${endpoint}`,
          status: 'success',
          message: `Başarılı (${response.status}) - ${duration}ms`,
          data: responseData,
          duration,
        };
      } else {
        return {
          name: `${method} ${endpoint}`,
          status: response.status === 404 ? 'warning' : 'error',
          message: `Hata: ${response.status} ${response.statusText}`,
          data: responseData,
          duration,
        };
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      const isCorsError = errorMessage.includes('CORS') || errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError');
      
      return {
        name: `${method} ${endpoint}`,
        status: 'error',
        message: isCorsError 
          ? `CORS hatası: Backend CORS ayarlarını kontrol edin`
          : `Bağlantı hatası: ${errorMessage}`,
        data: {
          error: errorMessage,
          endpoint: `${apiBaseUrl}${endpoint}`,
          origin: typeof window !== 'undefined' ? window.location.origin : 'unknown'
        },
        duration,
      };
    }
  };

  const testSocketIO = async (): Promise<TestResult> => {
    const startTime = Date.now();
    return new Promise((resolve) => {
      try {
        // Socket.IO bağlantısını test et
        const socketUrl = apiBaseUrl.replace('http://', 'ws://').replace('https://', 'wss://');
        const ws = new WebSocket(socketUrl);
        
        const timeout = setTimeout(() => {
          ws.close();
          resolve({
            name: 'Socket.IO Bağlantısı',
            status: 'warning',
            message: 'WebSocket bağlantısı zaman aşımına uğradı',
            duration: Date.now() - startTime,
          });
        }, 5000);

        ws.onopen = () => {
          clearTimeout(timeout);
          const duration = Date.now() - startTime;
          ws.close();
          resolve({
            name: 'Socket.IO Bağlantısı',
            status: 'success',
            message: `WebSocket bağlantısı başarılı (${duration}ms)`,
            duration,
          });
        };

        ws.onerror = (error) => {
          clearTimeout(timeout);
          const duration = Date.now() - startTime;
          resolve({
            name: 'Socket.IO Bağlantısı',
            status: 'error',
            message: `WebSocket bağlantı hatası`,
            duration,
          });
        };
      } catch (error) {
        resolve({
          name: 'Socket.IO Bağlantısı',
          status: 'error',
          message: `WebSocket test hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`,
          duration: Date.now() - startTime,
        });
      }
    });
  };

  const runAllTests = async () => {
    setIsRunning(true);
    clearResults();

    // Test 1: Backend Health
    addResult(await testBackendHealth());
    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 2: Database Connection
    addResult(await testDatabaseConnection());
    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 3: API Endpoints
    const endpoints = [
      { path: '/api/menu', method: 'GET' },
      { path: '/api/rooms', method: 'GET' },
      { path: '/api/guests', method: 'GET' },
      { path: '/api/requests', method: 'GET' },
    ];

    for (const endpoint of endpoints) {
      addResult(await testApiEndpoint(endpoint.path, endpoint.method));
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Test 4: Socket.IO
    addResult(await testSocketIO());

    setIsRunning(false);
  };

  const runSingleTest = async (testName: string) => {
    setIsRunning(true);
    
    switch (testName) {
      case 'health':
        addResult(await testBackendHealth());
        break;
      case 'database':
        addResult(await testDatabaseConnection());
        break;
      case 'socket':
        addResult(await testSocketIO());
        break;
    }
    
    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return '⏳';
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const warningCount = results.filter(r => r.status === 'warning').length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🔧 RoomApp Debug & Test Sayfası</h1>
          <p className="text-lg text-gray-600">Backend, Frontend ve Veritabanı bağlantı testleri</p>
        </div>

        {/* CORS Warning Banner */}
        {errorCount > 0 && results.some(r => r.data?.isCorsError) && (
          <div className="bg-red-100 border-2 border-red-500 rounded-lg p-6 mb-6">
            <div className="flex items-start space-x-4">
              <span className="text-4xl">🚨</span>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-red-900 mb-2">CORS Hatası Tespit Edildi!</h3>
                <p className="text-red-800 mb-4">
                  Backend servisi ile iletişim kurulamıyor. Bu genellikle şu nedenlerden biri olabilir:
                </p>
                <ul className="list-disc list-inside space-y-2 text-red-800 mb-4">
                  <li><strong>Backend Render.com'da deploy edilmedi</strong> (En olası neden)</li>
                  <li>Backend CORS ayarları yanlış yapılandırılmış</li>
                  <li>Backend servisi çalışmıyor</li>
                  <li>Network bağlantı sorunu</li>
                </ul>
                <div className="bg-red-200 rounded p-4 mb-4">
                  <p className="font-bold text-red-900 mb-2">✅ Çözüm Adımları:</p>
                  <ol className="list-decimal list-inside space-y-1 text-red-900">
                    <li>Render.com Dashboard'a gidin: <a href="https://dashboard.render.com" target="_blank" rel="noopener noreferrer" className="underline font-bold">https://dashboard.render.com</a></li>
                    <li>Backend servisini bulun (roomapp-backend)</li>
                    <li>"Manual Deploy" → "Deploy latest commit" tıklayın</li>
                    <li>3-5 dakika bekleyin</li>
                    <li>Bu sayfayı yenileyin ve testleri tekrar çalıştırın</li>
                  </ol>
                </div>
                <p className="text-sm text-red-700">
                  <strong>Not:</strong> Kod GitHub'da hazır (Commit: 5d4b6c1), sadece Render.com'da deploy edilmesi gerekiyor.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* API Base URL Input */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">⚙️ Ayarlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Backend API Base URL:
              </label>
              <input
                type="text"
                value={apiBaseUrl}
                onChange={(e) => setApiBaseUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
                  ? 'https://roomapp-backend-1.onrender.com' 
                  : 'http://localhost:3001'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tenant Slug (x-tenant header):
              </label>
              <input
                type="text"
                value={tenantSlug}
                onChange={(e) => setTenantSlug(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="default"
              />
              <p className="text-xs text-gray-500 mt-1">
                API endpoint'leri için gerekli. Varsayılan: "demo" (seed ile oluşturulur). Veritabanında mevcut bir tenant slug'ı girin.
              </p>
            </div>
          </div>
        </div>

        {/* Çevre Değişkenleri */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🌍 Çevre Değişkenleri</h2>
          <div className="space-y-2">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-mono text-sm text-gray-700">{key}:</span>
                <span className="font-mono text-sm text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Test Butonları */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🧪 Testler</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Testler Çalışıyor...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Tüm Testleri Çalıştır</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => runSingleTest('health')}
              disabled={isRunning}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Health Check
            </button>
            
            <button
              onClick={() => runSingleTest('database')}
              disabled={isRunning}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Veritabanı Testi
            </button>
            
            <button
              onClick={() => runSingleTest('socket')}
              disabled={isRunning}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Socket.IO Testi
            </button>
            
            <button
              onClick={clearResults}
              disabled={isRunning}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sonuçları Temizle
            </button>
          </div>
        </div>

        {/* İstatistikler */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 İstatistikler</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{successCount}</div>
                <div className="text-sm text-green-700">Başarılı</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-3xl font-bold text-red-600">{errorCount}</div>
                <div className="text-sm text-red-700">Hata</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">{warningCount}</div>
                <div className="text-sm text-yellow-700">Uyarı</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{results.length}</div>
                <div className="text-sm text-blue-700">Toplam</div>
              </div>
            </div>
          </div>
        )}

        {/* Test Sonuçları */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Test Sonuçları</h2>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`border-2 rounded-lg p-4 ${getStatusColor(result.status)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getStatusIcon(result.status)}</span>
                      <h3 className="text-lg font-bold">{result.name}</h3>
                    </div>
                    {result.duration && (
                      <span className="text-sm font-mono bg-white px-2 py-1 rounded">
                        {result.duration}ms
                      </span>
                    )}
                  </div>
                  <p className="mb-2">{result.message}</p>
                  {result.data && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm font-semibold hover:underline">
                        Detayları Göster
                      </summary>
                      <pre className="mt-2 p-3 bg-white rounded text-xs overflow-auto max-h-60">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bilgilendirme */}
        <div className="bg-blue-50 rounded-lg p-6 mt-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">ℹ️ Bilgilendirme</h2>
          <div className="space-y-2 text-blue-800">
            <p><strong>Backend Health Check:</strong> Backend sunucusunun çalışıp çalışmadığını kontrol eder.</p>
            <p><strong>Veritabanı Bağlantısı:</strong> PostgreSQL veritabanı bağlantısını test eder.</p>
            <p><strong>API Endpoints:</strong> Tüm API endpoint'lerini test eder (Menu, Rooms, Guests, Requests).</p>
            <p><strong>Socket.IO:</strong> WebSocket bağlantısını test eder (gerçek zamanlı bildirimler için).</p>
            <p className="mt-4 text-sm">
              <strong>Not:</strong> Bazı endpoint'ler authentication gerektirebilir. Bu durumda 401 veya 403 hatası normaldir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

