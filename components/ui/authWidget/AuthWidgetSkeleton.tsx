import { Skeleton } from "@/components/ui/skeleton"

export default function AuthWidgetSkeleton() {
    return (
        <div className="flex items-center gap-4">
            <Skeleton className="w-7 h-7 rounded-full" />
        </div>
    )
}