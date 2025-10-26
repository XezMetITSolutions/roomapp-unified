'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const applyToDocument = useThemeStore((s) => s.applyToDocument);

  useEffect(() => {
    applyToDocument();
    // re-apply on visibility change (SSR to CSR hydration quirks)
    const handler = () => applyToDocument();
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, [applyToDocument]);

  return children as any;
}


