import { ConstructorStandingsPromise, DriversPromise } from "@/lib/types"
import { use } from "react"
import StandingsList from "./StandingsList"


interface ConstructorStandingsProps {
    constructorStandingsPromise: ConstructorStandingsPromise,
    driversPromise: DriversPromise
}

export default function ConstructorStandings({ constructorStandingsPromise, driversPromise }: ConstructorStandingsProps) {

    const { data: constructorStandings, error: constructorStandingsError } = use(constructorStandingsPromise)
    const { data: drivers, error: driversError } = use(driversPromise)

    if (constructorStandingsError || driversError) {
        console.log(constructorStandingsError || driversError)
        return <div></div>
    }


    const standingsListItems = constructorStandings?.standings.map((standing) => {
        // We need to find first driver with a matching team_name and take the color from the driver.
        const driverInfo = drivers.find(driver => driver.team_name === standing.team_name)

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
