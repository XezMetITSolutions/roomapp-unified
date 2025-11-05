import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, category } = body;

    if (!id && !name) {
      return NextResponse.json({ error: 'Silinecek ürün bilgisi eksik' }, { status: 400 });
    }

    await fs.mkdir(DATA_DIR, { recursive: true });

    let current: any[] = [];
    try {
      const buf = await fs.readFile(MENU_FILE, 'utf8');
      const parsed = JSON.parse(buf);
      if (Array.isArray(parsed)) current = parsed;
    } catch {
      return NextResponse.json({ error: 'Menü dosyası bulunamadı' }, { status: 404 });
    }

    // Silme işlemi
    let filteredItems = current;
    
    if (id) {
      // ID ile sil
      filteredItems = current.filter(item => item.id !== id);
    } else if (name && category) {
      // Name + category ile sil
      const keyToDelete = normalizeKey(name, category);
      filteredItems = current.filter(item => {
        const itemKey = normalizeKey(item.name, item.category || 'Genel');
        return itemKey !== keyToDelete;
      });
    }

    // Dosyayı güncelle
    await fs.writeFile(MENU_FILE, JSON.stringify(filteredItems, null, 2), 'utf8');

    const deletedCount = current.length - filteredItems.length;
    return NextResponse.json({ 
      success: true, 
      deletedCount,
      message: `${deletedCount} ürün silindi` 
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Sunucu hatası' }, { status: 500 });
  }
}
