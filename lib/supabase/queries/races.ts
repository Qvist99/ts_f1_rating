"use server";

import { createClient } from "@/lib/supabase/server";

export async function getNextRace() {
    const supabase = await createClient();

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    return supabase
        .from("races")
        .select("*")
        .eq("is_cancelled", false)
        .gt("date_end", twoDaysAgo.toISOString())
        .order("date_start", { ascending: true })
        .limit(1)
        .single();
}

export async function getRacesBySeason(startOfYear: string, endOfYear: string) {
    const supabase = await createClient();

    return supabase
        .from("races")
        .select("*")
        .gte("date_start", startOfYear)
        .lte("date_start", endOfYear)
        .neq("is_cancelled", true)
        .order("date_start", { ascending: true });
}

export async function getRaceWithRatings(raceId: string, userId: string) {
    const supabase = await createClient();

    return supabase
        .from("races")
        .select(`*, race_ratings!left(*)`)
        .eq("id", raceId)
        .eq("race_ratings.user_id", userId)
        .single();
}

// Used for best average race
export async function getRaceSummary(raceId: string) {
    const supabase = await createClient();

    return supabase
        .from("races")
        .select("race_name, round, date_end")
        .eq("id", raceId)
        .single();
}

export async function getLastFiveRaces() {
    const supabase = await createClient();

    const currentDate = new Date().toISOString();

    return supabase
        .from("races")
        .select("id")
        .lte("date_end", currentDate)
        .eq("is_cancelled", false)
        .order("date_end", { ascending: false })
        .limit(5);
}

export async function getRaceRatingStats() {
    const supabase = await createClient();

    return supabase
        .from("race_rating_stats")
        .select("*");
}
