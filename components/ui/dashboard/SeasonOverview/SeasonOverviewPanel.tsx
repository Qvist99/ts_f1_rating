import { createClient } from "@/lib/supabase/server"
import Tabs from "../../Tabs";
import DriverStandings from "./DriverStandings";
import ConstructorStandings from "./ConstructorStandings";
import DriverRatings from "./DriverRatings";
import RaceRatings from "./RaceRatings";
import { DriverStandingFromApi, ConstructorStandingFromApi } from "@/lib/types";


export default async function SeasonOverviewPanel() {
    const supabase = await createClient();

    const currentDate = new Date().toISOString()


    const lastFiveRacesPromise = supabase
        .from("races")
        .select("id")
        .lte("date_end", currentDate)
        .eq("is_cancelled", false)
        .order("date_end", { ascending: false })
        .limit(5)

    const driversWithRatingsPromise = supabase.from("drivers").select("*, driver_ratings(race_id, rating)")

    const racesWithRatingsPromise = supabase.from("races").select("*, race_ratings(rating)")

    const driverStandingsPromise = fetch("https://api.openf1.org/v1/championship_drivers?session_key=latest&meeting_key=latest", {
        next: {
            revalidate: 1800
        }
    }).then(res => res.json()) as Promise<DriverStandingFromApi[]>

    const constructorStandingsPromise = fetch("https://api.openf1.org/v1/championship_teams?session_key=latest&meeting_key=latest", {
        next: {
            revalidate: 1800
        }
    }).then(res => res.json()) as Promise<ConstructorStandingFromApi[]>

    return (
        <div className="h-full overflow-hidden">
            <Tabs
                tabs={[
                    { id: "Drivers", label: "Drivers", content: <DriverStandings driverStandingsPromise={driverStandingsPromise} driversWithRatingsPromise={driversWithRatingsPromise} /> },
                    { id: "Constructors", label: "Constructors", content: <ConstructorStandings constructorStandingsPromise={constructorStandingsPromise} driversWithRatingsPromise={driversWithRatingsPromise} /> },
                    { id: "Driver Ratings", label: "Driver Ratings", content: <DriverRatings driverWithRatingsPromise={driversWithRatingsPromise} lastFiveRacesPromise={lastFiveRacesPromise} /> },
                    { id: "Race Ratings", label: "Race Ratings", content: <RaceRatings racesWithRatingsPromise={racesWithRatingsPromise} lastFiveRacesPromise={lastFiveRacesPromise} /> },
                ]}
                defaultTab="Drivers"
            />
        </div>
    )
}
