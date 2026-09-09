import Link from 'next/link'
import { Flag } from "lucide-react"
import AuthWidget from "@/components/ui/AuthWidget"
import { UserProfile } from "@/lib/types"
import { getUser } from "@/lib/supabase/queries/auth"
import { getProfileByUserId } from "@/lib/supabase/queries/profiles"

export async function DashboardNavbar() {
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

    return (
        <div className="flex flex-row items-center h-19 justify-between">
            <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-[#e8002d] rounded-full animate-pulse shrink-0" />
                <p className="font-condensed font-extrabold text-[1.2rem] tracking-[0.04em] uppercase text-[#f0f0f0]">
                    F1 Ratings
                </p>
            </div>

            <div className="flex items-center gap-2">
                <Link
                    href="/dashboard/user-comments"
                    className="flex items-center gap-2 text-sm font-medium text-[#4a2cb8] border border-[#4a2cb8]/35 px-3 py-1.5 rounded-md hover:bg-[#4a2cb8]/10 transition-colors duration-150"
                >
                    <Flag className="w-4 h-4" />
                    Drivers Overview
                </Link>
                <AuthWidget user={profile} />
            </div>
        </div>

    )
}