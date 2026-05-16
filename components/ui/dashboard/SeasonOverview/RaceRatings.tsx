"use client"
import { PostgrestSingleResponse } from "@supabase/supabase-js"
import { use } from "react"
import StandingsList from "./StandingsList"
import { getAverageRating } from "@/lib/averageRatings"
import { useState } from "react"
import FilterPills from "./FilterPills"
import { RacesWithRatings } from "@/lib/types"


type RatingFilter = "average" | "last5" | "last3"


const filters: { label: string, value: RatingFilter }[] = [
    { label: "All season", value: "average" },
    { label: "Last 5", value: "last5" },
    { label: "Last 3", value: "last3" },
]

export default function RaceRatings({ racesWithRatingsPromise, lastFiveRacesPromise }:
    {
        racesWithRatingsPromise: PromiseLike<PostgrestSingleResponse<RacesWithRatings[]>>,
        lastFiveRacesPromise: PromiseLike<PostgrestSingleResponse<{ id: string }[]>>
    }) {

    const [typeOfRating, setTypeOfRating] = useState<RatingFilter>("average")


    const { data: racesWithRatings, error: racesWithRatingsError } = use(racesWithRatingsPromise)
    const { data: lastFiveRaces, error: lastFiveRacesError } = use(lastFiveRacesPromise)

    if (racesWithRatingsError || lastFiveRacesError) {
        console.log(racesWithRatingsError || lastFiveRacesError)
        return <div></div>
    }

    const lastFiveRaceIds = lastFiveRaces.map(r => r.id)
    const lastThreeRaceIds = lastFiveRaceIds.slice(0, 3)

    const filteredRacesWithRatings = racesWithRatings.filter(r => {
        if (typeOfRating === "last5") return lastFiveRaceIds.includes(r.id)
        if (typeOfRating === "last3") return lastThreeRaceIds.includes(r.id)
        return true
    })

    const standingsListItems = filteredRacesWithRatings.map((race) => {
        const ratings = race.race_ratings.map(r => r.rating)
        const averageRating = getAverageRating(ratings)

        return {
            position: 0,
            previous_position: 0,
            value: averageRating,
            mainLabel: race.race_name,
            hexColor: "#282D33",
            subLabel: `Round ${race.round}`,
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
