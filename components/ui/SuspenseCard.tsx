import { Suspense } from "react"

const cardClass = `rounded-md w-full h-full border-border`

export default function SuspenseCard({ children, height, hasBorder = true, applyPadding = true }: { children: React.ReactNode, height?: number, hasBorder?: boolean, applyPadding?: boolean }) {
    return (
        <Suspense fallback={<Loading height={height} />}>
            <div className={`${cardClass} ${hasBorder ? 'border-2' : 'border-0'} ${applyPadding ? 'py-2 px-4' : ''}`} style={{ minHeight: height ? `${height}px` : 'fit-content' }}>
                {children}
            </div>
        </Suspense>
    )
}


function Loading({ height }: { height?: number }) {
    return (
        <div className={`${cardClass} py-2 px-4 border-2 flex justify-center items-center`} style={{ minHeight: height ? `${height}px` : 'fit-content' }}>
            <Spinner />
        </div>
    )
}


function Spinner() {
    return (
        <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    )
}
