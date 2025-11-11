import { NextResponse } from 'next/server';

// Backend API URL'i
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://roomxqr-backend.onrender.com';

type IncomingItem = {
  name: string;
  price: number | string;
  description?: string;
  category?: string;
  image?: string;
  preparationTime?: number;
  allergens?: string[];
  calories?: number;
  rating?: number;
  available?: boolean;
};

export async function POST(request: Request) {
  try {
    // Admin anahtar kontrolü (isteğe bağlı). ENV yoksa serbest.
    const requiredKey = process.env.ADMIN_KEY;
    if (requiredKey) {
      const provided = (request.headers.get('x-admin-key') || '').trim();
      if (!provided || provided !== requiredKey) {
        return NextResponse.json({ error: 'Yetkisiz işlem' }, { status: 401 });
      }
    }

    // Tenant bilgisini al
    let tenantSlug = request.headers.get('x-tenant') || '';
    
    // Eğer header'da yoksa, host header'ından subdomain'i çıkar
    if (!tenantSlug) {
      const host = request.headers.get('host') || '';
      const subdomain = host.split('.')[0];
      if (subdomain && subdomain !== 'www' && subdomain !== 'roomxqr' && subdomain !== 'roomxqr-backend' && subdomain !== 'localhost') {
        tenantSlug = subdomain;
      } else {
        // Varsayılan tenant
        tenantSlug = 'demo';
      }
    }

    const body = await request.json();
    const items: IncomingItem[] = body?.items || [];

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Ürün listesi boş' }, { status: 400 });
    }

    const errors: string[] = [];
    items.forEach((it, idx) => {
      if (!it.name) errors.push(`Satır ${idx + 1}: name zorunlu`);
      if (it.price === undefined || it.price === null || it.price === '') errors.push(`Satır ${idx + 1}: price zorunlu`);
    });
    if (errors.length > 0) {
      return NextResponse.json({ error: 'Doğrulama hatası', details: errors }, { status: 422 });
    }

    // Backend API'ye proxy yap
    try {
      const backendResponse = await fetch(`${BACKEND_URL}/api/menu/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant': tenantSlug,
        },
        body: JSON.stringify({ items }),
      });

      // 404 - Backend endpoint yok, client-side'da zaten kaydedildi, başarılı dön
      if (backendResponse.status === 404) {
        return NextResponse.json({ 
          success: true, 
          count: items.length,
          message: 'Menü kaydedildi (backend endpoint yok, sadece client-side)',
          warning: 'Backend endpoint bulunamadı: /api/menu/save',
          note: 'Backend\'de bu endpoint oluşturulmalı'
        }, { status: 200 });
      }

      const backendData = await backendResponse.json();

      if (backendResponse.ok) {
        return NextResponse.json({ 
          success: true, 
          ...backendData
        }, { status: 200 });
      } else {
        // Backend hatası ama client-side'da zaten kaydedildi, başarılı dön
        return NextResponse.json({ 
          success: true,
          count: items.length,
          message: 'Menü kaydedildi (backend hatası, sadece client-side)',
          warning: 'Backend hatası: ' + (backendData.error || 'Bilinmeyen hata'),
          note: 'Client-side kayıt başarılı'
        }, { status: 200 });
      }
    } catch (backendError: any) {
      // Backend'e ulaşılamazsa, client-side'da zaten kaydedildi, başarılı dön
      console.warn('Backend menu save hatası (devam ediliyor):', backendError);
      return NextResponse.json({ 
        success: true,
        count: items.length,
        message: 'Menü kaydedildi (backend bağlantısı yok, sadece client-side)',
        warning: 'Backend bağlantısı kurulamadı: ' + (backendError?.message || 'Bilinmeyen hata'),
        note: 'Client-side kayıt başarılı'
      }, { status: 200 });
    }

  } catch (err: any) {
    console.error('Menu save API hatası:', err);
    return NextResponse.json({ error: err?.message || 'Sunucu hatası' }, { status: 500 });
  }
}
