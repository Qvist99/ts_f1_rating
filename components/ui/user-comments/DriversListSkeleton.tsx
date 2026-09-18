import { Skeleton } from "@/components/ui/skeleton"

const ROW_COUNT = 8

export default function DriversListSkeleton() {
    return (
        <div>
            {/* Mirrors FilterBar */}
            <div className="mb-4">
                <Skeleton className="h-14 -mx-36 px-36 rounded-none" />
            </div>


            <div className="overflow-scroll h-screen pb-40">
                {Array.from({ length: ROW_COUNT }).map((_, i) => (
                    <DriverCardRowSkeleton key={i} />
                ))}
            </div>
        </div>
    )
}

function DriverCardRowSkeleton() {
    return (
        <div className="flex flex-col border-b border-border">
            <div className="flex py-2.5 justify-between w-full items-center h-21.25">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12.5 w-12.5 rounded-full" />
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-5 w-32" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-2 w-2 rounded-full" />
                            <Skeleton className="h-3 w-28" />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-14">
                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-10 rounded" />
                        <Skeleton className="h-6 w-10 rounded" />
                        <Skeleton className="h-6 w-24 rounded" />
                    </div>
                    <div className="flex gap-2 items-center">
                        <Skeleton className="h-6 w-10 rounded" />
                        <Skeleton className="h-5 w-5 rounded" />
                    </div>
                </div>
            </div>
        </div>
    )
}