"use client";

import React, { useEffect, useState } from 'react';

export default function LoginDebug() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://roomxqr-backend.onrender.com';
  const [results, setResults] = useState<Array<{ name: string; ok: boolean; status?: number; data?: any; error?: string; warning?: boolean }>>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantSlug, setTenantSlug] = useState('');

  const push = (r: { name: string; ok: boolean; status?: number; data?: any; error?: string; warning?: boolean }) => {
    setResults(prev => [...prev, r]);
  };

  const runTests = async () => {
    if (!email || !password || !tenantSlug) {
      alert('Lütfen email, şifre ve tenant slug girin');
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
        Email: email,
        Password: '***' + password.slice(-2),
        TenantSlug: tenantSlug
      }
    });

    await new Promise(resolve => setTimeout(resolve, 300));

    // 1) Root endpoint testi
    try {
      const res = await fetch(`${API_BASE_URL}/`, { method: 'GET' });
      const data = await res.json().catch(() => ({}));
      push({ name: 'GET / (Root)', ok: res.ok, status: res.status, data });
    } catch (e: any) {
      push({ name: 'GET / (Root)', ok: false, error: e?.message || String(e) });
    }
    await new Promise(resolve => setTimeout(resolve, 300));

    // 2) Health check
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

    // 3) Tenant kontrolü (admin token olmadan da çalışabilir)
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/tenants`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-tenant': 'system-admin',
            'Authorization': `Bearer ${adminToken}`
          }
        });
        const data = await res.json().catch(() => ({}));
        const tenant = data.tenants?.find((t: any) => t.slug === tenantSlug);
        const allTenants = data.tenants?.map((t: any) => ({ name: t.name, slug: t.slug, isActive: t.isActive })) || [];
        push({ 
          name: `Tenant Kontrolü (${tenantSlug})`, 
          ok: !!tenant, 
          status: res.status, 
          data: {
            tenantFound: !!tenant,
            tenant: tenant ? {
              id: tenant.id,
              name: tenant.name,
              slug: tenant.slug,
              isActive: tenant.isActive
            } : null,
            allTenants: allTenants,
            suggestion: !tenant ? `Bulunamadı. Mevcut tenant'lar: ${allTenants.map((t: any) => t.slug).join(', ')}` : null
          },
          warning: !tenant
        });
      } catch (e: any) {
        push({ name: 'Tenant Kontrolü', ok: false, error: e?.message || String(e) });
      }
    } else {
      push({
        name: `Tenant Kontrolü (${tenantSlug})`,
        ok: false,
        warning: true,
        data: {
          message: 'Admin token bulunamadı. Tenant kontrolü için admin token gerekli.',
          suggestion: 'Lütfen önce admin paneline giriş yapın veya tenant slug\'ını manuel olarak kontrol edin.'
        }
      });
    }
    await new Promise(resolve => setTimeout(resolve, 300));

    // 4) Email format kontrolü
    let loginEmail = email;
    if (!email.includes('@') && tenantSlug) {
      loginEmail = `${email}@${tenantSlug}.roomxqr.com`;
    }
    push({
      name: 'Email Format Kontrolü',
      ok: true,
      data: {
        originalEmail: email,
        convertedEmail: loginEmail,
        isConverted: email !== loginEmail
      }
    });
    await new Promise(resolve => setTimeout(resolve, 300));

    // 5) OPTIONS preflight testi
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'OPTIONS',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant': tenantSlug,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'content-type,x-tenant'
        }
      });
      const headers: any = {};
      res.headers.forEach((value, key) => {
        headers[key] = value;
      });
      push({ 
        name: 'OPTIONS /api/auth/login (Preflight)', 
        ok: res.ok, 
        status: res.status, 
        data: { headers }
      });
    } catch (e: any) {
      push({ name: 'OPTIONS Preflight', ok: false, error: e?.message || String(e) });
    }
    await new Promise(resolve => setTimeout(resolve, 300));

    // 6) Login testi (ANA TEST)
    try {
      console.log('🔍 Testing login:', {
        url: `${API_BASE_URL}/api/auth/login`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant': tenantSlug
        },
        body: {
          email: email,
          password: '***'
        }
      });

      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant': tenantSlug
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json().catch(() => ({}));
      
      push({ 
        name: `POST /api/auth/login (ANA TEST)`, 
        ok: res.ok, 
        status: res.status, 
        data: {
          ...data,
          responseHeaders: {
            'content-type': res.headers.get('content-type'),
            'content-length': res.headers.get('content-length')
          },
          usedEmail: loginEmail
        },
        error: !res.ok ? (data.message || `HTTP ${res.status}`) : undefined
      });
    } catch (e: any) {
      push({ 
        name: `POST /api/auth/login`, 
        ok: false, 
        error: e?.message || String(e),
        data: {
          stack: e?.stack
        }
      });
    }
    await new Promise(resolve => setTimeout(resolve, 300));

    // 7) Kullanıcı sorgusu (eğer admin token varsa)
    // adminToken zaten satır 70'te tanımlanmış, tekrar tanımlamaya gerek yok
    if (adminToken) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/tenants`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-tenant': 'system-admin',
            'Authorization': `Bearer ${adminToken}`
          }
        });
        const data = await res.json().catch(() => ({}));
        const tenant = data.tenants?.find((t: any) => t.slug === tenantSlug);
        
        if (tenant) {
          // Tenant'ın kullanıcılarını kontrol et
          try {
            const usersRes = await fetch(`${API_BASE_URL}/api/users`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'x-tenant': tenantSlug,
                'Authorization': `Bearer ${adminToken}`
              }
            });
            const usersData = await usersRes.json().catch(() => ({}));
            const matchingUser = usersData.users?.find((u: any) => 
              u.email === loginEmail || u.email === email
            );
            
            push({
              name: 'Kullanıcı Kontrolü',
              ok: !!matchingUser,
              status: usersRes.status,
              data: {
                userFound: !!matchingUser,
                user: matchingUser ? {
                  id: matchingUser.id,
                  email: matchingUser.email,
                  firstName: matchingUser.firstName,
                  lastName: matchingUser.lastName,
                  role: matchingUser.role,
                  isActive: matchingUser.isActive
                } : null,
                allUsers: usersData.users?.map((u: any) => ({
                  email: u.email,
                  role: u.role
                })) || []
              },
              warning: !matchingUser
            });
          } catch (e: any) {
            push({ name: 'Kullanıcı Kontrolü', ok: false, error: e?.message || String(e) });
          }
        }
      } catch (e: any) {
        push({ name: 'Kullanıcı Kontrolü', ok: false, error: e?.message || String(e) });
      }
    }

    setIsRunning(false);
  };

  // URL'den tenant slug'ını otomatik al
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const subdomain = hostname.split('.')[0];
      if (subdomain && subdomain !== 'www' && subdomain !== 'roomxqr') {
        setTenantSlug(subdomain);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              🔧 Login Debug Sayfası
            </h1>
            <p className="text-sm text-gray-600">
              Login sorunlarını tespit edin ve çözün
            </p>
          </div>

          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tenant Slug (Subdomain) *
              </label>
              <input
                type="text"
                value={tenantSlug}
                onChange={(e) => setTenantSlug(e.target.value)}
                placeholder="Örn: mete, feldkirch"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                URL'den otomatik algılanır (örn: feldkirch.roomxqr.com → feldkirch)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email veya Kullanıcı Adı *
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Örn: admin veya admin@mete.roomxqr.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Kullanıcı adı girerseniz otomatik olarak email formatına çevrilecektir
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şifre *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrenizi girin"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={runTests}
            disabled={isRunning || !email || !password || !tenantSlug}
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
              <li><strong>Bu sayfa:</strong> /login/debug</li>
              <li><strong>Test Senaryoları:</strong></li>
              <li className="ml-4">• Root endpoint: Backend'in çalışıp çalışmadığını kontrol eder</li>
              <li className="ml-4">• Health check: Veritabanı bağlantısını kontrol eder</li>
              <li className="ml-4">• Tenant kontrolü: Tenant'ın var olup olmadığını kontrol eder</li>
              <li className="ml-4">• Email format kontrolü: Username'in email formatına çevrilip çevrilmediğini kontrol eder</li>
              <li className="ml-4">• OPTIONS Preflight: CORS preflight request'ini test eder</li>
              <li className="ml-4">• Login testi: Ana test - login endpoint'ini test eder</li>
              <li className="ml-4">• Kullanıcı kontrolü: Kullanıcının veritabanında olup olmadığını kontrol eder (admin token gerekli)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

