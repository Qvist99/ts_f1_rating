import { createClient } from "@/lib/supabase/server"
import Tabs from "../../Tabs";
import DriverStandings from "./DriverStandings";
import ConstructorStandings from "./ConstructorStandings";
import DriverRatings from "./DriverRatings";
import RaceRatings from "./RaceRatings";

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


    const raceRatingStatsPromise = supabase
        .from("race_rating_stats")
        .select("*");


    const driverStandingsPromise = supabase
        .from("driver_standings")
        .select("standings")
        .eq("year", currentYear)
        .maybeSingle();

    const constructorStandingsPromise = supabase
        .from("constructor_standings")
        .select("standings")
        .eq("year", currentYear)
        .maybeSingle();

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
