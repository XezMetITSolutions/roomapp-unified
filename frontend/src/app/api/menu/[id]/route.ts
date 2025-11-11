import { NextResponse } from 'next/server';

// Backend API URL'i
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://roomxqr-backend.onrender.com';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Ürün ID\'si eksik' }, { status: 400 });
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

    // Authorization token'ını al
    const authHeader = request.headers.get('authorization') || '';

    // Backend API'ye proxy yap
    try {
      const backendHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-tenant': tenantSlug,
      };

      // Authorization header'ı varsa ekle
      if (authHeader) {
        backendHeaders['Authorization'] = authHeader;
      }

      const backendResponse = await fetch(`${BACKEND_URL}/api/menu/${id}`, {
        method: 'PUT',
        headers: backendHeaders,
        body: JSON.stringify(body),
      });

      if (backendResponse.status === 404) {
        return NextResponse.json({ 
          error: 'Ürün bulunamadı'
        }, { status: 404 });
      }

      const backendData = await backendResponse.json();

      if (backendResponse.ok) {
        return NextResponse.json({ 
          success: true, 
          ...backendData
        }, { status: 200 });
      } else {
        return NextResponse.json({ 
          error: backendData.message || 'Güncelleme hatası'
        }, { status: backendResponse.status });
      }
    } catch (backendError: any) {
      console.warn('Backend menu update hatası:', backendError);
      return NextResponse.json({ 
        error: 'Backend bağlantısı kurulamadı: ' + (backendError?.message || 'Bilinmeyen hata')
      }, { status: 500 });
    }

  } catch (err: any) {
    console.error('Menu update API hatası:', err);
    return NextResponse.json({ error: err?.message || 'Sunucu hatası' }, { status: 500 });
  }
}

