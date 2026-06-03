"use server";
import { UserProfile } from "@/lib/types";
import { getAuthenticatedUser } from "@/lib/supabase/queries/auth";

export async function updateProfile(
    updates: Partial<UserProfile>,
) {
    const { supabase, user } = await getAuthenticatedUser();

    return supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);
}
