
import { DriverStandingsPromise, DriversWithStatsPromise } from "@/lib/types"
import { use } from "react"
import StandingsList from "./StandingsList"

interface DriverStandingsProps {
    driverStandingsPromise: DriverStandingsPromise,
    driversWithStatsPromise: DriversWithStatsPromise
}

export default function DriverStandings({ driverStandingsPromise, driversWithStatsPromise }: DriverStandingsProps) {

    const { data: driverStandings, error: driverStandingsError } = use(driverStandingsPromise)
    const { data: driversWithStats, error: driversWithStatsError } = use(driversWithStatsPromise)




    if (driverStandingsError || driversWithStatsError) {
        console.log(driverStandingsError || driversWithStatsError)
        return <div></div>
    }

    const standingsListItems = driverStandings?.standings.map((standing) => {
        const driverInfo = driversWithStats?.find(driver => driver.driver_number === standing.driver_number)

        return {
            position: standing.position_current,
            previous_position: standing.position_start,
            value: standing.points_current,
            mainLabel: driverInfo ? `${driverInfo.first_name} ${driverInfo.last_name}` : `Driver ${standing.driver_number}`,
            hexColor: driverInfo ? `#${driverInfo.team_color}` : "#000000",
            subLabel: driverInfo ? driverInfo?.team_name : ""
        }
    }) || []


    return (
        <StandingsList items={standingsListItems} valueSuffix="pts" showRatingBar={false} showDelta={true} emptyStateText="No driver standings available" />
    )
}
