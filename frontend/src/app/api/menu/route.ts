import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), '.data');
const MENU_FILE = path.join(DATA_DIR, 'menu.json');
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://roomxqr-backend.onrender.com';

export async function GET(request: Request) {
  try {
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

    // Önce backend'den menüyü yüklemeyi dene
    try {
      const backendHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-tenant': tenantSlug,
      };

      const backendResponse = await fetch(`${BACKEND_URL}/api/menu`, {
        method: 'GET',
        headers: backendHeaders,
      });

      if (backendResponse.ok) {
        const backendData = await backendResponse.json();
        // Backend'den gelen formatı frontend formatına çevir
        // Backend hem menuItems hem de menu döndürebilir
        const menuItems = backendData.menuItems || backendData.menu || [];
        const menu = menuItems.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          price: parseFloat(item.price) || 0,
          category: item.category || 'Diğer',
          image: item.image || '',
          allergens: item.allergens || [],
          calories: item.calories,
          preparationTime: 15, // Varsayılan
          rating: 4.0, // Varsayılan
          available: item.isAvailable !== false,
        }));
        
        return NextResponse.json({ menu }, { status: 200 });
      }
    } catch (backendError) {
      console.warn('Backend menu yükleme hatası, client-side dosyaya geçiliyor:', backendError);
    }

    // Backend'den yüklenemezse, client-side dosyadan oku
    try {
      const menuData = await fs.readFile(MENU_FILE, 'utf8');
      const menu = JSON.parse(menuData);
      return NextResponse.json({ menu }, { status: 200 });
    } catch (error) {
      // Dosya yoksa boş menü döndür
      return NextResponse.json({ menu: [] }, { status: 200 });
    }
  } catch (error) {
    console.error('Menu API hatası:', error);
    return NextResponse.json({ menu: [] }, { status: 200 });
  }
}
