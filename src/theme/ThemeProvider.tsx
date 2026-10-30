import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

export type Theme = 'light' | 'dark'

type ThemeContextValue = {
  theme: Theme
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export const scenePalette = {
  dark: {
    bg: '#0a0f1c',
    grid: '#1e293b',
    line: '#64748b',
    star: '#94a3b8',
    base: '#334155',
    hot: '#60a5fa',
    pulse: '#93c5fd',
    label: '#ffffff',
    wire: '#475569',
    wireOuter: '#64748b',
    glassColor: '#f5f8ff',
    glassAttenuation: '#c7d2fe',
    glassBackdrop: '#0b1030',
    glassColor2: '#e6fbff',
    glassAttenuation2: '#a5f3fc',
    accentMetal: '#f0f9ff',
    accentEmissive: '#67e8f9',
    accent2Metal: '#faf5ff',
    accent2Emissive: '#c4b5fd',
    rimLight: '#818cf8',
    fillLight: '#22d3ee',
    glowA: '#7c3aed',
    glowB: '#06b6d4',
    floorLine: '#1b2150',
    floorSection: '#3a3f93',
    shadow: '#05030f',
    orbNode: '#67e8f9',
    orbNodeHot: '#c4b5fd',
    orbEdge: '#818cf8',
    orbEdgeOpacity: 0.32,
    orbPulse: '#e0f2fe',
    orbCore: '#8b5cf6',
    orbShell: '#22d3ee',
    orbShellOpacity: 0.32,
    orbAdditive: true,
  },
  light: {
    bg: '#f4f7fb',
    grid: '#cbd5e1',
    line: '#64748b',
    star: '#475569',
    base: '#94a3b8',
    hot: '#2563eb',
    pulse: '#3b82f6',
    label: '#0f172a',
    wire: '#94a3b8',
    wireOuter: '#64748b',
    glassColor: '#1e1b4b',
    glassAttenuation: '#312e81',
    glassBackdrop: '#e8edfb',
    glassColor2: '#0c2a4d',
    glassAttenuation2: '#075985',
    accentMetal: '#0f172a',
    accentEmissive: '#1e1b4b',
    accent2Metal: '#1e3a8a',
    accent2Emissive: '#172554',
    rimLight: '#c7d2fe',
    fillLight: '#fde7f3',
    glowA: '#818cf8',
    glowB: '#38bdf8',
    floorLine: '#dfe5f5',
    floorSection: '#b9c4e8',
    shadow: '#312e81',
    orbNode: '#1d4ed8',
    orbNodeHot: '#7c3aed',
    orbEdge: '#4338ca',
    orbEdgeOpacity: 0.42,
    orbPulse: '#0284c7',
    orbCore: '#6366f1',
    orbShell: '#6366f1',
    orbShellOpacity: 0.22,
    orbAdditive: false,
  },
} as const

function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

function applyTheme(next: Theme) {
  const root = document.documentElement
  root.dataset.theme = next
  root.style.colorScheme = next
  localStorage.setItem('theme', next)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'light' ? '#f4f7fb' : '#0a0f1c')
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readTheme)

  const toggle = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    setTheme(next)
  }, [theme])

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      const next: Theme = mq.matches ? 'dark' : 'light'
      applyTheme(next)
      setTheme(next)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
