'use client'

import { useTheme } from '@/lib/theme'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors text-base"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
