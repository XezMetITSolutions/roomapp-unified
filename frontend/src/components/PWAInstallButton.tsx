'use client'

import { useState } from 'react'
import { Download, Check, X } from 'lucide-react'
import { usePWA } from '@/hooks/usePWA'

export default function PWAInstallButton() {
  const { isInstalled, isInstallable, installApp } = usePWA()
  const [isInstalling, setIsInstalling] = useState(false)

  if (isInstalled) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
        <Check className="w-5 h-5" />
        <span>Uygulama yüklendi!</span>
      </div>
    )
  }

  if (!isInstallable) {
    return null
  }

  const handleInstall = async () => {
    setIsInstalling(true)
    try {
      await installApp()
    } catch (error) {
      console.error('Installation failed:', error)
    } finally {
      setIsInstalling(false)
    }
  }

  return (
    <button
      onClick={handleInstall}
      disabled={isInstalling}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
    >
      <Download className="w-5 h-5" />
      <span>{isInstalling ? 'Yükleniyor...' : 'Uygulamayı Yükle'}</span>
    </button>
  )
}
