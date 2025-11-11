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
        },
        body: JSON.stringify({ items }),
      });

      const backendData = await backendResponse.json();

      if (backendResponse.ok) {
        return NextResponse.json({ 
          success: true, 
          ...backendData
        }, { status: 200 });
      } else {
        return NextResponse.json({ 
          error: backendData.error || 'Backend hatası' 
        }, { status: backendResponse.status });
      }
    } catch (backendError: any) {
      // Backend'e ulaşılamazsa hata dön
      console.error('Backend menu save hatası:', backendError);
      return NextResponse.json({ 
        error: 'Backend bağlantısı kurulamadı: ' + (backendError?.message || 'Bilinmeyen hata')
      }, { status: 500 });
    }

  } catch (err: any) {
    console.error('Menu save API hatası:', err);
    return NextResponse.json({ error: err?.message || 'Sunucu hatası' }, { status: 500 });
  }
}
