'use client'

import { ThemeToggle } from '@/components/ui/ThemeToggle'

interface TopbarProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  search?: {
    value: string
    onChange: (value: string) => void
    placeholder?: string
  }
}

export function Topbar({ title, subtitle, action, search }: TopbarProps) {
  return (
    <div className="flex flex-col px-6 py-4 border-b border-white/10 shrink-0 gap-4">
      {/* Title section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          {subtitle && <p className="text-sm text-white/50 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {action && <div>{action}</div>}
          <ThemeToggle />
        </div>
      </div>

      {/* Search section - optional */}
      {search && (
        <div className="relative w-full">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            className="input pl-9 w-full"
            placeholder={search.placeholder || 'Search…'}
            value={search.value}
            onChange={(e) => search.onChange(e.target.value)}
          />
        </div>
      )}
    </div>
  )
}
