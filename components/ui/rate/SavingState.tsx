"use client"
import { useRatingStore } from "@/components/providers/RatingsProvider"
import Spinner from "../Spinner"

export default function SavingState() {

    const pendingCount = useRatingStore((state) => state.pendingCount)

    return (
        <div className="text-sm text-text-muted">
            {pendingCount > 0 ? (
                <div className="flex items-center gap-2">
                    <Spinner className="h-3 w-3 mt-0.5" />
                    <p className="">Saving...</p>
                </div>
            ) : (
                <p className="">Auto-saved</p>
            )}
        </div>
    )
}
