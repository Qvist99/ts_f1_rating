import { Suspense } from "react"
import Spinner from "./Spinner"
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