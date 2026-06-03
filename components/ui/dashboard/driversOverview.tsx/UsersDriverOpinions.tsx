import Slider from "@/components/ui/Slider";
import DriverCard from "./DriverCard";
import FanCommentsCard from "./FanCommentsCard";

import { getDriversWithComments, getDriversByIds } from "@/lib/supabase/queries/drivers"
import { connection } from "next/server";
export default async function UsersDriverOpinions() {
    await connection();
    const currentYear = new Date().getFullYear()

    const { data: drivers, error: driversError } = await getDriversWithComments(currentYear, 15);


    if (driversError) {
        console.error("Error fetching drivers:", driversError);
        return <div>Error loading driver opinions.</div>;
    }

    const fiveRandomDrivers = drivers.sort(() => 0.5 - Math.random()).slice(0, 5);

    const randomDriverIds = fiveRandomDrivers.map(driver => driver.id);

    const { data: driverStats, error: driverStatsError } = await getDriversByIds(randomDriverIds);

    if (driverStatsError) {
        console.error("Error fetching driver stats:", driverStatsError);
        return <div>Error loading driver opinions.</div>;
    }

    const fiveRandomDriversWithStats = fiveRandomDrivers.map(driver => {
        const stats = driverStats.find(stat => stat.driver_id === driver.id)!;
        return { ...driver, driver_stats: stats };
    });


    return (

        <Slider
            pages={fiveRandomDriversWithStats.map(driver => (
                <div className="h-full flex gap-2">
                    <div className="bg-card-bg border-2 border-card-border h-full w-[50%] rounded ">
                        <DriverCard driver={driver} />
                    </div>
                    <div className="bg-card-bg border-2 border-card-border h-full w-[50%] rounded ">
                        <FanCommentsCard driver={driver} />
                    </div>
                </div>
            ))}
        />

    )
}