"use server";

import { createClient } from "@/lib/supabase/server";

export async function getUser() {
    const supabase = await createClient();
    return supabase.auth.getUser();
}

export async function getAuthenticatedUser() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    return { supabase, user };
}
