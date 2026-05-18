import Link from "next/link"
import { RaceWithRatings } from "@/lib/types"
import SavingState from "./SavingState"


export default function Header({ raceWithRatings }: { raceWithRatings: RaceWithRatings }) {

    const sessions = raceWithRatings.sessions

    return (
        <div className="flex flex-col border-b border-card-border -mx-36 px-36">
            <TopBar raceWithRatings={raceWithRatings} />
            <BottomBar sessions={sessions} />
        </div>
    )
}


function findLatestSession(sessions: RaceWithRatings["sessions"], now: Date) {
    const pastSessions = sessions.filter(session => new Date(session.date_end) < now)
    if (pastSessions.length === 0) return null
    return pastSessions.reduce((latest, session) => {
        return new Date(session.date_end) > new Date(latest.date_end) ? session : latest
    })
}

function TopBar({ raceWithRatings }: { raceWithRatings: RaceWithRatings }) {
    return (
        <div className="h-14 flex justify-between items-center border-b-2 border-card-border -mx-36 px-36 bg-card-bg">

            <div className="flex gap-4 items-center">
                <Link href="/dashboard" className="text-text-muted border-2 border-card-border px-2 rounded hover:bg-card-border">Back</Link>
                <p className="font-condensed">Rate Drivers</p>
            </div>

            <div className="flex gap-4 items-center">
                <SavingState />
                <p className="font-condensed text-sm">
                    {raceWithRatings.race_name} - Round {raceWithRatings.round}
                </p>

            </div>
        </div>
    )
}


function BottomBar({ sessions }: { sessions: RaceWithRatings["sessions"] }) {
    const now = new Date()

    const latestSession = findLatestSession(sessions, now)

    // last session in the array is last session of hte weekend
    const lastSessionOfWeekend = sessions[sessions.length - 1]

    // rating closes 2 days after last session ends
    // Format as "May 26 23:59" as example
    const ratingCloseDate = new Date(lastSessionOfWeekend.date_end)

    const formatedCloseDate = ratingCloseDate.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    })
    return (
        <div className="flex items-center justify-between py-2">
            <div className="flex gap-4">
                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-[#f59e0b] mt-0.5"></div>
                        <p className="text-text-muted">Last session:</p>
                        <p className="font-condensed">{latestSession ? latestSession.session_name : "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-text-muted font-condensed font-bold">Window closes {formatedCloseDate}</p>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex">
                    <div className="text-xs px-3 py-1 border border-border rounded-l text-text-muted border-r-0">
                        Opens at FP1
                    </div>
                    <div className="text-xs px-3 py-1 border border-red-800/40 bg-red-950/30 text-red-400">
                        Race weekend
                    </div>
                    <div className="text-xs px-3 py-1 border border-border rounded-r text-text-muted border-l-0">
                        +2 days post-race
                    </div>
                </div>
            </div>
        </div>
    )
}
