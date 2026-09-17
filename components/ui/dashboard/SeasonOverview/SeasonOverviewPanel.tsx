import Tabs from "../../Tabs";
import DriverStandings from "./DriverStandings";
import ConstructorStandings from "./ConstructorStandings";
import DriverRatings from "./DriverRatings";
import RaceRatings from "./RaceRatings";
import { getLastFiveRaces, getRaceRatingStats } from "@/lib/supabase/queries/races";
import { getDriversBySeason, getDriverStats } from "@/lib/supabase/queries/drivers"
import { getDriverStandingsBySeason, getConstructorStandingsBySeason } from "@/lib/supabase/queries/standings"
import { connection } from "next/server";
import StandingsListSkeleton from "./StandingsListSkeleton";
import { Suspense } from "react";
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
                    {
                        id: "Drivers",
                        label: "Drivers",
                        content: (
                            <Suspense fallback={<StandingsListSkeleton rows={12} showDelta />}>
                                <DriverStandings driverStandingsPromise={driverStandingsPromise} driversPromise={driversPromise} />
                            </Suspense>
                        )
                    },
                    {
                        id: "Constructors",
                        label: "Constructors",
                        content: (
                            <Suspense fallback={<StandingsListSkeleton rows={12} showDelta />}>
                                <ConstructorStandings constructorStandingsPromise={constructorStandingsPromise} driversPromise={driversPromise} />
                            </Suspense>
                        )
                    },
                    {
                        id: "Driver Ratings", label: "Driver Ratings", content: (
                            <Suspense fallback={<StandingsListSkeleton rows={11} showRatingBar />}>
                                <DriverRatings driversPromise={driversPromise} driversStatsPromise={driversStatsPromise} />
                            </Suspense>
                        )
                    },
                    {
                        id: "Race Ratings", label: "Race Ratings", content: (
                            <Suspense fallback={<StandingsListSkeleton rows={11} showRatingBar />}>
                                <RaceRatings raceRatingStatsPromise={raceRatingStatsPromise} lastFiveRacesPromise={lastFiveRacesPromise} />
                            </Suspense>
                        )
                    },
                ]}
                defaultTab="Drivers"
            />
        </div>
    )
}
