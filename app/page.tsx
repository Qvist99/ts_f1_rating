import { Suspense } from 'react'
import { createClient } from "@/lib/supabase/server"
import Navbar from '@/components/ui/landingPage/Navbar'
import Hero from '@/components/ui/landingPage/Hero'
import MarqueeStrip from '@/components/ui/landingPage/MarqueeStrip'
import HowItWorks from '@/components/ui/landingPage/HowItWorks'
import FanOpinion from '@/components/ui/landingPage/FanOpinion'
import Schedule from '@/components/ui/landingPage/Schedule'
import CallToAction from '@/components/ui/landingPage/CallToAction'
import Footer from '@/components/ui/landingPage/Footer'
async function LandingPage() {

  const supabase = await createClient();
  const currYear = new Date().getFullYear()

  const startOfYear = new Date(currYear, 0, 1).toISOString()
  const endOfYear = new Date(currYear, 11, 31).toISOString()


  const [
    { data: drivers },
    { data: races },
    { data: driverStandings },
    { data: constructorStandings },
  ] = await Promise.all([
    supabase
      .from("drivers")
      .select("*")
      .eq("year", currYear),
    supabase
      .from("races")
      .select("*")
      .gte("date_start", startOfYear)
      .lte("date_start", endOfYear)
      .neq("is_cancelled", true)
      .order("date_start", { ascending: true }),
    supabase
      .from("driver_standings")
      .select("standings")
      .eq("year", currYear)
      .maybeSingle(),
    supabase
      .from("constructor_standings")
      .select("standings")
      .eq("year", currYear)
      .maybeSingle(),
  ])


  return (
    <main
      className="-mx-36 px-10 min-h-screen max-h-screen overflow-y-scroll scroll-smooth"
    >
      <Navbar />
      <Hero currYear={currYear} drivers={drivers} races={races} driverStandings={driverStandings} constructorStandings={constructorStandings} />
      <MarqueeStrip drivers={drivers} />
      <HowItWorks />
      <FanOpinion races={races} />
      <Schedule races={races} />
      <CallToAction />
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