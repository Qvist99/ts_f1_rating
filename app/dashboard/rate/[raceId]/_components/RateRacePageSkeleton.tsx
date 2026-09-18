import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

export default function RateRacePageSkeleton() {
    return (
        <>
            <HeaderSkeleton />
            <DriverGridSkeleton />
        </>
    )
}

function HeaderSkeleton() {
    return (
        <div className="flex flex-col border-b border-card-border -mx-36 px-36">
            <TopBarSkeleton />
            <BottomBarSkeleton />
        </div>
    )
}

function TopBarSkeleton() {
    return (
        <div className="h-14 flex justify-between items-center border-b-2 border-card-border -mx-36 px-36 bg-card-bg">
            <div className="flex gap-4 items-center">
                <Link href="/dashboard" className="text-text-muted border-2 border-card-border px-2 rounded hover:bg-card-border">Back</Link>
                <p className="font-condensed">Rate Drivers</p>
            </div>

            <div className="flex gap-4 items-center">
                <Skeleton className="h-4 w-16" /> {/* SavingState placeholder */}
                <Skeleton className="h-4 w-40" /> {/* race_name - Round n */}
            </div>
        </div>
    )
}

function BottomBarSkeleton() {
    return (
        <div className="flex items-center justify-between py-2">
            <div className="flex gap-4">
                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-[#f59e0b] mt-0.5" />
                        <p className="text-text-muted">Last session:</p>
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-56" /> {/* "Window closes ..." */}
                </div>
            </div>

            <div>
                <div className="flex">
                    <div className="text-xs px-3 py-1 border border-border rounded-l text-text-muted border-r-0">Opens at Race</div>
                    <div className="text-xs px-3 py-1 border border-red-800/40 bg-red-950/30 text-red-400">Race</div>
                    <div className="text-xs px-3 py-1 border border-border rounded-r text-text-muted border-l-0">+2 days post-race</div>
                </div>
            </div>
        </div>
    )
}

const DRIVER_CARD_COUNT = 20

function DriverGridSkeleton() {
    return (
        <div className="flex flex-col h-screen">
            <DriverGridHeaderSkeleton />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 overflow-y-auto flex-1 p-2 pb-50 content-start">
                {Array.from({ length: DRIVER_CARD_COUNT }).map((_, i) => (
                    <DriverGridCardSkeleton key={i} />
                ))}
            </div>

            <DriverGridFooterSkeleton />
        </div>
    )
}

function DriverGridHeaderSkeleton() {
    return (
        <div className="flex justify-between items-center py-2 border-b border-card-border -mx-36 px-36">
            <div>
                <input
                    type="text"
                    placeholder="Search for driver..."
                    disabled
                    className="bg-card-bg border-2 border-card-border rounded px-3 py-1.5 text-sm flex-1 outline-none disabled:opacity-60"
                />
            </div>

            <div className="flex items-center gap-4">
                <div className="w-32 h-1 bg-[#3E4248] rounded overflow-hidden mt-1" />
                <Skeleton className="h-4 w-32" /> {/* "N of 22 drivers rated" */}
            </div>
        </div>
    )
}



function DriverGridFooterSkeleton() {
    return (
        <div className="fixed bottom-0 w-full -mx-36 px-36 py-4 flex items-center gap-6 border-t border-card-border bg-card-bg">
            <div className="flex flex-col gap-0.5 min-w-32 shrink-0">
                <span className="text-[10px] text-[#3E4248] uppercase tracking-wider font-condensed">Rate the race</span>
                <Skeleton className="h-4 w-20" /> {/* country_name */}
                <Skeleton className="h-3 w-16" /> {/* Round n */}
            </div>

            <div className="w-px h-8 bg-card-border shrink-0" />

            <RatingButtonsSkeleton type="race" />
        </div>
    )
}



function DriverGridCardSkeleton() {
    return (
        <div className="p-5 flex flex-col gap-4 bg-card-bg border-l-2 border-l-transparent outline outline-card-border">
            {/* Driver info */}
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-4.25 w-32" /> {/* first_name last_name */}
                    <Skeleton className="h-3 w-20" />       {/* team_name */}
                </div>
                <Skeleton className="w-0.75 min-h-13 rounded" /> {/* team color bar */}
            </div>

            {/* Rating */}
            <RatingButtonsSkeleton type="driver" />
        </div>
    )
}


function RatingButtonsSkeleton({ type }: { type: "driver" | "race" }) {
    const ratingDisplay = (
        <span className="text-[28px] font-medium leading-none shrink-0 text-[#3E4248]">
            —
        </span>
    )

    const buttonGrid = (
        <div className="grid grid-cols-10 gap-1 flex-1">
            {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                <div
                    key={n}
                    className="py-2 rounded text-[13px] font-medium text-center bg-[#181c28] border border-card-border text-[#3E4248]"
                >
                    {n}
                </div>
            ))}
        </div>
    )

    if (type === "driver") {
        return (
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                    <span className="text-xs text-[#3E4248]">Your rating</span>
                    {ratingDisplay}
                </div>
                {buttonGrid}
            </div>
        )
    }

    return (
        <div className="flex items-center gap-6.25 flex-1">
            {ratingDisplay}
            {buttonGrid}
        </div>
    )
}