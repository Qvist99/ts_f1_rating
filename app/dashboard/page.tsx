import SuspenseCard from '@/components/ui/SuspenseCard'
import NextRaceWeekend from '@/components/ui/dashboard/NextRaceWeekend'
import UsersDriverOpinions from '@/components/ui/dashboard/UsersDriverOpinions'
import SeasonOverviewPanel from '@/components/ui/dashboard/SeasonOverview/SeasonOverviewPanel'
import Link from 'next/link'
import { Flag } from "lucide-react"
export default async function Dashboard() {
  // We need to overlook how we handle heights here. Probably will be a headache to maintain.
  return (
    <div>
      <DashboardNavbar />
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


function DashboardNavbar() {
  return (
    <div className="flex flex-row items-center h-19 justify-end">
      <Link
        href="/dashboard/user-comments"
        className="flex items-center gap-2 text-sm font-medium text-red-500 border border-red-500/35 px-3 py-1.5 rounded-md hover:bg-red-500/10 transition-colors duration-150"
      >
        <Flag className="w-4 h-4" />
        Drivers Overview
      </Link>
    </div>

  )
}

