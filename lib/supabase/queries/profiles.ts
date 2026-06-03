"use server";

import { createClient } from "@/lib/supabase/server";

export async function getProfileByUserId(userId: string) {
    const supabase = await createClient();

    return supabase.from("profiles").select("*").eq("id", userId).single();
}
