import { Skeleton } from "@/components/ui/skeleton"
import StandingsListSkeleton from "./StandingsListSkeleton"

export function SeasonOverviewPanelSkeleton() {
    return (
        <div className="h-full overflow-hidden">
            <div className="flex justify-between border-b border-border w-full px-4">
                {["Drivers", "Constructors", "Driver Ratings", "Race Ratings"].map((label) => (
                    <div key={label} className="px-2 py-4">
                        <Skeleton className="h-4 w-16" />
                    </div>
                ))}
            </div>
            <div className="px-4 pt-2">
                <StandingsListSkeleton showDelta />
            </div>
        </div>
    )
}