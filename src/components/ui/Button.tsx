import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'gold', size = 'md', loading, className, children, disabled, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
    const variants = {
      gold: 'bg-gold text-ink hover:bg-gold-light active:bg-gold-dark',
      outline: 'border border-gold text-gold hover:bg-gold hover:text-ink',
      ghost: 'text-white/60 hover:bg-white/10 hover:text-white',
      danger: 'bg-red-600 text-white hover:bg-red-700',
    }
    const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-5 py-2.5 text-sm' }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && <span className="mr-2 inline-block animate-spin">⟳</span>}
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
