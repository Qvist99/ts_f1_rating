"use server";
import { getAuthenticatedUser } from "@/lib/supabase/queries/auth";
import { DriverComments } from "@/lib/types";
export async function insertDriverComment(
    driverId: string,
    type: "positive" | "negative",
    text: string,
) {
    const { supabase } = await getAuthenticatedUser();

    return supabase
        .from("driver_comments")
        .insert({ driver_id: driverId, type, text })
        .select()
        .single();
}

export async function updateDriverComment(
    commentId: string,
    updates: Partial<DriverComments>,
) {
    const { supabase } = await getAuthenticatedUser();

    return supabase
        .from("driver_comments")
        .update(updates)
        .eq("id", commentId);
}

export async function deleteDriverComment(commentId: string) {
    const { supabase } = await getAuthenticatedUser();

    return supabase
        .from("driver_comments")
        .delete()
        .eq("id", commentId);
}
