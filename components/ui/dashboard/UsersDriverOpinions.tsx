import { createClient } from "@/lib/supabase/server"
import Slider from "../Slider";
import DriverCard from "../DriverCard";
import FanCommentsCard from "../FanCommentsCard";
export default async function UsersDriverOpinions() {
    const supabase = await createClient();


    const { data: drivers, error: driversError } = await supabase.from("drivers").select("*, driver_comments(*), driver_ratings(*, races(race_name, round, date_end))").limit(15, { referencedTable: "driver_comments" })

    if (driversError) {
        console.error("Error fetching drivers:", driversError);
        return <div>Error loading driver opinions.</div>;
    }


    const fiveRandomDrivers = drivers.sort(() => 0.5 - Math.random()).slice(0, 5);

    return (

        <Slider
            pages={fiveRandomDrivers.map(driver => (
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