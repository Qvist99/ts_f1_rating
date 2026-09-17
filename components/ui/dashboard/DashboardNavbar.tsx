import Link from 'next/link'
import { Flag } from "lucide-react"

interface DashboardNavbarProps {
    children: React.ReactNode;
}


export async function DashboardNavbar({ children }: DashboardNavbarProps) {

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
                {children}
            </div>
        </div>

    )
}