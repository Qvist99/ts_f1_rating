"use client"
import { useRatingStore } from "@/components/providers/RatingsProvider"
import { DriverWithRatings, RaceWithRatings } from "@/lib/types"
import { useEffect } from "react"
import DriverGridCard from "./DriverGridCard"
import DriverGridFooter from "./DriverGridFooter"

export default function DriverGrid({ drivers, race }: { drivers: DriverWithRatings[], race: RaceWithRatings }) {
    const setRatedDriverCount = useRatingStore((state) => state.setRatedDriverCount)

    useEffect(() => {
        const initialCount = drivers.filter(driver => driver.driver_ratings.length > 0).length
        setRatedDriverCount(initialCount)
    }, [])


    return (
        <div className="flex flex-col h-screen ">
            <DriverGridHeader />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 overflow-y-auto flex-1 pr-2 pb-50
        [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-card-border
        [&::-webkit-scrollbar-thumb]:rounded">
                {drivers.map((driver) => (
                    <DriverGridCard key={driver.id} driver={driver} race={race} />
                ))}
            </div>
            <DriverGridFooter race={race} />
        </div>

    )
}

// We realy need to make the ratingBar an component at some point

function DriverGridHeader() {
    const ratedDriverCount = useRatingStore((state) => state.ratedDriverCount)
    const percentage = (ratedDriverCount / 22) * 100


    return (
        <div className="flex justify-between items-center py-2 border-b border-card-border -mx-36 px-36">
            <p className="text-text-muted font-condensed">Rate the drivers</p>

            <div className="flex items-center gap-4">
                <div className="w-32 h-1 bg-[#3E4248] rounded overflow-hidden mt-1">
                    <div
                        className="h-full rounded bg-[#e10600] transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <p className="font-condensed text-text-muted tabular-nums">
                    {ratedDriverCount} <span className="text-text-muted">of 22 drivers rated</span>
                </p>
            </div>
        </div>
    )
}




