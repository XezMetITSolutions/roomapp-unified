"use client";

import React, { useEffect, useState } from 'react';

export default function TenantAdminUserDebug() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://roomxqr-backend.onrender.com';
  const [results, setResults] = useState<Array<{ name: string; ok: boolean; status?: number; data?: any; error?: string; warning?: boolean }>>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [tenantId, setTenantId] = useState('');

  const push = (r: { name: string; ok: boolean; status?: number; data?: any; error?: string; warning?: boolean }) => {
    setResults(prev => [...prev, r]);
  };

  const runTests = async () => {
    if (!tenantId) {
      alert('Lütfen bir Tenant ID girin');
      return;
    }

    setIsRunning(true);
    setResults([]);

    // 0) ENV bilgileri
    push({
      name: 'ENV & Config',
      ok: true,
      data: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || null,
        UsingAPIBase: API_BASE_URL,
        LocationOrigin: typeof window !== 'undefined' ? window.location.origin : 'n/a',
        TenantID: tenantId
      }
    });

    // 1) Token kontrolü
    const token = localStorage.getItem('admin_token');
    push({
      name: 'Token Kontrolü',
      ok: !!token,
      data: {
        hasToken: !!token,
        tokenLength: token ? token.length : 0,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'Yok'
      },
      warning: !token
    });

    if (!token) {
      push({
        name: '⚠️ UYARI',
        ok: false,
        error: 'Admin token bulunamadı. Lütfen önce giriş yapın.',
        warning: true
      });
      setIsRunning(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 300));

    // 2) Root endpoint testi
    try {
      const res = await fetch(`${API_BASE_URL}/`, { method: 'GET' });
      const data = await res.json().catch(() => ({}));
      push({ name: 'GET / (Root)', ok: res.ok, status: res.status, data });
    } catch (e: any) {
      push({ name: 'GET / (Root)', ok: false, error: e?.message || String(e) });
    }
    await new Promise(resolve => setTimeout(resolve, 300));

    // 3) Health check
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
      const data = await res.json().catch(() => ({}));
      const dbConnected = data.database === 'Connected';
      push({ 
        name: 'GET /health', 
        ok: res.ok && dbConnected, 
        status: res.status, 
        data,
        warning: res.ok && !dbConnected
      });
    } catch (e: any) {
      push({ name: 'GET /health', ok: false, error: e?.message || String(e) });
    }
    await new Promise(resolve => setTimeout(resolve, 300));

    // 4) Tenants listesi (auth kontrolü)
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/tenants`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-tenant': 'system-admin'
        }
      });
      const data = await res.json().catch(() => ({}));
      push({ 
        name: 'GET /api/admin/tenants (Auth Test)', 
        ok: res.ok, 
        status: res.status, 
        data: {
          ...data,
          tenantsCount: data.tenants ? data.tenants.length : 0
        }
      });
    } catch (e: any) {
      push({ name: 'GET /api/admin/tenants', ok: false, error: e?.message || String(e) });
    }
    await new Promise(resolve => setTimeout(resolve, 300));

    // 5) Tenant bilgisi (ID ile)
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/tenants/${tenantId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-tenant': 'system-admin'
        }
      });
      const data = await res.json().catch(() => ({}));
      push({ 
        name: `GET /api/admin/tenants/${tenantId}`, 
        ok: res.ok, 
        status: res.status, 
        data,
        warning: !res.ok
      });
    } catch (e: any) {
      push({ name: `GET /api/admin/tenants/${tenantId}`, ok: false, error: e?.message || String(e) });
    }
    await new Promise(resolve => setTimeout(resolve, 300));

    // 6) Admin User Endpoint Testi (ANA TEST)
    try {
      console.log('🔍 Testing admin user endpoint:', {
        url: `${API_BASE_URL}/api/admin/tenants/${tenantId}/admin-user`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-tenant': 'system-admin'
        }
      });

      const res = await fetch(`${API_BASE_URL}/api/admin/tenants/${tenantId}/admin-user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-tenant': 'system-admin'
        }
      });

      const data = await res.json().catch(() => ({}));
      
      push({ 
        name: `GET /api/admin/tenants/${tenantId}/admin-user (ANA TEST)`, 
        ok: res.ok, 
        status: res.status, 
        data: {
          ...data,
          responseHeaders: {
            'content-type': res.headers.get('content-type'),
            'content-length': res.headers.get('content-length')
          }
        },
        error: !res.ok ? (data.message || `HTTP ${res.status}`) : undefined
      });
    } catch (e: any) {
      push({ 
        name: `GET /api/admin/tenants/${tenantId}/admin-user`, 
        ok: false, 
        error: e?.message || String(e),
        data: {
          stack: e?.stack
        }
      });
    }
    await new Promise(resolve => setTimeout(resolve, 300));

    // 7) OPTIONS preflight testi
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/tenants/${tenantId}/admin-user`, {
        method: 'OPTIONS',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-tenant': 'system-admin',
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'authorization,content-type,x-tenant'
        }
      });
      const headers: any = {};
      res.headers.forEach((value, key) => {
        headers[key] = value;
      });
      push({ 
        name: 'OPTIONS /api/admin/tenants/:id/admin-user (Preflight)', 
        ok: res.ok, 
        status: res.status, 
        data: { headers }
      });
    } catch (e: any) {
      push({ name: 'OPTIONS Preflight', ok: false, error: e?.message || String(e) });
    }

    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              🔧 Admin User Endpoint Debug
            </h1>
            <p className="text-sm text-gray-600">
              Tenant admin user endpoint'ini test edin ve sorunları tespit edin
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tenant ID *
            </label>
            <input
              type="text"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              placeholder="Örn: cmhpzq8uw0000942bt8of6wyk"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Test etmek istediğiniz tenant'ın ID'sini girin
            </p>
          </div>

          <button
            onClick={runTests}
            disabled={isRunning || !tenantId}
            className="w-full mb-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isRunning ? '🔄 Testler Çalışıyor...' : '▶️ Testleri Başlat'}
          </button>

          {results.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Test Sonuçları</h2>
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.ok
                      ? 'bg-green-50 border-green-200'
                      : result.warning
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-medium ${
                      result.ok
                        ? 'text-green-900'
                        : result.warning
                        ? 'text-yellow-900'
                        : 'text-red-900'
                    }`}>
                      {result.ok ? '✅' : result.warning ? '⚠️' : '❌'} {result.name}
                    </h3>
                    {result.status && (
                      <span className={`text-xs px-2 py-1 rounded ${
                        result.status >= 200 && result.status < 300
                          ? 'bg-green-100 text-green-800'
                          : result.status >= 400 && result.status < 500
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        HTTP {result.status}
                      </span>
                    )}
                  </div>
                  
                  {result.error && (
                    <div className="mt-2 p-2 bg-red-100 rounded text-sm text-red-800">
                      <strong>Hata:</strong> {result.error}
                    </div>
                  )}
                  
                  {result.data && (
                    <details className="mt-2">
                      <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                        Detayları Göster
                      </summary>
                      <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-64">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">ℹ️ Bilgilendirme</h3>
            <ul className="text-xs text-blue-800 space-y-1">
              <li><strong>API_BASE_URL:</strong> {API_BASE_URL}</li>
              <li><strong>Bu sayfa:</strong> /system-admin/tenants/debug</li>
              <li><strong>Test Senaryoları:</strong></li>
              <li className="ml-4">• Token kontrolü: Admin token'ının varlığını kontrol eder</li>
              <li className="ml-4">• Root endpoint: Backend'in çalışıp çalışmadığını kontrol eder</li>
              <li className="ml-4">• Health check: Veritabanı bağlantısını kontrol eder</li>
              <li className="ml-4">• Tenants list: Auth middleware'in çalışıp çalışmadığını kontrol eder</li>
              <li className="ml-4">• Tenant bilgisi: Tenant ID'nin geçerli olup olmadığını kontrol eder</li>
              <li className="ml-4">• Admin User Endpoint: Ana test - admin user endpoint'ini test eder</li>
              <li className="ml-4">• OPTIONS Preflight: CORS preflight request'ini test eder</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

