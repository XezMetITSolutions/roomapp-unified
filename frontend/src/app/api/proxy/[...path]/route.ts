import { NextRequest, NextResponse } from 'next/server';

const RAW_API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.roomxr.com';
const API_BASE = /\/api\/?$/.test(RAW_API_BASE)
  ? RAW_API_BASE.replace(/\/$/, '')
  : `${RAW_API_BASE.replace(/\/$/, '')}`;

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params);
}
export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) { return proxy(req, params); }
export async function PUT(req: NextRequest, { params }: { params: { path: string[] } }) { return proxy(req, params); }
export async function PATCH(req: NextRequest, { params }: { params: { path: string[] } }) { return proxy(req, params); }
export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) { return proxy(req, params); }

async function proxy(req: NextRequest, { path }: { path: string[] }) {
  const targetPath = path.join('/');
  const url = `${API_BASE}/${targetPath}`;
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => { if (key.toLowerCase() === 'host') return; headers[key] = value as string; });
  const init: RequestInit = { method: req.method, headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : await req.text() };
  try {
    const res = await fetch(url, init as any);
    const data = await res.arrayBuffer();
    const response = new NextResponse(data, { status: res.status, headers: res.headers });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Proxy error' }, { status: 502 });
  }
}
