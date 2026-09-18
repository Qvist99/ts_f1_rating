import { Skeleton } from "@/components/ui/skeleton";

export default function UsersDriverOpinionsSkeleton() {
    return (
        <div className="relative h-full flex flex-col gap-2">
            <div className="h-full flex gap-2">
                {/* DriverCard skeleton */}
                <div className="bg-card-bg border-2 border-card-border h-full w-[50%] rounded py-2 px-4 pb-17.5">
                    <div className="flex gap-2 items-center">
                        <Skeleton className="w-18.75 h-18.75 rounded-full shrink-0" />
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>

                    <div className="mt-2 flex gap-2">
                        <Skeleton className="h-6 w-10 rounded" />
                        <Skeleton className="h-6 w-20 rounded" />
                    </div>

                    <div className="my-3 border-t border-card-border" />

                    <div className="flex flex-col gap-1">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-6 w-full" />
                    </div>

                    <div className="my-3 border-t border-card-border" />

                    <div className="flex flex-col gap-1">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-16 w-full rounded" />
                    </div>
                </div>

                {/* FanCommentsCard skeleton */}
                <div className="bg-card-bg border-2 border-card-border h-full w-[50%] rounded py-2 pb-17.5 px-4 flex flex-col gap-2">
                    <Skeleton className="h-5 w-32" />
                    <div className="flex flex-col gap-2 flex-1">
                        <Skeleton className="h-16 w-full rounded" />
                        <Skeleton className="h-16 w-full rounded" />
                        <Skeleton className="h-16 w-full rounded" />
                    </div>
                </div>
            </div>

            {/* outer driver-pair pagination dots — always 5, matches Slider's own dot count logic */}
            <div className="flex justify-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="w-2.5 h-2.5 rounded-full" />
                ))}
            </div>
        </div>
    )

}
