import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import AuthWidget from "@/components/ui/AuthWidget";


interface NavbarProps {
    user: {
        name?: string | null
        email?: string | null
    } | null
}

export default function Navbar({ user }: NavbarProps) {
    const currentYear = new Date().getFullYear()

    return (
        <div className="flex items-center justify-between h-14 bg-card-bg -mx-36 px-36 border-b-2 border-card-border gap-4">
            <div className="flex items-center gap-2 h-full">
                <Link href="/dashboard" className="text-text-muted px-2 rounded hover:text-text-primary">
                    <ChevronLeft className="w-4 h-4 inline-block mr-1" />
                    Back
                </Link>
                <Seperator />
                <p className="font-condensed text-xl">Fan Comments</p>
            </div>

            <div className="flex gap-4 items-center">
                <div className="flex items-center px-3 py-1 text-[#7a7870] bg-[#202028] rounded font-condensed text-sm h-fit">
                    <span>
                        {currentYear} SEASON
                    </span>
                </div>
                <div>
                    <AuthWidget user={user} redirectTo="/dashboard/user-comments" />
                </div>
            </div>
        </div>
    )
}





function Seperator() {
    return (
        <div className="h-[50%] w-[2px] bg-card-border" />
    )
}