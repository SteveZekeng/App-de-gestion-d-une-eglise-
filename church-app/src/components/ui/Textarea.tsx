import { cn } from '@/lib/utils'
import { TextareaHTMLAttributes, forwardRef } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-blue-800/80 dark:text-blue-100/80">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          rows={3}
          className={cn(
            'w-full rounded-xl border border-blue-900/15 dark:border-white/10 bg-blue-900/4 dark:bg-white/5 px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/35 outline-none backdrop-blur-sm transition-all duration-200 resize-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30',
            error && 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
export default Textarea