import { createClient } from "@/lib/supabase/server"
import Tabs from "../../Tabs";
import DriverStandings from "./DriverStandings";
import ConstructorStandings from "./ConstructorStandings";
import DriverRatings from "./DriverRatings";
import RaceRatings from "./RaceRatings";
import { DriverStandingFromApi, ConstructorStandingFromApi } from "@/lib/types";


export default async function SeasonOverviewPanel() {
    const supabase = await createClient();

    const currentYear = new Date().getFullYear()
    const currentDate = new Date().toISOString()


    const lastFiveRacesPromise = supabase
        .from("races")
        .select("id")
        .lte("date_end", currentDate)
        .eq("is_cancelled", false)
        .order("date_end", { ascending: false })
        .limit(5)

    const driversWithStatsPromise = supabase
        .from("drivers")
        .select("*, driver_stats(*)")
        .eq("year", currentYear);

    // need to watch the db function for this one that we only get race ratings for this year otherwise we might get ratings from previous years in the list
    const raceRatingStatsPromise = supabase
        .from("race_rating_stats")
        .select("*");

    const driverStandingsPromise = fetch("https://api.openf1.org/v1/championship_drivers?session_key=latest&meeting_key=latest", {
        next: {
            revalidate: 1800
        }
    }).then(res => {
        if (!res.ok) return []
        return res.json()
    }).catch(() => []) as Promise<DriverStandingFromApi[]>

    const constructorStandingsPromise = fetch("https://api.openf1.org/v1/championship_teams?session_key=latest&meeting_key=latest", {
        next: {
            revalidate: 1800
        }
    }).then(res => {
        if (!res.ok) return []
        return res.json()
    }).catch(() => []) as Promise<ConstructorStandingFromApi[]>

    return (
        <div className="h-full overflow-hidden">
            <Tabs
                tabs={[
                    { id: "Drivers", label: "Drivers", content: <DriverStandings driverStandingsPromise={driverStandingsPromise} driversWithStatsPromise={driversWithStatsPromise} /> },
                    { id: "Constructors", label: "Constructors", content: <ConstructorStandings constructorStandingsPromise={constructorStandingsPromise} driversWithStatsPromise={driversWithStatsPromise} /> },
                    { id: "Driver Ratings", label: "Driver Ratings", content: <DriverRatings driverWithStatsPromise={driversWithStatsPromise} /> },
                    { id: "Race Ratings", label: "Race Ratings", content: <RaceRatings raceRatingStatsPromise={raceRatingStatsPromise} lastFiveRacesPromise={lastFiveRacesPromise} /> },
                ]}
                defaultTab="Drivers"
            />
        </div>
    )
}
