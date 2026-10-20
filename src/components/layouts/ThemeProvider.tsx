'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: 'light',
  toggle: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved === 'dark' || saved === 'light') setTheme(saved)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.style.setProperty('--navy-950',      '#080D1C')
      root.style.setProperty('--navy-900',      '#0D1426')
      root.style.setProperty('--navy-800',      '#111B33')
      root.style.setProperty('--navy-700',      '#182040')
      root.style.setProperty('--navy-600',      '#1E2B52')
      root.style.setProperty('--brand-gold',    '#F5A623')
      root.style.setProperty('--brand-gold-dim','#D4891A')
      root.style.setProperty('--green-gain',    '#22C55E')
      root.style.setProperty('--red-loss',      '#EF4444')
      root.style.setProperty('--text-primary',  '#F1F5F9')
      root.style.setProperty('--text-secondary','#94A3B8')
      root.style.setProperty('--text-muted',    '#64748B')
      root.style.setProperty('--border-subtle', 'rgba(255,255,255,0.07)')
      root.style.setProperty('--border-normal', 'rgba(255,255,255,0.12)')
      root.style.setProperty('--surface-card',  '#111B33')
      root.style.setProperty('--surface-hover', '#182040')
      document.body.style.background = '#080D1C'
      document.body.style.color = '#F1F5F9'
    } else {
      root.style.setProperty('--navy-950',      '#F8FAFC')
      root.style.setProperty('--navy-900',      '#FFFFFF')
      root.style.setProperty('--navy-800',      '#F1F5F9')
      root.style.setProperty('--navy-700',      '#E2E8F0')
      root.style.setProperty('--navy-600',      '#CBD5E1')
      root.style.setProperty('--brand-gold',    '#D97706')
      root.style.setProperty('--brand-gold-dim','#B45309')
      root.style.setProperty('--green-gain',    '#16A34A')
      root.style.setProperty('--red-loss',      '#DC2626')
      root.style.setProperty('--text-primary',  '#0F172A')
      root.style.setProperty('--text-secondary','#475569')
      root.style.setProperty('--text-muted',    '#94A3B8')
      root.style.setProperty('--border-subtle', 'rgba(0,0,0,0.07)')
      root.style.setProperty('--border-normal', 'rgba(0,0,0,0.13)')
      root.style.setProperty('--surface-card',  '#FFFFFF')
      root.style.setProperty('--surface-hover', '#F1F5F9')
      document.body.style.background = '#F8FAFC'
      document.body.style.color = '#0F172A'
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  function toggle() {
    setTheme(t => t === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}


