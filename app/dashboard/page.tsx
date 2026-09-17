import Card from '@/components/ui/Card'
import UserDriverOpinionsServer from './_components/UserDriverOpinionsServer'
import SeasonOverviewPanel from '@/components/ui/dashboard/SeasonOverview/SeasonOverviewPanel'
import { DashboardNavbar } from '@/components/ui/dashboard/DashboardNavbar'
import { Suspense } from "react"
import AuthWidgetSkeleton from "@/components/ui/authWidget/AuthWidgetSkeleton"
import { SeasonOverviewPanelSkeleton } from '@/components/ui/dashboard/SeasonOverview/SeasonOverviewPanelSkeleton'
import UsersDriverOpinionsSkeleton from '@/components/ui/dashboard/driversOverview/UsersDriverOpinionsSkeleton'
import { AuthWidgetServer } from './_components/AuthWidgetServer'
import NextRaceWeekendServer from './_components/NextRaceWeekendServer'
import NextRaceWeekendSkeleton from '@/components/ui/dashboard/nextRaceWeekend/NextRaceWeekendSkeleton'

export default async function Dashboard() {
  return (
    <div>
      <DashboardNavbar >
        <Suspense fallback={<AuthWidgetSkeleton />}>
          <AuthWidgetServer />
        </Suspense>
      </DashboardNavbar>
      <div className="flex flex-row justify-between gap-10 h-[calc(100vh-126px)]">

        <div className='leftSide w-[60%] flex flex-col gap-2 '>
          <Card className="flex-2">
            <Suspense fallback={<NextRaceWeekendSkeleton />}>
              <NextRaceWeekendServer />
            </Suspense>
          </Card>

          <Card className="flex-3" hasBorder={false} applyPadding={false}>
            <Suspense fallback={<UsersDriverOpinionsSkeleton />}>
              <UserDriverOpinionsServer />
            </Suspense>
          </Card>
        </div>
        <div className='rightSide w-[40%] flex flex-col gap-4'>
          <Card className="flex-1" applyPadding={false} >
            <Suspense fallback={<SeasonOverviewPanelSkeleton />}>
              <SeasonOverviewPanel />
            </Suspense>
          </Card>
        </div>
      </div>
    </div>
  )
}


