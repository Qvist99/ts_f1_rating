import Navbar from "@/components/ui/user-comments/Navbar"
import DriversList from "@/components/ui/user-comments/DriversList"
import { createClient } from "@/lib/supabase/server"

export default async function page() {
    const supabase = await createClient();
    const currentYear = new Date().getFullYear()

    const { data: drivers, error: driversError } = await supabase
        .from("drivers")
        .select("*")
        .eq("year", currentYear)

    if (driversError) {
        console.error(driversError);
        return <div>Error loading drivers</div>;
    }

    const { data: driverStats, error: driverStatsError } = await supabase
        .from("driver_stats")
        .select("*")


    // Better empty state in the future
    if (driverStatsError) {
        console.error(driverStatsError);
        return <div>Error loading driver stats</div>;
    }

    const driversWithStats = drivers.map(driver => {
        const stats = driverStats.find(stat => stat.driver_id === driver.id)!;
        return { ...driver, driver_stats: stats };
    });



    return (
        <div>
            <Navbar />
            <DriversList drivers={driversWithStats} />
        </div>
    )
}
