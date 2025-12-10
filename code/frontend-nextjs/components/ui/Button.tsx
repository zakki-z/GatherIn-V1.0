import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    fullWidth?: boolean
}

export default function Button({ children, fullWidth, className, ...props }: ButtonProps) {
    return (
        <button
            className={cn(
                'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium',
                fullWidth && 'w-full',
                className
            )}
            {...props}
        >
            {children}
        </button>
    )
}
