import { createClient } from "@/lib/supabase/server"
import Slider from "../Slider";
import DriverCard from "../DriverCard";
import FanCommentsCard from "../FanCommentsCard";
export default async function UsersDriverOpinions() {
    const supabase = await createClient();
    const currentYear = new Date().getFullYear()

    const { data: drivers, error: driversError } = await supabase
        .from("drivers")
        .select("*, driver_comments(*)")
        .eq("year", currentYear)
        .limit(15, { referencedTable: "driver_comments" })

    if (driversError) {
        console.error("Error fetching drivers:", driversError);
        return <div>Error loading driver opinions.</div>;
    }

    const fiveRandomDrivers = drivers.sort(() => 0.5 - Math.random()).slice(0, 5);

    const randomDriverIds = fiveRandomDrivers.map(driver => driver.id);

    const { data: driverStats, error: driverStatsError } = await supabase
        .from("driver_stats")
        .select("*")
        .in("driver_id", randomDriverIds)

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