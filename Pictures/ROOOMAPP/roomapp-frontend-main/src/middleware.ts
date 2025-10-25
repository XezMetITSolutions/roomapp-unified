import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  
  // Ana domain (roomapp.com) kontrolü
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'roomapp.com'
  const isSubdomain = host.endsWith(`.${baseDomain}`)
  
  if (isSubdomain) {
    // Subdomain'i al (örnek: gunes.roomapp.com -> gunes)
    const subdomain = host.replace(`.${baseDomain}`, '')
    
    // Geçersiz subdomain'leri filtrele
    if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
      // Request header'ına tenant bilgisini ekle
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-tenant', subdomain)
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }
  }
  
  // Ana domain veya geçersiz subdomain için normal devam et
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
