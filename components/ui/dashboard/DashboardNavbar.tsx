import Link from 'next/link'
import { Flag } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import AuthWidget from "@/components/ui/AuthWidget"

export async function DashboardNavbar() {

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const profile = user ? {
        name: user.user_metadata?.full_name ?? null,
        email: user.email ?? null,
    } : null

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