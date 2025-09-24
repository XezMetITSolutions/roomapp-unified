import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

const MAX_ROWS = 500; // header + 500 satır önizleme için yeterli
const MAX_COLS = 30;  // aşırı geniş sütunları kes
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
const ALLOWED_EXT = ['.csv', '.xlsx', '.xls', '.xml', '.jpg', '.jpeg', '.png', '.pdf'];

function clampTable(data: any[][]): any[][] {
  if (!Array.isArray(data) || data.length === 0) return data;
  const limited = data.slice(0, MAX_ROWS + 1).map(row => Array.isArray(row) ? row.slice(0, MAX_COLS) : row);
  return limited;
}

function endsWithOne(name: string, exts: string[]) {
  return exts.some(ext => name.endsWith(ext));
}

function parseCsv(text: string): any[][] {
  const rows = text.split(/\r?\n/).filter(r => r.trim().length > 0);
  const table = rows.map(r => r.split(',').map(c => c.replace(/^\"|\"$/g, '').trim()));
  return clampTable(table);
}

function parseSimpleMenuXml(xml: string): any[][] {
  const products: { [key: string]: string }[] = [];
  const productRegex = /<product\b[\s\S]*?>[\s\S]*?<\/product>/gi;
  const getTag = (block: string, tag: string) => {
    const m = new RegExp(`<${tag}[^>]*>([\s\S]*?)<\/${tag}>`, 'i').exec(block);
    return m ? m[1].trim() : '';
  };

  const blocks = xml.match(productRegex) || [];
  for (const block of blocks) {
    products.push({
      name: getTag(block, 'name'),
      price: getTag(block, 'price'),
      description: getTag(block, 'description'),
      category: getTag(block, 'category'),
      image: getTag(block, 'image'),
    });
  }

  const header = ['name', 'price', 'description', 'category', 'image'];
  const rows = products.map(p => header.map(h => (p as any)[h] ?? ''));
  return clampTable([header, ...rows]);
}

function validateSimpleMenuXmlTable(table: any[][]) {
  const errors: string[] = [];
  if (!table || table.length <= 1) {
    errors.push('XML içinde ürün bulunamadı.');
    return errors;
  }
  const header = table[0] as string[];
  const idxName = header.indexOf('name');
  const idxPrice = header.indexOf('price');
  if (idxName === -1) errors.push('XML: name alanı eksik.');
  if (idxPrice === -1) errors.push('XML: price alanı eksik.');
  if (errors.length > 0) return errors;

  for (let i = 1; i < table.length; i++) {
    const row = table[i];
    const nameVal = row[idxName];
    const priceVal = row[idxPrice];
    if (!nameVal || String(nameVal).trim() === '') {
      errors.push(`Satır ${i}: name zorunlu.`);
    }
    if (priceVal === undefined || priceVal === null || String(priceVal).trim() === '') {
      errors.push(`Satır ${i}: price zorunlu.`);
    }
  }
  return errors;
}

function heuristicLinesToTable(text: string): any[][] {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  const header = ['name', 'price', 'description'];
  const rows: any[][] = [];
  const priceRegex = /(\d+[\.,]?\d*)\s*(₺|TL)?$/i;
  for (const line of lines) {
    const m = priceRegex.exec(line);
    if (m) {
      const priceStr = m[1].replace(',', '.');
      const name = line.replace(m[0], '').replace(/[\-–]+$/, '').trim();
      rows.push([name, priceStr, '']);
    } else {
      rows.push([line, '', '']);
    }
  }
  return clampTable([header, ...rows]);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
    }

    const fileName = (file as any).name || 'upload';
    const lower = fileName.toLowerCase();

    // Boyut ve uzantı kontrolü
    if ((file as any).size && (file as any).size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Dosya çok büyük (maks 15MB).' }, { status: 413 });
    }
    if (!endsWithOne(lower, ALLOWED_EXT)) {
      return NextResponse.json({ error: 'Desteklenmeyen dosya türü' }, { status: 415 });
    }

    const arrayBuffer = await file.arrayBuffer();

    let data: any[][] = [];

    if (lower.endsWith('.csv')) {
      const text = Buffer.from(arrayBuffer).toString('utf8');
      data = parseCsv(text);
    } else if (lower.endsWith('.xlsx') || lower.endsWith('.xls')) {
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheet = workbook.SheetNames[0];
      const sheet = workbook.Sheets[firstSheet];
      const table = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
      data = clampTable(table);
    } else if (lower.endsWith('.xml')) {
      const text = Buffer.from(arrayBuffer).toString('utf8');
      data = parseSimpleMenuXml(text);
      const xmlErrors = validateSimpleMenuXmlTable(data);
      if (xmlErrors.length > 0) {
        return NextResponse.json({ error: 'XML doğrulama hatası', details: xmlErrors }, { status: 422 });
      }
    } else if (lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png')) {
      try {
        const { createWorker } = await import('tesseract.js');
        const worker = await createWorker();
        await worker.loadLanguage('tur+eng');
        await worker.initialize('tur+eng');
        const { data: ocr } = await worker.recognize(Buffer.from(arrayBuffer));
        await worker.terminate();
        const text = (ocr?.text || '').trim();
        if (!text) {
          return NextResponse.json({ error: 'OCR metin çıkaramadı' }, { status: 422 });
        }
        data = heuristicLinesToTable(text);
      } catch (e: any) {
        return NextResponse.json({ error: 'OCR desteği etkin değil. (tesseract.js ve tur dil verisi gerekli)' }, { status: 501 });
      }
    } else if (lower.endsWith('.pdf')) {
      try {
        const pdfParse = (await import('pdf-parse')).default as any;
        const result = await pdfParse(Buffer.from(arrayBuffer));
        const text: string = (result?.text || '').trim();
        if (!text) {
          return NextResponse.json({ error: 'PDF metin çıkarılamadı. (Taranmış PDF olabilir)' }, { status: 422 });
        }
        data = heuristicLinesToTable(text);
      } catch (e: any) {
        return NextResponse.json({ error: 'PDF desteği etkin değil. (pdf-parse gerekli)' }, { status: 501 });
      }
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Dosya boş veya okunamadı' }, { status: 422 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Sunucu hatası' }, { status: 500 });
  }
}
