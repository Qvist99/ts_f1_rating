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

    const driversPromise = supabase
        .from("drivers")
        .select("*")
        .eq("year", currentYear);

    const driversStatsPromise = supabase
        .from("driver_stats")
        .select("*")

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
                    { id: "Drivers", label: "Drivers", content: <DriverStandings driverStandingsPromise={driverStandingsPromise} driversPromise={driversPromise} /> },
                    { id: "Constructors", label: "Constructors", content: <ConstructorStandings constructorStandingsPromise={constructorStandingsPromise} driversPromise={driversPromise} /> },
                    { id: "Driver Ratings", label: "Driver Ratings", content: <DriverRatings driversPromise={driversPromise} driversStatsPromise={driversStatsPromise} /> },
                    { id: "Race Ratings", label: "Race Ratings", content: <RaceRatings raceRatingStatsPromise={raceRatingStatsPromise} lastFiveRacesPromise={lastFiveRacesPromise} /> },
                ]}
                defaultTab="Drivers"
            />
        </div>
    )
}
