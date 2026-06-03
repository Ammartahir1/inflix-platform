import { cn } from '@/lib/utils'

interface StatsCardProps {
  label: string
  value: string | number
  icon: string
  variant?: 'default' | 'warning' | 'danger' | 'success'
}

export function StatsCard({ label, value, icon, variant = 'default' }: StatsCardProps) {
  return (
    <div
      className={cn(
        'card p-5 flex flex-col gap-3',
        variant === 'warning' && 'border-amber-500/30',
        variant === 'danger' && 'border-red-500/30',
        variant === 'success' && 'border-green-500/30',
      )}
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-2xl font-black text-white">{value}</p>
        <p
          className={cn(
            'text-sm mt-0.5',
            variant === 'warning'
              ? 'text-amber-400'
              : variant === 'danger'
                ? 'text-red-400'
                : variant === 'success'
                  ? 'text-green-400'
                  : 'text-white/50',
          )}
        >
          {label}
        </p>
      </div>
    </div>
  )
}
