import Navbar from "@/components/ui/user-comments/Navbar"
import DriversListServer from "./_components/DriversListServer"
import DriversListSkeleton from "@/components/ui/user-comments/DriversListSkeleton"
import AuthWidgetSkeleton from "@/components/ui/authWidget/AuthWidgetSkeleton"
import AuthWidgetServer from "@/components/server/AuthWidgetServer"
import { Suspense } from "react"

export default async function page() {

    return (
        <div>
            <Suspense fallback={null}>
                <Navbar>
                    <Suspense fallback={<AuthWidgetSkeleton />}>
                        <AuthWidgetServer />
                    </Suspense>
                </Navbar>
            </Suspense>

            <Suspense fallback={<DriversListSkeleton />}>
                <DriversListServer />
            </Suspense>
        </div>
    )
}
