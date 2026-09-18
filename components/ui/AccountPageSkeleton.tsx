import { Skeleton } from "@/components/ui/skeleton"

export default function AccountPageSkeleton() {
    return (
        <div className="flex flex-col gap-4.5 mt-2 w-full">
            <div className="flex gap-4 w-full">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="flex flex-col gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-48" />
                </div>
            </div>
            <Separator />

            <div className="flex flex-col gap-10 w-full">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-24 w-full rounded-2xl" />
                </div>
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-12 w-full rounded-2xl" />
                </div>
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-16 w-full rounded-2xl" />
                </div>
            </div>


        </div>
    )
}


function Separator() {
    return <div className="w-full h-px bg-card-border mb-4" />
}