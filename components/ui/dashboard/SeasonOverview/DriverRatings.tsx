"use client"
import { DriversWithRatingsPromise } from "@/lib/types"
import { PostgrestSingleResponse } from "@supabase/supabase-js"
import { use } from "react"
import StandingsList from "./StandingsList"
import { getAverageRating } from "@/lib/averageRatings"
import { useState } from "react"
import FilterPills from "./FilterPills"

type RatingFilter = "average" | "last5" | "last3"


const filters: { label: string, value: RatingFilter }[] = [
    { label: "All season", value: "average" },
    { label: "Last 5", value: "last5" },
    { label: "Last 3", value: "last3" },
]


export default function DriverRatings({ driverWithRatingsPromise, lastFiveRacesPromise }: {
    driverWithRatingsPromise: DriversWithRatingsPromise
    lastFiveRacesPromise: PromiseLike<PostgrestSingleResponse<{ id: string }[]>>
}) {

    const [typeOfRating, setTypeOfRating] = useState<RatingFilter>("average")

    const { data: driversWithRatings, error: driversWithRatingsError } = use(driverWithRatingsPromise)
    const { data: lastFiveRaces, error: lastFiveRacesError } = use(lastFiveRacesPromise)

    if (driversWithRatingsError || lastFiveRacesError) {
        console.log(driversWithRatingsError || lastFiveRacesError)
        return <div></div>
    }

    const lastFiveRaceIds = lastFiveRaces.map(r => r.id)
    const lastThreeRaceIds = lastFiveRaceIds.slice(0, 3)


    const standingsListItems = driversWithRatings.map((driver) => {
        const filteredRatings = driver.driver_ratings.filter(r => {
            if (typeOfRating === "last5") return lastFiveRaceIds.includes(r.race_id)
            if (typeOfRating === "last3") return lastThreeRaceIds.includes(r.race_id)
            return true
        })

        const averageRating = getAverageRating(filteredRatings.map(r => r.rating))

        return {
            position: 0,
            previous_position: 0,
            value: averageRating,
            mainLabel: `${driver.first_name} ${driver.last_name}`,
            hexColor: `#${driver.team_color}`,
            subLabel: driver.team_name
        }
    })


    // Sort drivers by average rating in descending order and assign positions
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

