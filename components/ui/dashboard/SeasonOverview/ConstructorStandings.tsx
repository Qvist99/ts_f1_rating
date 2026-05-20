import { ConstructorStandingFromApi, DriversWithStatsPromise } from "@/lib/types"
import { use } from "react"
import StandingsList from "./StandingsList"


interface ConstructorStandingsProps {
    constructorStandingsPromise: Promise<ConstructorStandingFromApi[]>,
    driversWithStatsPromise: DriversWithStatsPromise
}

export default function ConstructorStandings({ constructorStandingsPromise, driversWithStatsPromise }: ConstructorStandingsProps) {

    const constructorStandings = use(constructorStandingsPromise)
    const { data: driversWithStats, error } = use(driversWithStatsPromise)

    if (error) {
        console.log(error)
        return <div></div>
    }


    const standingsListItems = constructorStandings.map((standing) => {
        // We need to find first driver with a matching team_name and take the color from the driver.
        const driverInfo = driversWithStats?.find(driver => driver.team_name === standing.team_name)

        return {
            position: standing.position_current,
            previous_position: standing.position_start,
            value: standing.points_current,
            mainLabel: standing.team_name,
            hexColor: driverInfo ? `#${driverInfo.team_color}` : "#000000",
            subLabel: ""
        }
    })




    return (
        <StandingsList items={standingsListItems} valueSuffix="pts" showRatingBar={false} showDelta={true} />
    )
}
