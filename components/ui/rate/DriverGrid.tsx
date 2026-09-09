"use client"
import { useRatingStore } from "@/components/providers/RatingsProvider"
import { DriverWithRatings, RaceWithRatings } from "@/lib/types"
import { useEffect, useState } from "react"
import DriverGridCard from "./DriverGridCard"
import DriverGridFooter from "./DriverGridFooter"

export default function DriverGrid({ drivers, race }: { drivers: DriverWithRatings[], race: RaceWithRatings }) {
    const setRatedDriverCount = useRatingStore((state) => state.setRatedDriverCount)
    const [search, setSearch] = useState("");

    useEffect(() => {
        const initialCount = drivers.filter(driver => driver.driver_ratings.length > 0).length
        setRatedDriverCount(initialCount)
    }, [])

    // Sort drivers by team and then filter by the search value from driverGridHeader searchbar
    let sortedDrivers = [...drivers].sort((a, b) => {
        if (a.team_name < b.team_name) return -1
        if (a.team_name > b.team_name) return 1
        return 0
    });

    if (search) {
        sortedDrivers = sortedDrivers.filter(driver =>
            `${driver.first_name} ${driver.last_name}`.toLowerCase().includes(search.toLowerCase())
        )
    }


    return (
        <div className="flex flex-col h-screen ">
            <DriverGridHeader search={search} onSearch={setSearch} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 overflow-y-auto flex-1 p-2 pb-50 content-start
        [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-card-border
        [&::-webkit-scrollbar-thumb]:rounded">
                {sortedDrivers.map((driver) => (
                    <DriverGridCard key={driver.id} driver={driver} race={race} />
                ))}
            </div>
            <DriverGridFooter race={race} />
        </div>

    )
}

// We realy need to make the ratingBar an component at some point

function DriverGridHeader({ search, onSearch }: { search: string, onSearch: (value: string) => void }) {
    const ratedDriverCount = useRatingStore((state) => state.ratedDriverCount)
    const percentage = (ratedDriverCount / 22) * 100

    return (
        <div className="flex justify-between items-center py-2 border-b border-card-border -mx-36 px-36">
            <div>
                <input
                    type="text"
                    placeholder="Search for driver..."
                    value={search}
                    onChange={e => onSearch(e.target.value)}
                    className="bg-card-bg border-2 border-card-border rounded px-3 py-1.5 text-sm flex-1 outline-none"
                />
            </div>

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




