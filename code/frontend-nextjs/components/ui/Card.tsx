import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
    children: ReactNode
    className?: string
}

export default function Card({ children, className }: CardProps) {
    return (
        <div className={cn('bg-white rounded-xl shadow-lg p-8', className)}>
            {children}
        </div>
    )
}
