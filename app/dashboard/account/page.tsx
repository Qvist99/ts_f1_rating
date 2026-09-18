import AccountNavbar from "@/components/ui/account/AccountNavbar"
import AccountPageServer from "./_components/AccountPageServer"
import { Suspense } from "react"
import AccountPageSkeleton from "@/components/ui/AccountPageSkeleton"


export default function Page() {


    return (
        <div className="flex flex-col gap-12">
            <AccountNavbar />
            <div className="w-full flex justify-center">
                <div className="flex flex-col w-3xl">
                    <Suspense fallback={<AccountPageSkeleton />}>
                        <AccountPageServer />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
