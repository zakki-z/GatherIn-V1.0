import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    fullWidth?: boolean
}

export default function Button({ children, fullWidth, className, disabled, ...props }: ButtonProps) {
    return (
        <button
            className={cn(
                'px-3 sm:px-4 py-2 sm:py-2.5 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg sm:rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center',
                fullWidth && 'w-full',
                disabled && 'hover:bg-primary-600 dark:hover:bg-primary-500 active:scale-100',
                className
            )}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    )
}
