import AuthWidget from "@/components/ui/authWidget/AuthWidget"
import { UserProfile } from "@/lib/types"
import { getUser } from "@/lib/supabase/queries/auth"
import { getProfileByUserId } from "@/lib/supabase/queries/profiles"


export async function AuthWidgetServer() {
    const { data: { user } } = await getUser();

    let profile: UserProfile | null = null

    if (user) {
        const { data: profileData, error } = await getProfileByUserId(user.id);

        if (error) {
            console.error("Error fetching profile:", error);
            // fallback to a default profile as profileData should always exist if the user is authenticated
            profile = {
                id: user.id,
                display_name: user.email || "Unknown User",
                email: user.email || null,
                deletion_requested_at: null,
                updated_at: new Date().toISOString(),
            }
        } else {
            profile = profileData
        }
    }

    return <AuthWidget user={profile} />
}