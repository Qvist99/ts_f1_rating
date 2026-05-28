"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { signOut } from "@/app/auth/actions";
export async function updateDisplayName(formData: FormData) {
    const displayName = (formData.get("displayName") as string)?.trim();

    if (!displayName || displayName.length < 1 || displayName.length > 50) {
        return { error: "Display name must be between 1 and 50 characters." };
    }

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "User not authenticated." };
    }

    const { error } = await supabase
        .from("profiles")
        .update({
            display_name: displayName,
        })
        .eq("id", user.id);

    if (error) {
        return { error: "Failed to update display name. Please try again." };
    }

    revalidatePath("/account");
    return { success: true };
}

export async function scheduleAccountDeletion() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "User not authenticated." };
    }

    const { error } = await supabase
        .from("profiles")
        .update({
            deletion_requested_at: new Date().toISOString(),
        })
        .eq("id", user.id);

    if (error) {
        return {
            error: "Failed to schedule account deletion. Please try again.",
        };
    }

    await signOut("/dashboard");

    return { success: true };
}

export async function cancelAccountDeletion() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "User not authenticated." };

    const { error } = await supabase
        .from("profiles")
        .update({ deletion_requested_at: null })
        .eq("id", user.id);

    if (error) return { error: "Failed to cancel deletion. Please try again." };

    revalidatePath("/account");
    return { success: true };
}
