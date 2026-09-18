
interface CardProps {
    children: React.ReactNode
    hasBorder?: boolean
    applyPadding?: boolean
    className?: string
}

const cardClass = `rounded-md w-full h-full border-border`

export default function Card({ children, hasBorder = true, applyPadding = true, className = "" }: CardProps) {
    return (
        <div className={`${cardClass} ${hasBorder ? 'border-2' : 'border-0'} ${applyPadding ? 'py-2 px-4' : ''} ${className}`}>
            {children}
        </div>
    )
}
