import Link from 'next/link'
import { Flag } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import AuthWidget from "@/components/ui/AuthWidget"
import { UserProfile } from "@/lib/types"

export async function DashboardNavbar() {

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let profile: UserProfile | null = null

    if (user) {
        const { data: profileData, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();

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
                <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                <p>F1 Ratings</p>
            </div>

            <div className="flex items-center gap-2">
                <Link
                    href="/dashboard/user-comments"
                    className="flex items-center gap-2 text-sm font-medium text-red-500 border border-red-500/35 px-3 py-1.5 rounded-md hover:bg-red-500/10 transition-colors duration-150"
                >
                    <Flag className="w-4 h-4" />
                    Drivers Overview
                </Link>
                <AuthWidget user={profile} />
            </div>
        </div>

    )
}