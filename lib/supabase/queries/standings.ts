"use server";

import { createClient } from "@/lib/supabase/server";

export async function getConstructorStandingsBySeason(year: number) {
    const supabase = await createClient();
    return supabase
        .from("constructor_standings")
        .select("standings")
        .eq("year", year)
        .maybeSingle();
}

export async function getDriverStandingsBySeason(year: number) {
    const supabase = await createClient();
    return supabase
        .from("driver_standings")
        .select("standings")
        .eq("year", year)
        .maybeSingle();
}
