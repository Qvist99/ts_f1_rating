import { Skeleton } from "@/components/ui/skeleton"

interface StandingsListSkeletonProps {
    rows?: number
    showRatingBar?: boolean
    showDelta?: boolean
}

export default function StandingsListSkeleton({ rows = 8, showRatingBar = false, showDelta = false }: StandingsListSkeletonProps) {
    return (
        <div>
            {Array.from({ length: rows }).map((_, index) => (
                <div
                    key={index}
                    className="flex items-center justify-between py-2 -mx-4 px-4 border-b border-border last:border-b-0"
                >
                    <div className="flex items-center gap-2 flex-1 min-w-0 mr-4">
                        <div className="flex items-center justify-center w-6.25">
                            <Skeleton className="h-4 w-4" />
                        </div>

                        <div className="flex gap-3 items-stretch flex-1 min-w-0">
                            <Skeleton className="w-1 rounded self-stretch" />

                            <div className="flex flex-col justify-center min-h-11 flex-1 min-w-0 gap-1.5">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-20" />
                                {showRatingBar && (
                                    <Skeleton className="w-full h-1 rounded mt-2" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between w-24 shrink-0">
                        <div className="flex items-center justify-center w-7.5">
                            {showDelta && <Skeleton className="h-4 w-8" />}
                        </div>
                        <div className="flex gap-1">
                            <Skeleton className="h-4 w-8" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}