import Navbar from "@/components/ui/user-comments/Navbar"
import DriversList from "@/components/ui/user-comments/DriversList"
import { createClient } from "@/lib/supabase/server"

export default async function page() {

    const supabase = await createClient();

    const { data: drivers, error: driversError } = await supabase.from("drivers").select("*, driver_stats(*)")

    if (driversError) {
        console.error(driversError);
        return <div>Error loading drivers</div>;
    }


    return (
        <div>
            <Navbar />
            <DriversList drivers={drivers} />
        </div>
    )
}
