import SuspenseCard from '@/components/ui/SuspenseCard'
import NextRaceWeekend from '@/components/ui/dashboard/NextRaceWeekend'
import UsersDriverOpinions from '@/components/ui/dashboard/UsersDriverOpinions'
import SeasonOverviewPanel from '@/components/ui/dashboard/SeasonOverview/SeasonOverviewPanel'
import { DashboardNavbar } from '@/components/ui/dashboard/DashboardNavbar'
import { Suspense } from "react"

export default async function Dashboard() {
  // We need to overlook how we handle heights here. Probably will be a headache to maintain.
  return (
    <div>
      <Suspense fallback={<div className="h-19 w-full " />}>
        <DashboardNavbar />
      </Suspense>
      <div className="flex flex-row justify-between gap-10 max-h-[calc(100vh-126px)]">

        <div className='leftSide w-[60%] flex flex-col gap-2 '>
          <SuspenseCard height={400}>
            <NextRaceWeekend />
          </SuspenseCard>

          <SuspenseCard height={370} hasBorder={false} applyPadding={false}>
            <UsersDriverOpinions />
          </SuspenseCard>
        </div>
        <div className='rightSide w-[40%] flex flex-col gap-4'>
          <SuspenseCard applyPadding={false} height={800}>
            <SeasonOverviewPanel />
          </SuspenseCard>
        </div>
      </div>
    </div>
  )
}


