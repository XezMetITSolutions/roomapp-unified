'use client'

import Link from 'next/link'

export default function GlobalError() {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
              Kritik Hata
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Uygulamada kritik bir hata oluştu.
            </p>
            <Link href="/" className="w-full inline-block text-center bg-hotel-gold text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors">
              Ana Sayfa
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}
