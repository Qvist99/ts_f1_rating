import { ConstructorStandingFromApi, DriverWithRatings, DriversWithRatingsPromise } from "@/lib/types"
import { use } from "react"
import StandingsList from "./StandingsList"


export default function ConstructorStandings({ constructorStandingsPromise, driversWithRatingsPromise }: {
    constructorStandingsPromise: Promise<ConstructorStandingFromApi[]>,
    driversWithRatingsPromise: DriversWithRatingsPromise
}) {

    const constructorStandings = use(constructorStandingsPromise)
    const { data: driversWithRatings, error } = use(driversWithRatingsPromise)

    if (error) {
        console.log(error)
        return <div></div>
    }


    const standingsListItems = constructorStandings.map((standing) => {
        // We need to find first driver with a matching team_name and take the color from the driver.
        const driverInfo = driversWithRatings?.find(driver => driver.team_name === standing.team_name)

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
