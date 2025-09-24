import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { sampleMenu } from '@/lib/sampleData';

const DATA_DIR = path.join(process.cwd(), '.data');
const MENU_FILE = path.join(DATA_DIR, 'menu.json');

export async function GET() {
  try {
    try {
      const buf = await fs.readFile(MENU_FILE, 'utf8');
      const json = JSON.parse(buf);
      if (Array.isArray(json)) {
        return NextResponse.json({ menu: json }, { status: 200 });
      }
    } catch {}
    return NextResponse.json({ menu: sampleMenu }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Sunucu hatası' }, { status: 500 });
  }
}
