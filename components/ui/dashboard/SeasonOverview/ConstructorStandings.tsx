import { ConstructorStandingsPromise, DriversWithStatsPromise } from "@/lib/types"
import { use } from "react"
import StandingsList from "./StandingsList"


interface ConstructorStandingsProps {
    constructorStandingsPromise: ConstructorStandingsPromise,
    driversWithStatsPromise: DriversWithStatsPromise
}

export default function ConstructorStandings({ constructorStandingsPromise, driversWithStatsPromise }: ConstructorStandingsProps) {

    const { data: constructorStandings, error: constructorStandingsError } = use(constructorStandingsPromise)
    const { data: driversWithStats, error: driversWithStatsError } = use(driversWithStatsPromise)

    if (constructorStandingsError || driversWithStatsError) {
        console.log(constructorStandingsError || driversWithStatsError)
        return <div></div>
    }


    const standingsListItems = constructorStandings?.standings.map((standing) => {
        // We need to find first driver with a matching team_name and take the color from the driver.
        const driverInfo = driversWithStats.find(driver => driver.team_name === standing.team_name)

        return {
            position: standing.position_current,
            previous_position: standing.position_start,
            value: standing.points_current,
            mainLabel: standing.team_name,
            hexColor: driverInfo ? `#${driverInfo.team_color}` : "#000000",
            subLabel: ""
        }
    }) || []




    return (
        <StandingsList items={standingsListItems} valueSuffix="pts" showRatingBar={false} showDelta={true} emptyStateText="No constructor standings available" />
    )
}
