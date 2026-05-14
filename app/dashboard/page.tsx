import SuspenseCard from '@/components/ui/SuspenseCard'
import NextRaceWeekend from '@/components/ui/dashboard/NextRaceWeekend'
import UsersDriverOpinions from '@/components/ui/dashboard/UsersDriverOpinions'
export default async function Dashboard() {

  return (
    <div className="flex flex-row justify-between gap-10">

      <div className='leftSide w-[60%] flex flex-col gap-2 max-h-screen relative'>
        <SuspenseCard height={400}>
          <NextRaceWeekend />
        </SuspenseCard>

        <SuspenseCard height={370} hasBorder={false}>
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

