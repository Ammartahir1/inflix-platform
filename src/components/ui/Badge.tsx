import { cn } from '@/lib/utils'

type BadgeVariant = 'gold' | 'green' | 'amber' | 'red' | 'blue' | 'muted'

const variants: Record<BadgeVariant, string> = {
  gold: 'bg-gold !text-white border-gold',
  green: 'bg-green-600 !text-white border-green-600',
  amber: 'bg-amber-600 !text-white border-amber-600',
  red: 'bg-red-600 !text-white border-red-600',
  blue: 'bg-blue-600 !text-white border-blue-600',
  muted: 'bg-gray-600 !text-white border-gray-600',
}

export function Badge({
  children,
  variant = 'muted',
  className,
}: {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
