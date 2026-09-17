import { Skeleton } from '@/components/ui/skeleton'

export default function NextRaceWeekendSkeleton() {
    return (
        <div className="h-full flex flex-col py-1 px-4">
            {/* top row: flag + title/subtitle, circuit image */}
            <div className="flex justify-between mb-3">
                <div className="flex gap-4 items-center">
                    <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-28" />
                    </div>
                </div>
                <Skeleton className="w-17.5 h-10" />
            </div>

            {/* Schedule and weather panel */}
            <div className="flex justify-between gap-4 border-t border-b border-card-border -mx-4 px-4 py-2">
                <div className="flex flex-col gap-2 flex-1">
                    <Skeleton className="h-4 w-24" /> {/* "NEXT UP" label */}
                    <Skeleton className="h-6 w-32" /> {/* countdown */}
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
                <div className="flex w-[30%]">
                    <Skeleton className="h-full w-full" />
                </div>
            </div>

            {/* Footer row: date + rate button */}
            <div className="flex justify-between items-center mt-4">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-9 w-32 rounded-md" />
            </div>
        </div>
    )
}