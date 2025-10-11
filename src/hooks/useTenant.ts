'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'

export function useTenant() {
  const [tenant, setTenant] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Browser'da çalışıyor mu kontrol et
    if (typeof window === 'undefined') {
      setIsLoading(false)
      return
    }

    // Host'tan subdomain'i çıkar
    const host = window.location.hostname
    const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'roomapp.com'
    
    if (host.endsWith(`.${baseDomain}`)) {
      const subdomain = host.replace(`.${baseDomain}`, '')
      if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
        setTenant(subdomain)
        apiClient.setTenant(subdomain)
      }
    }

    setIsLoading(false)
  }, [])

  return { tenant, isLoading }
}
