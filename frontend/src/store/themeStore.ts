import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark';

export interface ThemeState {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  cardBackground: string;
  borderColor: string;
  gradientColors: string[];
  fontFamily: string;
  mode: ThemeMode;
  // actions
  setTheme: (partial: Partial<ThemeState>) => void;
  applyToDocument: () => void;
}

const defaultTheme: Omit<ThemeState, 'setTheme' | 'applyToDocument'> = {
  primaryColor: '#D4AF37',
  secondaryColor: '#1E3A8A',
  accentColor: '#F59E0B',
  backgroundColor: '#FFFFFF',
  textColor: '#1F2937',
  cardBackground: '#F9FAFB',
  borderColor: '#E5E7EB',
  gradientColors: ['#D4AF37', '#B9902F', '#997827', '#7A611F', '#5C4A18'],
  fontFamily: 'Inter',
  mode: 'light',
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      ...defaultTheme,
      setTheme: (partial) => {
        set({ ...get(), ...partial });
        // her değişimde DOM'a uygula
        setTimeout(() => get().applyToDocument(), 0);
      },
      applyToDocument: () => {
        if (typeof document === 'undefined') return;
        const root = document.documentElement;
        const state = get();
        root.style.setProperty('--color-primary', state.primaryColor);
        root.style.setProperty('--color-secondary', state.secondaryColor);
        root.style.setProperty('--color-accent', state.accentColor);
        root.style.setProperty('--color-bg', state.backgroundColor);
        root.style.setProperty('--color-text', state.textColor);
        root.style.setProperty('--color-card', state.cardBackground);
        root.style.setProperty('--color-border', state.borderColor);
        root.style.setProperty('--font-family', state.fontFamily);
        // gradientleri index bazlı yaz
        state.gradientColors.forEach((c, i) => {
          root.style.setProperty(`--gradient-${i}`, c);
        });
        root.setAttribute('data-theme', state.mode);
      },
    }),
    {
      name: 'theme-store',
      skipHydration: false,
      onRehydrateStorage: () => (state) => {
        // rehydrate sonrası DOM'a uygula
        if (state?.applyToDocument) {
          queueMicrotask(() => state.applyToDocument());
        }
      },
    }
  )
);

export const generateGradientColors = (primary: string, secondary: string): string[] => {
  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h: number, s: number, l: number = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        default: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [h * 360, s * 100, l * 100] as [number, number, number];
  };

  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const [h1, s1, l1] = hexToHsl(primary);
  const [h2, s2, l2] = hexToHsl(secondary);
  const steps = 5;
  const gradientColors: string[] = [];
  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    const h = h1 + (h2 - h1) * ratio;
    const s = s1 + (s2 - s1) * ratio;
    const l = l1 + (l2 - l1) * ratio;
    gradientColors.push(hslToHex(h, s, l));
  }
  return gradientColors;
};


