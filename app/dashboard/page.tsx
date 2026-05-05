import SuspenseCard from '@/components/ui/SuspenseCard'
import NextRaceWeeked from '@/components/ui/dashboard/NextRaceWeeked'
import DriverRankingOverview from '@/components/ui/dashboard/DriverRankingOverview'
import RaceRatingOverview from '@/components/ui/dashboard/RaceRatingOverview'
import UsersDriverOpinions from '@/components/ui/dashboard/UsersDriverOpinions'
export default async function Dashboard() {

  return (
    <div className="flex flex-row justify-between gap-10">

      <div className='leftSide w-[60%] flex flex-col gap-2 max-h-screen'>
        <SuspenseCard height={300}>
          <NextRaceWeeked />
        </SuspenseCard>
        <div className='flex flex-row gap-4'>
          <SuspenseCard height={210}>
            <DriverRankingOverview />
          </SuspenseCard>
          <SuspenseCard height={210}>
            <RaceRatingOverview />
          </SuspenseCard>
        </div>

        <SuspenseCard height={275}>
          <UsersDriverOpinions />
        </SuspenseCard>
      </div>
      <div className='rightSide w-[40%] flex flex-col gap-4'>
        <SuspenseCard>
          <h1>This is some test content on the right side</h1>
        </SuspenseCard>
      </div>
    </div>
  )
}

