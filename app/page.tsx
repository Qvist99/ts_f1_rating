import { Suspense } from 'react'
import Navbar from '@/components/ui/landingPage/Navbar'
import Hero from '@/components/ui/landingPage/Hero'
import FanOpinion from '@/components/ui/landingPage/FanOpinion'
import Schedule from '@/components/ui/landingPage/Schedule'
import Footer from '@/components/ui/landingPage/Footer'
import { getRacesBySeason } from "@/lib/supabase/queries/races"
import { getDriversBySeason } from "@/lib/supabase/queries/drivers"
import { getDriverStandingsBySeason, getConstructorStandingsBySeason } from "@/lib/supabase/queries/standings"
import { connection } from "next/server";

async function LandingPage() {
  await connection();
  const currYear = new Date().getFullYear()

  const startOfYear = new Date(currYear, 0, 1).toISOString()
  const endOfYear = new Date(currYear, 11, 31).toISOString()


  const [
    { data: drivers },
    { data: races },
    { data: driverStandings },
    { data: constructorStandings },
  ] = await Promise.all([
    getDriversBySeason(currYear),
    getRacesBySeason(startOfYear, endOfYear),
    getDriverStandingsBySeason(currYear),
    getConstructorStandingsBySeason(currYear),
  ]);


  return (
    <main
      className="-mx-36 px-10 min-h-screen max-h-screen overflow-y-scroll scroll-smooth"
    >
      <Navbar />
      <Hero currYear={currYear} drivers={drivers} races={races} driverStandings={driverStandings} constructorStandings={constructorStandings} />
      <Schedule races={races} />
      <FanOpinion races={races} />
      <Footer currYear={currYear} />
    </main>
  )
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <LandingPage />
    </Suspense>
  )
}