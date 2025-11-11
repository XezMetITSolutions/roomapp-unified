import { NextResponse } from 'next/server';

// Backend API URL'i
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://roomxqr-backend.onrender.com';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, category } = body;

    if (!id && !name) {
      return NextResponse.json({ error: 'Silinecek ürün bilgisi eksik' }, { status: 400 });
    }

    // Backend API'ye proxy yap
    try {
      const backendResponse = await fetch(`${BACKEND_URL}/api/menu/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, name, category }),
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
      // Backend'e ulaşılamazsa, sadece başarılı dön (client-side'da zaten silindi)
      console.warn('Backend silme hatası (devam ediliyor):', backendError);
      return NextResponse.json({ 
        success: true, 
        message: 'Ürün silindi (backend bağlantısı yok, sadece local silindi)',
        warning: 'Backend bağlantısı kurulamadı'
      }, { status: 200 });
    }

  } catch (err: any) {
    console.error('Menu delete API hatası:', err);
    return NextResponse.json({ error: err?.message || 'Sunucu hatası' }, { status: 500 });
  }
}
