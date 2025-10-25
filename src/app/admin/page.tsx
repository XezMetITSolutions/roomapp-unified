'use client'

import { useState } from 'react'

export default function AdminPage() {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    adminEmail: '',
    adminPassword: '',
    adminFirstName: '',
    adminLastName: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [createdTenant, setCreatedTenant] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('https://roomapp-backend.onrender.com/api/admin/tenants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('✅ Müşteri başarıyla oluşturuldu!')
        setCreatedTenant(data)
        setFormData({
          name: '',
          slug: '',
          adminEmail: '',
          adminPassword: '',
          adminFirstName: '',
          adminLastName: ''
        })
      } else {
        setMessage(`❌ Hata: ${data.message}`)
      }
    } catch (error) {
      setMessage('❌ Sunucu hatası')
    } finally {
      setLoading(false)
    }
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const slug = value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    setFormData(prev => ({ ...prev, slug }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            🏢 Yeni Müşteri Oluştur
          </h1>

          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message}
            </div>
          )}

          {createdTenant && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">🎉 Müşteri Bilgileri:</h3>
              <div className="space-y-1 text-sm text-blue-800">
                <p><strong>İşletme:</strong> {createdTenant.tenant.name}</p>
                <p><strong>URL:</strong> <a href={createdTenant.tenant.url} target="_blank" rel="noopener noreferrer" className="underline">{createdTenant.tenant.url}</a></p>
                <p><strong>Admin:</strong> {createdTenant.admin.email}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                İşletme Adı
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Örnek: Güneş Otel"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subdomain (URL kısmı)
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={handleSlugChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="gunes"
              />
              <p className="text-xs text-gray-500 mt-1">
                URL: https://{formData.slug || 'gunes'}.roomapp.com
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Adı
                </label>
                <input
                  type="text"
                  required
                  value={formData.adminFirstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, adminFirstName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ahmet"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Soyadı
                </label>
                <input
                  type="text"
                  required
                  value={formData.adminLastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, adminLastName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Yılmaz"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin E-posta
              </label>
              <input
                type="email"
                required
                value={formData.adminEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, adminEmail: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin@gunesotel.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Şifre
              </label>
              <input
                type="password"
                required
                value={formData.adminPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, adminPassword: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Güvenli bir şifre girin"
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Oluşturuluyor...' : '🚀 Müşteri Oluştur'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">📋 Sonraki Adımlar:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Müşteriye URL'yi gönderin</li>
              <li>• Giriş bilgilerini paylaşın</li>
              <li>• 30 dakikalık kısa eğitim verin</li>
              <li>• QR kodları basın ve yerleştirin</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
