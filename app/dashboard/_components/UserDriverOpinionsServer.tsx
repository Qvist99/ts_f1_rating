import UsersDriverOpinions from '@/components/ui/dashboard/driversOverview/UsersDriverOpinions'
import { getDriversWithComments, getDriversWithStatsByIds } from "@/lib/supabase/queries/drivers"
import { getRaceSummary } from "@/lib/supabase/queries/races";
import { connection } from "next/server";


export default async function UserDriverOpinionsServer() {
    await connection();
    const currentYear = new Date().getFullYear()

    const { data: drivers, error: driversError } = await getDriversWithComments(currentYear, 15);

    if (driversError) {
        console.error("Error fetching drivers:", driversError);
        return <div>Error loading driver opinions.</div>;
    }

    const fiveRandomDrivers = drivers.sort(() => 0.5 - Math.random()).slice(0, 5);
    const randomDriverIds = fiveRandomDrivers.map(driver => driver.id);


    const { data: driverStats, error: driverStatsError } = await getDriversWithStatsByIds(randomDriverIds);

    if (driverStatsError) {
        console.error("Error fetching driver stats:", driverStatsError);
        return <div>Error loading driver opinions.</div>;
    }

    const fiveRandomDriversWithStats = fiveRandomDrivers.map(driver => {
        const stats = driverStats.find(stat => stat.driver_id === driver.id)!;
        return { ...driver, driver_stats: stats };
    });

    //Get the race summary of the best race for each driver
    const raceSummaries = await Promise.all(
        fiveRandomDriversWithStats.map(driver => {
            const raceId = driver.driver_stats.best_round_race_id
            return raceId ? getRaceSummary(raceId) : Promise.resolve({ data: null, error: null })
        })
    )

    const fiveRandomDriversWithStatsAndRace = fiveRandomDriversWithStats.map((driver, i) => ({
        ...driver,
        best_race: raceSummaries[i].data,
    }))



    return <UsersDriverOpinions driversWithStatsAndRace={fiveRandomDriversWithStatsAndRace} />
}