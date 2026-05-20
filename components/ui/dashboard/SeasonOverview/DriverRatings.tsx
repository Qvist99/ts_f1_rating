"use client"
import { DriversWithStatsPromise } from "@/lib/types"
import { use } from "react"
import StandingsList from "./StandingsList"
import { useState } from "react"
import FilterPills from "./FilterPills"

type RatingFilter = "average" | "last5" | "last3"


const filters: { label: string, value: RatingFilter }[] = [
    { label: "All season", value: "average" },
    { label: "Last 5", value: "last5" },
    { label: "Last 3", value: "last3" },
]

interface DriverWithRatingsProps {
    driverWithStatsPromise: DriversWithStatsPromise,
}


export default function DriverRatings({ driverWithStatsPromise }: DriverWithRatingsProps) {

    const [typeOfRating, setTypeOfRating] = useState<RatingFilter>("average")

    const { data: driversWithStats, error: driversWithStatsError } = use(driverWithStatsPromise)

    if (driversWithStatsError) {
        console.error("Error fetching driver stats:", driversWithStatsError)
        return <div></div>
    }

    // Make sure we only render drivers that have stats.
    const standingsListItems = driversWithStats
        .map((driver) => {
            const stats = driver.driver_stats?.[0]

            if (!stats) return null

            const averageRating =
                typeOfRating === "average"
                    ? stats.avg_rating_season
                    : typeOfRating === "last5"
                        ? stats.avg_rating_last_5
                        : stats.avg_rating_last_3

            // Skip drivers without the selected rating
            if (averageRating == null) return null

            return {
                position: 0,
                previous_position: 0,
                value: averageRating,
                mainLabel: `${driver.first_name} ${driver.last_name}`,
                hexColor: `#${driver.team_color}`,
                subLabel: driver.team_name
            }
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)


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

