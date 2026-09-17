import { getNextRace } from "@/lib/supabase/queries/races";
import { getUser } from "@/lib/supabase/queries/auth";
import NextRaceWeekend from "@/components/ui/dashboard/nextRaceWeekend/NextRaceWeekend";

export default async function NextRaceWeekendServer() {
    const [{ data: { user } }, { data: raceData, error: raceDataError }] = await Promise.all([getUser(), getNextRace()]);

    if (raceDataError) {
        console.error("Error fetching race data:", raceDataError);
        return null;
    }

    return <NextRaceWeekend user={user} raceData={raceData} />;
}