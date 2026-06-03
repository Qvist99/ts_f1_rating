import Navbar from "@/components/ui/user-comments/Navbar"
import DriversList from "@/components/ui/user-comments/DriversList"
import { UserProfile } from "@/lib/types"
import { getDriversBySeason, getDriverStats } from "@/lib/supabase/queries/drivers"
import { getUser } from "@/lib/supabase/queries/auth"
import { getProfileByUserId } from "@/lib/supabase/queries/profiles"

export default async function page() {
    const { data: { user } } = await getUser();

    const currentYear = new Date().getFullYear()

    let profile: UserProfile | null = null

    if (user) {
        const { data: profileData, error } = await getProfileByUserId(user.id);

        if (error) {
            console.error("Error fetching profile:", error);

            // fallback to a default profile as profileData should always exist if the user is authenticated
            profile = {
                id: user.id,
                display_name: user.email || "Unknown User",
                email: user.email || null,
                deletion_requested_at: null,
                updated_at: new Date().toISOString(),
            }
        } else {
            profile = profileData
        }
    }

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
        <div>
            <Navbar user={profile} />
            <DriversList drivers={driversWithStats} user={profile} />
        </div>
    )
}
