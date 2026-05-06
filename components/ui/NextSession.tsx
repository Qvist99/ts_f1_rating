"use client";
import { RaceSession } from "@/lib/types";
import { Countdown } from "./Countdown";
import { getNextSession } from "@/lib/races/getNextSession";
import { useNow } from "@/lib/races/useNow";


export default function NextSession({ sessions }: { sessions: RaceSession[] }) {
    const now = useNow();
    const nextSession = getNextSession(sessions);
    const isLive = nextSession ? new Date(nextSession.date_start) < now : false;
    const isWeekendOver = !nextSession;

    const headerLabel = isWeekendOver
        ? "Weekend finished"
        : isLive
            ? "Live 🔴"
            : "Next session";

    return (
        <div className="w-fit">
            <div className="flex justify-between font-bold">
                <h3>{headerLabel}</h3>
                {nextSession && <h3 className="text-text-muted">{nextSession.session_name}</h3>}
            </div>
            <div className="bg-[#111220] px-3 py-2 rounded-md">
                <Countdown session={nextSession} />
                <SessionTimes sessions={sessions} />
            </div>
        </div>
    );
}


function SessionTimes({ sessions }: { sessions: RaceSession[] }) {
    // Split times up into respective dates and display them as fp1: 10:00-12:00 as a tag in that row. That way we can display the sessions for each day easier. Maybe colorcode in future too show what sessions already finished. And have some sort of an highlight for the next session as well.

    const sessionAbbrv = {
        "Practice 1": "FP1",
        "Practice 2": "FP2",
        "Practice 3": "FP3",
        "Qualifying": "Q",
        "Sprint": "SR",
        "Sprint Qualifying": "SQ",
        "Race": "R"
    }

    const formatSessionDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };



    const sessionsByDate: { [date: string]: RaceSession[] } = {};

    sessions.forEach((session) => {
        const date = formatSessionDate(session.date_start);
        if (!sessionsByDate[date]) {
            sessionsByDate[date] = [];
        }
        sessionsByDate[date].push(session);
    });


    return (
        <div className="mt-2 flex flex-col gap-2">
            {Object.entries(sessionsByDate).map(([date, sessions]) => (
                <div key={date} className="flex gap-4 items-center">
                    <h4 className="text-sm text-text-muted font-bold">{date}</h4>
                    <div className="flex gap-2">
                        {sessions.map((session) => {
                            const startTime = new Date(session.date_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            const endTime = new Date(session.date_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            return (
                                <div key={session.session_name} className="px-2 py-1 bg-gray-700 rounded text-sm">
                                    {sessionAbbrv[session.session_name]}: {startTime} - {endTime}
                                </div>
                            )
                        }
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}