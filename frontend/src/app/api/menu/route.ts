import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), '.data');
const MENU_FILE = path.join(DATA_DIR, 'menu.json');

export async function GET() {
  try {
    // Menü dosyasını oku
    const menuData = await fs.readFile(MENU_FILE, 'utf8');
    const menu = JSON.parse(menuData);
    
    return NextResponse.json({ menu }, { status: 200 });
  } catch (error) {
    // Dosya yoksa boş menü döndür
    return NextResponse.json({ menu: [] }, { status: 200 });
  }
}
