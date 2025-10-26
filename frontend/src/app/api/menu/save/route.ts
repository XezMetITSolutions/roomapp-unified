import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

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

const DATA_DIR = path.join(process.cwd(), '.data');
const MENU_FILE = path.join(DATA_DIR, 'menu.json');

function normalizeKey(name: string, category: string) {
  const s = (v: string) => (v || '')
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  return `${s(name)}__${s(category)}`;
}

function normalizeItem(it: IncomingItem) {
  const priceNumber = typeof it.price === 'number' ? it.price : Number(String(it.price).replace(/[^0-9.,-]/g, '').replace(',', '.'));
  return {
    id: `menu-${Date.now()}-${Math.random()}`,
    name: String(it.name || '').trim(),
    description: String(it.description || '').trim(),
    category: String(it.category || 'Genel'),
    price: !isNaN(priceNumber) ? Number(priceNumber) : 0,
    image: it.image || '',
    preparationTime: it.preparationTime || 15,
    allergens: it.allergens || [],
    calories: it.calories,
    rating: it.rating || 4.0,
    available: it.available !== false, // API'den gelen available değerini kullan
    isNew: false,
    isPopular: false,
    dietaryInfo: [] as string[],
    likes: 0,
  };
}

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

    const normalized = items.map(normalizeItem);

    await fs.mkdir(DATA_DIR, { recursive: true });

    let current: any[] = [];
    try {
      const buf = await fs.readFile(MENU_FILE, 'utf8');
      const parsed = JSON.parse(buf);
      if (Array.isArray(parsed)) current = parsed;
    } catch {}

    // Upsert: name+category anahtarı ile güncelle veya ekle
    const keyToIndex = new Map<string, number>();
    current.forEach((it, idx) => keyToIndex.set(normalizeKey(it.name, it.category || 'Genel'), idx));

    normalized.forEach((it) => {
      const key = normalizeKey(it.name, it.category);
      const existingIdx = keyToIndex.get(key);
      if (existingIdx !== undefined) {
        // Var olanı güncelle (fiyat, açıklama, image, hazırlık süresi, availability)
        current[existingIdx] = {
          ...current[existingIdx],
          description: it.description || current[existingIdx].description,
          price: it.price ?? current[existingIdx].price,
          image: it.image || current[existingIdx].image,
          preparationTime: it.preparationTime ?? current[existingIdx].preparationTime,
          allergens: it.allergens || current[existingIdx].allergens,
          calories: it.calories ?? current[existingIdx].calories,
          rating: it.rating ?? current[existingIdx].rating,
          available: it.available !== undefined ? it.available : current[existingIdx].available,
        };
      } else {
        current.push(it);
        keyToIndex.set(key, current.length - 1);
      }
    });

    await fs.writeFile(MENU_FILE, JSON.stringify(current, null, 2), 'utf8');

    return NextResponse.json({ success: true, count: normalized.length, merged: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Sunucu hatası' }, { status: 500 });
  }
}
