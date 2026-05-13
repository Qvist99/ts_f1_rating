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
    const nextSessionId = nextSession ? nextSession.session_key : null;


    const sessionDateAndTime = nextSession ? `${new Date(nextSession.date_start).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${new Date(nextSession.date_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : "";


    return (
        <div className="w-full border-r border-card-border -mx-4 px-4 -my-2 py-2">
            <div className="flex justify-between bg-[#26151A] -mx-4 px-4 -my-2 border-b-2 border-[#411B1C] py-2">
                <div className="flex flex-col justify-center">
                    {isWeekendOver ? (
                        <p className="text-text-muted font-bold text-xs">WEEKEND FINISHED</p>
                    ) : isLive ? (
                        <>
                            <p className="text-text-muted font-bold text-xs">NOW LIVE</p>
                            <p className="text-[#ED6464] text-lg font-bold leading-none">{nextSession.session_name}</p>
                        </>
                    ) : (
                        <>
                            <p className="text-text-muted font-bold text-xs">NEXT UP - {nextSession.session_name}</p>
                            <p className="text-[#ED6464] text-lg font-bold leading-none">{sessionDateAndTime}</p>
                        </>
                    )}
                </div>

                {!isWeekendOver && (
                    isLive ? (
                        <span className="self-center text-xs font-bold px-2 py-0.5 rounded bg-[#511D1F] border border-[#8E2826] text-[#ED6464]">
                            LIVE
                        </span>
                    ) : (
                        <Countdown session={nextSession} />
                    )
                )}
            </div>

            <div className="">
                <SessionTimes sessions={sessions} currentTime={now} nextSessionId={nextSessionId} />
            </div>
        </div>

    );
}


function SessionTimes({ sessions, currentTime, nextSessionId }: { sessions: RaceSession[], currentTime: Date, nextSessionId: string | null }) {
    const formatSessionDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    const formatSessionTime = (date: string) => {
        return new Date(date).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const dotColor = (session: RaceSession) => {
        if (session.session_type === "Practice") {
            return "#4A9EFF"
        } else if (session.session_type === "Qualifying") {
            return "#FFD60A"
        } else if (session.session_type === "Race") {
            return "#FF3B30"
        }
    }



    return (
        <div className="mt-4 flex flex-col gap-1">
            {
                sessions.map(session => {
                    const sessionDate = formatSessionDate(session.date_start);
                    const sessionStartTime = formatSessionTime(session.date_start);
                    const sessionEndTime = formatSessionTime(session.date_end);

                    const isNextSession = session.session_key === nextSessionId;
                    const isLive = new Date(session.date_start) < currentTime && new Date(session.date_end) > currentTime;
                    const isFinished = new Date(session.date_end) < currentTime;

                    return (
                        <div key={session.session_key} className="flex justify-between items-center px-2 py-1 rounded bg-card-bg border border-card-border" style={isFinished ? { opacity: 0.5 } : isLive || isNextSession ? { backgroundColor: "#26151A", borderColor: "#5C1E20" } : {}}>
                            <div className="flex gap-2 items-center">
                                <div className="h-2 w-2 rounded" style={{ backgroundColor: dotColor(session) }}></div>
                                <p className="font-bold">{session.session_name}</p>
                            </div>

                            <div className="">
                                {isLive ? (
                                    <p className="text-xs text-[#FF6B6B] py-0.5 font-bold bg-[#511D1F] border border-[#8E2826] rounded px-2">LIVE</p>
                                ) : isNextSession ? (
                                    <p className="text-xs text-[#ED6464] py-0.5 font-bold bg-[#511D1F] border border-[#8E2826] rounded px-2">NEXT</p>
                                ) : (
                                    <p className="text-sm text-text-muted font-bold tabular-nums">{sessionDate}: {sessionStartTime} - {sessionEndTime}</p>
                                )
                                }
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}