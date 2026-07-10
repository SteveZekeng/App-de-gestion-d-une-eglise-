import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg shadow-blue-900/40 hover:from-blue-500 hover:to-blue-700 active:scale-95':
              variant === 'primary',
            'bg-blue-900/4 dark:bg-white/5 text-blue-700 dark:text-blue-200 border border-blue-400/30 hover:bg-blue-900/6 dark:hover:bg-white/10':
              variant === 'secondary',
            'bg-transparent text-foreground/70 hover:bg-blue-900/5 dark:hover:bg-white/10': variant === 'ghost',
          },
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button