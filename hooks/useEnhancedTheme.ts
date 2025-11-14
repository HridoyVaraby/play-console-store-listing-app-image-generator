import { useState, useEffect, useCallback } from 'react';

export type ThemeVariant = 'light' | 'dark' | 'auto' | 'blue' | 'green' | 'purple' | 'orange';

export interface ThemeConfig {
  name: string;
  variant: ThemeVariant;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    accent: string;
  };
}

const THEME_CONFIGS: Record<ThemeVariant, ThemeConfig> = {
  light: {
    name: 'Light',
    variant: 'light',
    colors: {
      primary: '#3b82f6',
      secondary: '#6366f1',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#0f172a',
      textSecondary: '#475569',
      border: '#e2e8f0',
      accent: '#f59e0b'
    }
  },
  dark: {
    name: 'Dark',
    variant: 'dark',
    colors: {
      primary: '#60a5fa',
      secondary: '#818cf8',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f8fafc',
      textSecondary: '#cbd5e1',
      border: '#334155',
      accent: '#fbbf24'
    }
  },
  blue: {
    name: 'Ocean Blue',
    variant: 'blue',
    colors: {
      primary: '#0ea5e9',
      secondary: '#06b6d4',
      background: '#f0f9ff',
      surface: '#e0f2fe',
      text: '#0c4a6e',
      textSecondary: '#075985',
      border: '#bae6fd',
      accent: '#f97316'
    }
  },
  green: {
    name: 'Forest Green',
    variant: 'green',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      background: '#f0fdf4',
      surface: '#dcfce7',
      text: '#064e3b',
      textSecondary: '#065f46',
      border: '#bbf7d0',
      accent: '#f59e0b'
    }
  },
  purple: {
    name: 'Royal Purple',
    variant: 'purple',
    colors: {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      background: '#faf5ff',
      surface: '#f3e8ff',
      text: '#581c87',
      textSecondary: '#6b21a8',
      border: '#e9d5ff',
      accent: '#ec4899'
    }
  },
  orange: {
    name: 'Sunset Orange',
    variant: 'orange',
    colors: {
      primary: '#f97316',
      secondary: '#ea580c',
      background: '#fff7ed',
      surface: '#ffedd5',
      text: '#7c2d12',
      textSecondary: '#9a3412',
      border: '#fed7aa',
      accent: '#8b5cf6'
    }
  },
  auto: {
    name: 'Auto',
    variant: 'auto',
    colors: {
      primary: '#3b82f6',
      secondary: '#6366f1',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#0f172a',
      textSecondary: '#475569',
      border: '#e2e8f0',
      accent: '#f59e0b'
    }
  }
};

export interface UseEnhancedThemeReturn {
  theme: ThemeVariant;
  themeConfig: ThemeConfig;
  availableThemes: ThemeConfig[];
  setTheme: (theme: ThemeVariant) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isAuto: boolean;
}

/**
 * Enhanced theme hook with multiple theme options and auto-detection
 */
export const useEnhancedTheme = (): UseEnhancedThemeReturn => {
  const [theme, setTheme] = useState<ThemeVariant>(() => {
    const saved = localStorage.getItem('enhanced-theme') as ThemeVariant;
    return saved || 'auto';
  });

  const [isDark, setIsDark] = useState(false);
  const [isAuto, setIsAuto] = useState(theme === 'auto');

  // Auto-detect system theme
  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDark(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [theme]);

  // Apply theme to document
  useEffect(() => {
    const effectiveTheme = theme === 'auto' ? (isDark ? 'dark' : 'light') : theme;
    const config = THEME_CONFIGS[effectiveTheme as ThemeVariant];

    // Apply CSS custom properties
    const root = document.documentElement;
    Object.entries(config.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });

    // Update document classes
    document.documentElement.classList.remove('light', 'dark', 'blue', 'green', 'purple', 'orange');
    document.documentElement.classList.add(effectiveTheme);

    // Save to localStorage
    localStorage.setItem('enhanced-theme', theme);
  }, [theme, isDark]);

  const setThemeCallback = useCallback((newTheme: ThemeVariant) => {
    setTheme(newTheme);
    setIsAuto(newTheme === 'auto');
  }, []);

  const toggleTheme = useCallback(() => {
    const themes: ThemeVariant[] = ['light', 'dark', 'blue', 'green', 'purple', 'orange'];
    const currentIndex = themes.indexOf(theme === 'auto' ? 'light' : theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setThemeCallback(themes[nextIndex]);
  }, [theme, setThemeCallback]);

  const effectiveTheme = theme === 'auto' ? (isDark ? 'dark' : 'light') : theme;
  const themeConfig = THEME_CONFIGS[effectiveTheme as ThemeVariant];
  const availableThemes = Object.values(THEME_CONFIGS);

  return {
    theme,
    themeConfig,
    availableThemes,
    setTheme: setThemeCallback,
    toggleTheme,
    isDark: theme === 'dark' || (theme === 'auto' && isDark),
    isAuto
  };
};

/**
 * Theme preferences hook for advanced customization
 */
export const useThemePreferences = () => {
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('theme-preferences');
    return saved ? JSON.parse(saved) : {
      highContrast: false,
      reducedMotion: false,
      largeText: false,
      colorBlindMode: 'none' // 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'
    };
  });

  useEffect(() => {
    localStorage.setItem('theme-preferences', JSON.stringify(preferences));
    
    // Apply accessibility preferences
    const root = document.documentElement;
    root.classList.toggle('high-contrast', preferences.highContrast);
    root.classList.toggle('reduced-motion', preferences.reducedMotion);
    root.classList.toggle('large-text', preferences.largeText);
    root.setAttribute('data-color-blind-mode', preferences.colorBlindMode);
  }, [preferences]);

  const updatePreference = useCallback((key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  }, []);

  return { preferences, updatePreference };
};