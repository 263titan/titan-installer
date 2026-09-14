import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { cssVariables, typographyVariables, type Theme } from '../tokens/index.js';
import './Typography.css';

// ─────────────────────────────────────────────────────────────────────────────
// ThemeProvider & useTheme
// ─────────────────────────────────────────────────────────────────────────────

interface ThemeContextValue {
  theme:     Theme;
  resolved:  'light' | 'dark';
  setTheme:  (t: Theme) => void;
  toggle:    () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme:    'system',
  resolved: 'light',
  setTheme: () => { /* noop */ },
  toggle:   () => { /* noop */ },
});

export interface ThemeProviderProps {
  children:     React.ReactNode;
  defaultTheme?: Theme;
  storageKey?:   string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey   = 'titan-theme',
}: ThemeProviderProps) {
  const [theme, _setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(storageKey) as Theme | null) ?? defaultTheme;
    }
    return defaultTheme;
  });

  const resolved: 'light' | 'dark' =
    theme === 'system'
      ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;

  useEffect(() => {
    const root = document.documentElement;
    const vars = resolved === 'dark' ? cssVariables.dark : cssVariables.light;

    for (const [key, value] of Object.entries(vars)) {
      root.style.setProperty(key, value);
    }
    // Typography scale is theme-invariant — applied once.
    for (const [key, value] of Object.entries(typographyVariables)) {
      root.style.setProperty(key, value);
    }
    root.setAttribute('data-theme', resolved);
  }, [resolved]);

  const setTheme = useCallback((t: Theme) => {
    localStorage.setItem(storageKey, t);
    _setTheme(t);
  }, [storageKey]);

  const toggle = useCallback(() => {
    setTheme(resolved === 'light' ? 'dark' : 'light');
  }, [resolved, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
