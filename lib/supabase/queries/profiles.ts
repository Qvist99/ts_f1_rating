"use server";

import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export async function getProfileByUserId(userId: string) {
    const supabase = await createClient();

    return supabase.from("profiles").select("*").eq("id", userId).single();
}

export async function getProfileDeafult(user: User) {
    const { data: profileData, error } = await getProfileByUserId(user.id);

    if (error) {
        console.error("Error fetching profile:", error);
        return {
            id: user.id,
            display_name: user.email || "Unknown User",
            email: user.email || null,
            deletion_requested_at: null,
            updated_at: new Date().toISOString(),
        };
    }

    return profileData;
}
