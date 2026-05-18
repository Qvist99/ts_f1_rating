import SuspenseCard from '@/components/ui/SuspenseCard'
import NextRaceWeekend from '@/components/ui/dashboard/NextRaceWeekend'
import UsersDriverOpinions from '@/components/ui/dashboard/UsersDriverOpinions'
import SeasonOverviewPanel from '@/components/ui/dashboard/SeasonOverview/SeasonOverviewPanel'
export default async function Dashboard() {
  // We need to overlook how we handle heights here. Probably will be a headache to maintain.
  return (
    <div className="flex flex-row justify-between gap-10 max-h-[calc(100vh-126px)] pt-[76px]">

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
  )
}

