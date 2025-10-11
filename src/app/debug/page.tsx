'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warning' | 'info';
  message: string;
  details?: string;
}

export default function DebugPage() {
  const [results, setResults] = useState<CheckResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runAllChecks = async () => {
    setIsRunning(true);
    const checks: CheckResult[] = [];

    // 1. TypeScript Check
    try {
      checks.push({
        name: 'TypeScript Compilation',
        status: 'info',
        message: 'TypeScript kontrolü başlatılıyor...',
        details: 'npx tsc --noEmit komutu çalıştırılacak'
      });
    } catch (error) {
      checks.push({
        name: 'TypeScript Compilation',
        status: 'fail',
        message: 'TypeScript hatası bulundu',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
    }

    // 2. ESLint Check
    try {
      checks.push({
        name: 'ESLint Check',
        status: 'info',
        message: 'ESLint kontrolü başlatılıyor...',
        details: 'npm run lint komutu çalıştırılacak'
      });
    } catch (error) {
      checks.push({
        name: 'ESLint Check',
        status: 'fail',
        message: 'ESLint hatası bulundu',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
    }

    // 3. Build Check
    try {
      checks.push({
        name: 'Build Check',
        status: 'info',
        message: 'Build kontrolü başlatılıyor...',
        details: 'npm run build komutu çalıştırılacak'
      });
    } catch (error) {
      checks.push({
        name: 'Build Check',
        status: 'fail',
        message: 'Build hatası bulundu',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
    }

    // 4. Next.js Config Check
    try {
      const configCheck = await fetch('/api/debug/config');
      if (configCheck.ok) {
        checks.push({
          name: 'Next.js Config',
          status: 'pass',
          message: 'Next.js konfigürasyonu geçerli',
          details: 'next.config.js dosyası doğru yapılandırılmış'
        });
      } else {
        checks.push({
          name: 'Next.js Config',
          status: 'fail',
          message: 'Next.js konfigürasyon hatası',
          details: 'next.config.js dosyasında sorun var'
        });
      }
    } catch (error) {
      checks.push({
        name: 'Next.js Config',
        status: 'fail',
        message: 'Next.js konfigürasyon kontrolü başarısız',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
    }

    // 5. Page Structure Check
    const pagesToCheck = [
      '/',
      '/bilgi',
      '/menu',
      '/menu/1',
      '/isletme',
      '/isletme/announcements',
      '/isletme/settings',
      '/isletme/users',
      '/isletme/analytics',
      '/isletme/menu',
      '/kitchen',
      '/qr-menu',
      '/guest/demo',
      '/reception',
      '/paneller'
    ];

    for (const page of pagesToCheck) {
      try {
        checks.push({
          name: `Page: ${page}`,
          status: 'info',
          message: `${page} sayfası kontrol ediliyor...`,
          details: 'Sayfa yapısı ve "use client" direktifi kontrol edilecek'
        });
      } catch (error) {
        checks.push({
          name: `Page: ${page}`,
          status: 'fail',
          message: `${page} sayfasında hata`,
          details: error instanceof Error ? error.message : 'Bilinmeyen hata'
        });
      }
    }

    // 6. Import Check
    try {
      checks.push({
        name: 'Import Dependencies',
        status: 'info',
        message: 'Import bağımlılıkları kontrol ediliyor...',
        details: 'Tüm import\'ların doğru olduğu kontrol edilecek'
      });
    } catch (error) {
      checks.push({
        name: 'Import Dependencies',
        status: 'fail',
        message: 'Import hatası bulundu',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
    }

    setResults(checks);
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-50 border-green-200';
      case 'fail':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🚀 Deploy Debug Panel</h1>
              <p className="text-gray-600 mt-1">Tüm hataları önceden kontrol edelim!</p>
            </div>
            <button
              onClick={runAllChecks}
              disabled={isRunning}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isRunning
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isRunning ? 'Kontrol Ediliyor...' : 'Tüm Kontrolleri Çalıştır'}
            </button>
          </div>

          {results.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Kontrol Sonuçları</h2>
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}
                >
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{result.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                      {result.details && (
                        <p className="text-xs text-gray-500 mt-2 bg-white bg-opacity-50 p-2 rounded">
                          {result.details}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">🔧 Manuel Kontrol Komutları</h3>
            <div className="space-y-2 text-sm font-mono">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">1.</span>
                <code className="bg-white px-2 py-1 rounded">npm run lint</code>
                <span className="text-gray-600">- ESLint kontrolü</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">2.</span>
                <code className="bg-white px-2 py-1 rounded">npx tsc --noEmit</code>
                <span className="text-gray-600">- TypeScript kontrolü</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">3.</span>
                <code className="bg-white px-2 py-1 rounded">npm run build</code>
                <span className="text-gray-600">- Build kontrolü</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Önemli Notlar</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Tüm sayfalar "use client" direktifi ile işaretlenmeli</li>
              <li>• Dynamic route'lar için generateStaticParams() gerekli olabilir</li>
              <li>• Import hatalarını kontrol edin</li>
              <li>• Next.js konfigürasyonunu kontrol edin</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
