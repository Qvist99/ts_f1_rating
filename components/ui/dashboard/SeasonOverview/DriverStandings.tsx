
import { DriverStandingFromApi, DriverWithRatings } from "@/lib/types"
import { PostgrestSingleResponse } from "@supabase/supabase-js"
import { use } from "react"
import StandingsList from "./StandingsList"



export default function DriverStandings({ driverStandingsPromise, driversWithRatingsPromise }: {
    driverStandingsPromise: Promise<DriverStandingFromApi[]>,
    driversWithRatingsPromise: PromiseLike<PostgrestSingleResponse<DriverWithRatings[]>>
}) {

    const driverStandings = use(driverStandingsPromise)
    const { data: driversWithRatings, error } = use(driversWithRatingsPromise)

    if (error) {
        console.log(error)
        return <div></div>
    }

    const standingsListItems = driverStandings.map((standing) => {
        const driverInfo = driversWithRatings?.find(driver => driver.driver_number === standing.driver_number)

        return {
            position: standing.position_current,
            previous_position: standing.position_start,
            value: standing.points_current,
            mainLabel: driverInfo ? `${driverInfo.first_name} ${driverInfo.last_name}` : `Driver ${standing.driver_number}`,
            hexColor: driverInfo ? `#${driverInfo.team_color}` : "#000000",
            subLabel: driverInfo ? driverInfo?.team_name : ""
        }
    })


    return (
        <StandingsList items={standingsListItems} valueSuffix="pts" showRatingBar={false} showDelta={true} />
    )
}
