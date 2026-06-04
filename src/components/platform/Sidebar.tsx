'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { logout } from '@/lib/auth'
import { Logo } from '@/components/ui/Logo'

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: '▦' },
  { href: '/dashboard/tenants', label: 'Tenants', icon: '🏢' },
  { href: '/dashboard/applications', label: 'Applications', icon: '📋' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  function handleLogout() {
    logout()
    router.push('/login')
  }

  return (
    <aside className="w-56 shrink-0 bg-ink-soft border-r border-white/10 flex flex-col">
      <div className="px-5 py-5 border-b border-white/10">
        <Logo size="md" subtitle="Platform" />
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-0.5 px-3">
        {NAV.map((item) => {
          const active =
            item.href === '/dashboard'
              ? pathname === item.href
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-gold/15 text-gold'
                  : 'text-white/60 hover:text-white hover:bg-white/5',
              )}
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 transition-colors"
        >
          <span>⎋</span> Sign out
        </button>
      </div>
    </aside>
  )
}
