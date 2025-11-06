"use client";

import React, { useEffect, useState } from 'react';

export default function AdminLoginDebug() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.roomxr.com';
  const [results, setResults] = useState<Array<{ name: string; ok: boolean; status?: number; data?: any; error?: string }>>([]);

  useEffect(() => {
    const run = async () => {
      const steps: Array<Promise<void>> = [];

      const push = (r: { name: string; ok: boolean; status?: number; data?: any; error?: string }) => {
        setResults(prev => [...prev, r]);
      };

      // 0) ENV bilgileri
      push({
        name: 'ENV & Config',
        ok: true,
        data: {
          NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || null,
          UsingAPIBase: API_BASE_URL,
          LocationOrigin: typeof window !== 'undefined' ? window.location.origin : 'n/a'
        }
      });

      // 1) Health testi
      steps.push((async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
          const data = await res.json().catch(() => ({}));
          push({ name: 'GET /health', ok: res.ok, status: res.status, data });
        } catch (e: any) {
          push({ name: 'GET /health', ok: false, error: e?.message || String(e) });
        }
      })());

      // 2) Preflight (OPTIONS) testi
      steps.push((async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'OPTIONS',
            headers: {
              'Origin': typeof window !== 'undefined' ? window.location.origin : 'https://roomxr.com',
              'Access-Control-Request-Method': 'POST',
            } as any,
          } as RequestInit);
          push({
            name: 'OPTIONS /api/auth/login (preflight)',
            ok: res.ok,
            status: res.status,
            data: {
              'acl-origin': res.headers.get('access-control-allow-origin'),
              'acl-methods': res.headers.get('access-control-allow-methods'),
              'acl-headers': res.headers.get('access-control-allow-headers'),
              'acl-credentials': res.headers.get('access-control-allow-credentials'),
            }
          });
        } catch (e: any) {
          push({ name: 'OPTIONS /api/auth/login (preflight)', ok: false, error: e?.message || String(e) });
        }
      })());

      // 3) Login endpoint’e POST (dummy) – sadece ağ hatası ve CORS’i gözlemek için
      steps.push((async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@roomxr.com', password: 'wrong' })
          });
          const data = await res.json().catch(() => ({}));
          push({ name: 'POST /api/auth/login', ok: res.ok, status: res.status, data });
        } catch (e: any) {
          push({ name: 'POST /api/auth/login', ok: false, error: e?.message || String(e) });
        }
      })());

      await Promise.all(steps);
    };

    run();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Login Debug</h1>
        <p className="text-sm text-gray-600 mb-6">API ve CORS kontrolleri</p>
        <div className="space-y-4">
          {results.map((r, idx) => (
            <div key={idx} className={`border rounded-lg p-4 ${r.ok ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{r.name}</div>
                <div className={`text-xs ${r.ok ? 'text-green-700' : 'text-red-700'}`}>{r.ok ? 'OK' : 'ERROR'}</div>
              </div>
              {r.status && (
                <div className="text-xs text-gray-600 mb-2">HTTP {r.status}</div>
              )}
              {r.error && (
                <pre className="text-xs text-red-800 whitespace-pre-wrap">{r.error}</pre>
              )}
              {r.data && (
                <pre className="text-xs text-gray-800 whitespace-pre-wrap overflow-auto">{JSON.stringify(r.data, null, 2)}</pre>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 text-sm text-gray-500">
          <div>API_BASE_URL: <code>{API_BASE_URL}</code></div>
          <div>Bu sayfa: <code>/admin-login/debug</code></div>
        </div>
      </div>
    </div>
  );
}
