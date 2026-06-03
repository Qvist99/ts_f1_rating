"use server";
import { revalidatePath } from "next/cache";
import { signOut } from "@/app/auth/actions";
import { getUser } from "@/lib/supabase/queries/auth";
import { updateProfile } from "@/lib/supabase/actions/profiles";

export async function updateDisplayName(formData: FormData) {
    const displayName = (formData.get("displayName") as string)?.trim();

    if (!displayName || displayName.length < 1 || displayName.length > 50) {
        return { error: "Display name must be between 1 and 50 characters." };
    }

    const { data: { user } } = await getUser();

    if (!user) {
        return { error: "User not authenticated." };
    }

    const { error } = await updateProfile({
        display_name: displayName,
    }).catch(() => ({ error: "User not authenticated." }));

    if (error) {
        return { error: "Failed to update display name. Please try again." };
    }

    revalidatePath("/account");
    return { success: true };
}

export async function scheduleAccountDeletion() {
    const { data: { user } } = await getUser();

    if (!user) {
        return { error: "User not authenticated." };
    }

    const { error } = await updateProfile({
        deletion_requested_at: new Date().toISOString(),
    }).catch(() => ({ error: "User not authenticated." }));

    if (error) {
        return {
            error: "Failed to schedule account deletion. Please try again.",
        };
    }

    await signOut("/dashboard");

    return { success: true };
}

export async function cancelAccountDeletion() {
    const { data: { user } } = await getUser();

    if (!user) return { error: "User not authenticated." };

    const { error } = await updateProfile({
        deletion_requested_at: null,
    }).catch(() => ({ error: "User not authenticated." }));

    if (error) return { error: "Failed to cancel deletion. Please try again." };

    revalidatePath("/account");
    return { success: true };
}
