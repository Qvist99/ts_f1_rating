import { getDriversBySeason, getDriverStats } from "@/lib/supabase/queries/drivers"
import DriversList from "@/components/ui/user-comments/DriversList"
import { getUser } from "@/lib/supabase/queries/auth";
import { getProfileDeafult } from "@/lib/supabase/queries/profiles"
export default async function DriversListServer() {
    const { data: { user } } = await getUser();
    const profile = user ? await getProfileDeafult(user) : null;

    const currentYear = new Date().getFullYear()

    const { data: drivers, error: driversError } = await getDriversBySeason(currentYear);

    if (driversError) {
        console.error(driversError);
        return <div>Error loading drivers</div>;
    }

    const { data: driverStats, error: driverStatsError } = await getDriverStats();


    // Better empty state in the future
    if (driverStatsError) {
        console.error(driverStatsError);
        return <div>Error loading driver stats</div>;
    }

    const driversWithStats = drivers.map(driver => {
        const stats = driverStats.find(stat => stat.driver_id === driver.id)!; // We know every driver has stats as they are created at the same time, so this is safe to do for now, but should be handled better in the future
        return { ...driver, driver_stats: stats };
    });

    return (
        <>
            <DriversList drivers={driversWithStats} user={profile} />
        </>
    )
}