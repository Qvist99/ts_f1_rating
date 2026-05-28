import Link from "next/link"
import { ChevronLeft } from "lucide-react";


export default function AccountNavbar() {
    return (
        <div className="flex items-center justify-between h-14 bg-card-bg -mx-36 px-36 border-b-2 border-card-border gap-4">
            <div className="flex items-center gap-2 h-full">
                <Link href="/dashboard" className="text-text-muted px-2 rounded hover:text-text-primary">
                    <ChevronLeft className="w-4 h-4 inline-block mr-1" />
                    Back
                </Link>
                <Seperator />
                <p className="font-condensed text-xl">Account</p>
            </div>
        </div>
    )
}





//This should really just be its own component (To lazy to fix for now 27/05/2026) (Slap on wrist if still here in a few weeks time)
function Seperator() {
    return (
        <div className="h-[50%] w-[2px] bg-card-border" />
    )
}