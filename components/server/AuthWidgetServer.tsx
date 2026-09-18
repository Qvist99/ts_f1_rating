import AuthWidget from "@/components/ui/authWidget/AuthWidget"
import { UserProfile } from "@/lib/types"
import { getUser } from "@/lib/supabase/queries/auth"
import { getProfileDeafult } from "@/lib/supabase/queries/profiles"


export default async function AuthWidgetServer() {
    const { data: { user } } = await getUser();

    let profile: UserProfile | null = null

    if (user) {
        profile = await getProfileDeafult(user);
    }

    return <AuthWidget user={profile} />
}