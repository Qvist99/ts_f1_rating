"use client"
import { PostgrestSingleResponse } from "@supabase/supabase-js"
import { use } from "react"
import StandingsList from "./StandingsList"
import { useState } from "react"
import FilterPills from "./FilterPills"
import { RaceRatingStatsPromise } from "@/lib/types"


type RatingFilter = "average" | "last5" | "last3"


const filters: { label: string, value: RatingFilter }[] = [
    { label: "All season", value: "average" },
    { label: "Last 5", value: "last5" },
    { label: "Last 3", value: "last3" },
]


interface RaceRatingsProps {
    raceRatingStatsPromise: RaceRatingStatsPromise,
    lastFiveRacesPromise: PromiseLike<PostgrestSingleResponse<{ id: string }[]>>
}

export default function RaceRatings({ raceRatingStatsPromise, lastFiveRacesPromise }: RaceRatingsProps) {

    const [typeOfRating, setTypeOfRating] = useState<RatingFilter>("average")


    const { data: racesWithRatings, error: racesWithRatingsError } = use(raceRatingStatsPromise)
    const { data: lastFiveRaces, error: lastFiveRacesError } = use(lastFiveRacesPromise)

    if (racesWithRatingsError || lastFiveRacesError) {
        console.log(racesWithRatingsError || lastFiveRacesError)
        return <div></div>
    }

    const lastFiveRaceIds = lastFiveRaces.map(r => r.id)
    const lastThreeRaceIds = lastFiveRaceIds.slice(0, 3)

    const filteredRacesWithRatings = racesWithRatings.filter(r => {
        if (typeOfRating === "last5") return lastFiveRaceIds.includes(r.race_id || "")
        if (typeOfRating === "last3") return lastThreeRaceIds.includes(r.race_id || "")
        return true
    })

    const standingsListItems = filteredRacesWithRatings.map((race) => {
        const avgRating = race.avg_rating || 0
        const mainLabel = race.race_name || ""
        const subLabel = `Round ${race.round || ""}`
        return {
            position: 0,
            previous_position: 0,
            value: avgRating,
            mainLabel: mainLabel,
            hexColor: "#282D33",
            subLabel: subLabel,
        }
    })

    standingsListItems.sort((a, b) => b.value - a.value)
    standingsListItems.forEach((item, index) => {
        item.position = index + 1
    })



    return (
        <div>
            <FilterPills filters={filters} active={typeOfRating} onChange={setTypeOfRating} />
            <StandingsList items={standingsListItems} valueSuffix="/10" showRatingBar={true} showDelta={false} alwaysShowDecimal={true} />
        </div>
    )
}
