'use client'

import { useState, useEffect } from 'react'
import { Wifi, WifiOff } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'
import { RealtimeTranslator } from '@/components/RealtimeTranslator'

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const { currentLanguage } = useLanguageStore()

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check initial status
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
      <WifiOff className="w-5 h-5" />
      <span>
        <RealtimeTranslator
          text="İnternet bağlantısı yok - Offline modda çalışıyor"
          targetLang={currentLanguage as any}
        />
      </span>
    </div>
  )
}
