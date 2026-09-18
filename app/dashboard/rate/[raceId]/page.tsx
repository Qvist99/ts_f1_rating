import { Suspense } from "react"
import RateRacePageServer from "./_components/RateRacePageServer"
import RateRacePageSkeleton from "./_components/RateRacePageSkeleton"
export default async function page({ params }: { params: Promise<{ raceId: string }> }) {
    const { raceId } = await params

    return (
        <Suspense fallback={<RateRacePageSkeleton />}>
            <RateRacePageServer raceId={raceId} />
        </Suspense>
    )
}
