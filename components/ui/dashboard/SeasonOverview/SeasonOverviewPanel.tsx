import Tabs from "../../Tabs";
import DriverStandings from "./DriverStandings";
import ConstructorStandings from "./ConstructorStandings";
import DriverRatings from "./DriverRatings";
import RaceRatings from "./RaceRatings";
import { getLastFiveRaces, getRaceRatingStats } from "@/lib/supabase/queries/races";
import { getDriversBySeason, getDriverStats } from "@/lib/supabase/queries/drivers"
import { getDriverStandingsBySeason, getConstructorStandingsBySeason } from "@/lib/supabase/queries/standings"
import { connection } from "next/server";
export default async function SeasonOverviewPanel() {
    await connection();
    const currentYear = new Date().getFullYear()

    const lastFiveRacesPromise = getLastFiveRaces();

    const driversPromise = getDriversBySeason(currentYear);

    const driversStatsPromise = getDriverStats();

    const raceRatingStatsPromise = getRaceRatingStats();


    const driverStandingsPromise = getDriverStandingsBySeason(currentYear);

    const constructorStandingsPromise = getConstructorStandingsBySeason(currentYear);

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
