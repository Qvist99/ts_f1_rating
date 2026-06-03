"use server";

import { createClient } from "@/lib/supabase/server";

export async function getDriversBySeason(year: number) {
    const supabase = await createClient();

    return supabase
        .from("drivers")
        .select("*")
        .eq("year", year);
}

export async function getDriversWithComments(year: number, limit: number) {
    const supabase = await createClient();

    return supabase
        .from("drivers")
        .select("*, driver_comments(*)")
        .eq("year", year)
        .limit(limit, { referencedTable: "driver_comments" });
}

export async function getDriverStats() {
    const supabase = await createClient();

    return supabase
        .from("driver_stats")
        .select("*");
}

export async function getDriversByIds(driverIds: string[]) {
    const supabase = await createClient();

    return supabase
        .from("driver_stats")
        .select("*")
        .in("driver_id", driverIds);
}

export async function getDriversWithRatingsForRace(
    raceId: string,
    userId: string,
) {
    const supabase = await createClient();

    return supabase
        .from("race_drivers")
        .select(`drivers(*, driver_ratings!left(*))`)
        .eq("race_id", raceId)
        .eq("drivers.driver_ratings.race_id", raceId)
        .eq("drivers.driver_ratings.user_id", userId);
}
