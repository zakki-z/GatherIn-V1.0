import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
    children: ReactNode
    className?: string
}

export default function Card({ children, className }: CardProps) {
    return (
        <div className={cn(
            'bg-white dark:bg-gray-800',
            'rounded-xl shadow-lg',
            'border border-gray-200 dark:border-gray-700',
            'p-6 sm:p-8',
            className
        )}>
            {children}
        </div>
    )
}
