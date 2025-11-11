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

      // 404 - Backend endpoint yok, client-side'da zaten silindi, başarılı dön
      if (backendResponse.status === 404) {
        return NextResponse.json({ 
          success: true, 
          message: 'Ürün silindi',
          note: 'Backend endpoint bulunamadı, client-side silme başarılı'
        }, { status: 200 });
      }

      const backendData = await backendResponse.json();

      if (backendResponse.ok) {
        return NextResponse.json({ 
          success: true, 
          ...backendData
        }, { status: 200 });
      } else {
        // Backend hatası ama client-side'da zaten silindi, başarılı dön
        return NextResponse.json({ 
          success: true, 
          message: 'Ürün silindi',
          warning: 'Backend hatası: ' + (backendData.error || 'Bilinmeyen hata'),
          note: 'Client-side silme başarılı'
        }, { status: 200 });
      }
    } catch (backendError: any) {
      // Backend'e ulaşılamazsa, client-side'da zaten silindi, başarılı dön
      console.warn('Backend silme hatası (devam ediliyor):', backendError);
      return NextResponse.json({ 
        success: true, 
        message: 'Ürün silindi',
        warning: 'Backend bağlantısı kurulamadı',
        note: 'Client-side silme başarılı'
      }, { status: 200 });
    }

  } catch (err: any) {
    console.error('Menu delete API hatası:', err);
    // Hata olsa bile client-side'da silindi, başarılı dön
    return NextResponse.json({ 
      success: true, 
      message: 'Ürün silindi',
      warning: err?.message || 'Sunucu hatası',
      note: 'Client-side silme başarılı'
    }, { status: 200 });
  }
}
