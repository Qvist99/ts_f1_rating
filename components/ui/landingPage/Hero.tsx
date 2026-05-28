import Link from 'next/link'
import Tabs from "@/components/ui/Tabs"
import { Races, Drivers, DriverStandingFromApi, ConstructorStandingFromApi } from "@/lib/types"
import { getLatestRace } from "@/lib/races/getLatestRace"
import StandingsList from '../dashboard/SeasonOverview/StandingsList'
import { Zap } from "lucide-react"



interface HeroProps {
    currYear: number
    drivers: Drivers[] | null
    races: Races[] | null
    driverStandings: {
        standings: DriverStandingFromApi[]
    } | null
    constructorStandings: {
        standings: ConstructorStandingFromApi[]
    } | null
};

export default function Hero({ currYear, drivers, races, driverStandings, constructorStandings }: HeroProps) {


    const latestRace = races ? getLatestRace(races) : null;

    const sortDriverStandings = driverStandings?.standings.sort((a, b) => a.position_current - b.position_current) || []

    const sortConstructorStandings = constructorStandings?.standings.sort((a, b) => a.position_current - b.position_current) || []

    const leadingDriverInStandings = sortDriverStandings.length > 0 ? sortDriverStandings[0] : null;

    const leadingDriver = drivers?.find(driver => driver.driver_number === leadingDriverInStandings?.driver_number)

    return (
        <section
            id="hero"
            className="grid grid-cols-2 gap-16 min-h-screen items-center pt-25 pb-15 relative overflow-hidden -mx-10 px-10"
        >
            {/* Red glow */}
            <div className="pointer-events-none absolute top-[-20%] right-[-10%] w-175 h-175 rounded-full bg-[radial-gradient(circle,rgba(232,0,45,0.07)_0%,transparent_65%)]" />

            {/* Left – copy */}
            <div className="relative z-10">
                <div className="inline-flex items-center gap-2 font-condensed text-[0.8rem] font-semibold tracking-[0.12em] uppercase text-[#e8002d] mb-6">
                    <span className="block w-6 h-0.5 bg-[#e8002d]" />
                    {currYear} Season Live
                </div>

                <h1 className="font-condensed font-black text-[clamp(3rem,5.5vw,5.5rem)] leading-[0.95] tracking-[-0.02em] uppercase text-[#f0f0f0] mb-6">
                    Your Voice.<br />Every <span className="text-[#e8002d]">Race.</span>
                </h1>

                <p className="text-[1.05rem] text-[#888] max-w-110 mb-10 leading-[1.75] font-light">
                    Track official standings, follow constructor battles, and see what the global F1 fanbase truly thinks — driver by driver, race by race.
                </p>

                <div className="flex items-center gap-4 flex-wrap">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 bg-[#e8002d] text-white font-condensed font-bold text-base tracking-[0.08em] uppercase py-3.5 px-7 rounded-[3px] hover:bg-[#ff1a45] transition-all hover:-translate-y-px"
                    >
                        <Zap className="w-4 h-4" />
                        Open App
                    </Link>
                    <Link
                        href="#how-it-works"
                        className="inline-flex items-center gap-2 text-[#888] font-condensed font-semibold text-base tracking-[0.06em] uppercase py-3.5 px-5 rounded-[3px] border border-white/15 hover:border-white/35 hover:text-[#f0f0f0] transition-all"
                    >
                        How It Works
                    </Link>
                </div>

                {/* Stats row */}
                <div className="flex gap-10 mt-14 pt-8 border-t border-card-border">
                    <div>
                        <div className="font-condensed font-extrabold text-[2rem] leading-none mb-1 text-[#f0f0f0]">{leadingDriver?.last_name || "Antonelli"}</div>
                        <div className="text-[0.73rem] text-[#555] uppercase tracking-[0.08em]">Championship Leader</div>
                    </div>
                    <div>
                        <div className="font-condensed font-extrabold text-[2rem] leading-none mb-1">
                            {leadingDriverInStandings?.points_current || 131}<span className="text-base text-[#555] font-light ml-0.5"> pts</span>
                        </div>
                        <div className="text-[0.73rem] text-[#555] uppercase tracking-[0.08em]">Driver Points Lead</div>
                    </div>
                    <div>
                        <div className="font-condensed font-extrabold text-[2rem] leading-none mb-1">R{latestRace?.round || 5}</div>
                        <div className="text-[0.73rem] text-[#555] uppercase tracking-[0.08em]">Latest Round</div>
                    </div>
                </div>
            </div>

            {/* Right – data card */}
            <div className="relative z-10">
                <DataCard drivers={drivers} races={races} latestRace={latestRace} driverStandings={sortDriverStandings} constructorStandings={sortConstructorStandings} currYear={currYear} />
            </div>
        </section>
    )
}


function DataCard({ drivers, races, latestRace, driverStandings, constructorStandings, currYear }: { drivers: Drivers[] | null, races: Races[] | null | undefined, latestRace: Races | null | undefined, driverStandings: DriverStandingFromApi[] | null, constructorStandings: ConstructorStandingFromApi[] | null, currYear: number }) {

    const standingsListItems = driverStandings?.slice(0, 7).map((standing) => {
        const driverInfo = drivers?.find(driver => driver.driver_number === standing.driver_number)

        return {
            position: standing.position_current,
            previous_position: standing.position_start,
            value: standing.points_current,
            mainLabel: driverInfo ? `${driverInfo.first_name} ${driverInfo.last_name}` : `Driver ${standing.driver_number}`,
            hexColor: driverInfo ? `#${driverInfo.team_color}` : "#000000",
            subLabel: driverInfo ? driverInfo?.team_name : ""
        }
    }) || []


    const constructorStandingsListItems = constructorStandings?.slice(0, 7).map((standing) => {

        return {
            position: standing.position_current,
            previous_position: standing.position_start,
            value: standing.points_current,
            mainLabel: standing.team_name,
            hexColor: drivers?.find(driver => driver.team_name === standing.team_name) ? `#${drivers.find(driver => driver.team_name === standing.team_name)?.team_color}` : "#000000",
            subLabel: ""
        }
    }) || []


    const sevenRandomRatings = Array.from({ length: 7 }, () => ({
        rating: Math.floor(Math.random() * 10) + 1,
    }))
        .sort((a, b) => b.rating - a.rating)
        .map((item, i) => ({
            position: i + 1,
            rating: item.rating,
        }))


    const driverRatingsListItems = driverStandings?.slice(0, 7).map((standing, i) => {
        const driverInfo = drivers?.find(driver => driver.driver_number === standing.driver_number)

        return {
            position: sevenRandomRatings[i].position,
            previous_position: 0,
            value: sevenRandomRatings[i].rating,
            mainLabel: driverInfo ? `${driverInfo.first_name} ${driverInfo.last_name}` : `Driver ${standing.driver_number}`,
            hexColor: driverInfo ? `#${driverInfo.team_color}` : "#000000",
            subLabel: driverInfo ? driverInfo?.team_name : ""
        }
    }) || []

    const raceRatingsListItems = races?.slice(0, 7).map((race, i) => {
        return {
            position: sevenRandomRatings[i].position,
            previous_position: 0,
            value: sevenRandomRatings[i].rating,
            mainLabel: race.race_name,
            hexColor: "#e8002d",
            subLabel: `Round ${race.round}`,
        }
    }) || []

    return (
        <div className="bg-[#17171a] border border-card-border rounded-[6px] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4.5 py-3.5 border-b border-card-border bg-[#111113]">
                <div>
                    <div className="font-condensed text-[0.72rem] tracking-widest uppercase text-[#555]">Round {latestRace?.round || 7} · {currYear} Season</div>
                    <div className="font-condensed text-[0.95rem] font-bold uppercase tracking-wider">{latestRace?.race_name || "Canadian Grand Prix"}</div>
                </div>
                <div className="font-condensed text-[0.68rem] font-bold tracking-widest uppercase py-0.75 px-2.5 rounded-xs bg-white/[0.07] text-[#555]">
                    Weekend Finished
                </div>
            </div>


            <div>
                <Tabs
                    paddingBottom={false}
                    tabs={[
                        { id: "Drivers", label: "Drivers", content: <StandingsList items={standingsListItems} valueSuffix="pts" showRatingBar={false} showDelta={true} emptyStateText="No driver standings available" /> },
                        { id: "Constructors", label: "Constructors", content: <StandingsList items={constructorStandingsListItems} valueSuffix="pts" showRatingBar={false} showDelta={true} emptyStateText="No constructor standings available" /> },
                        { id: "Driver Ratings", label: "Driver Ratings", content: <StandingsList items={driverRatingsListItems} valueSuffix="/10" showRatingBar={true} showDelta={false} emptyStateText="No driver ratings available" /> },
                        { id: "Race Ratings", label: "Race Ratings", content: <StandingsList items={raceRatingsListItems} valueSuffix="/10" showRatingBar={true} showDelta={false} emptyStateText="No race ratings available" /> },
                    ]}
                />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4.5 py-2.75 border-t border-card-border bg-[#111113]">
                <span className="text-[0.7rem] text-[#555]">Fan-powered ratings · 2026 Season</span>
                <Link
                    href="/dashboard"
                    className="font-condensed text-[0.72rem] font-bold tracking-[0.08em] uppercase px-3.5 py-2.5 rounded-xs border border-[#e8002d] text-[#e8002d] hover:bg-[#e8002d] hover:text-white transition-colors"
                >
                    Rate Drivers
                </Link>
            </div>
        </div>
    )
}
