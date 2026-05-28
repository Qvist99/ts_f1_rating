"use client"
import { Races } from "@/lib/types"
import { useEffect, useRef } from 'react'
import SectionLabel from "./SectionLabel"

interface ScheduleProps {
    races: Races[] | null
}

export default function Schedule({ races }: ScheduleProps) {
    if (!races) return null

    const now = new Date()
    const containerRef = useRef<HTMLDivElement>(null)
    const highlightRef = useRef<HTMLDivElement>(null)


    const mappedRaces = races.map((race) => {
        const dateStart = new Date(race.date_start)
        const dateEnd = new Date(race.date_end)
        return {
            round: race.round,
            name: race.race_name,
            date: `${dateStart.toLocaleString('en-US', { month: 'short', day: 'numeric' })} – ${dateEnd.toLocaleString('en-US', { month: 'short', day: 'numeric' })}`,
            dateStart,
            dateEnd,
            done: dateEnd < now,
            current: dateStart <= now && dateEnd >= now,
        }
    })

    const hasCurrentRace = mappedRaces.some((r) => r.current)
    const latestRound = !hasCurrentRace
        ? mappedRaces.filter((r) => r.done).at(-1)?.round
        : null

    useEffect(() => {
        const container = containerRef.current
        const card = highlightRef.current
        if (!container || !card) return

        const scrollTo = card.offsetLeft - (container.clientWidth / 2) + (card.clientWidth / 2)
        container.scrollLeft = Math.max(0, scrollTo)
    }, [])

    return (
        <section id="schedule" className="py-16 border-t border-card-border -mx-10 px-10">
            <SectionLabel>2026 Calendar</SectionLabel>
            <h2 className="font-condensed font-extrabold text-[clamp(1.6rem,2.5vw,2.4rem)] uppercase tracking-[-0.01em] leading-none">
                Race schedule
            </h2>

            <div ref={containerRef} className="flex gap-3.5 mt-8 overflow-x-auto pb-3 scrollbar-thin scrollbar-color-[rgba(255,255,255,0.08)_transparent]">
                {mappedRaces.map((race) => {
                    const isLatest = race.round === latestRound
                    const highlight = race.current || isLatest
                    return (
                        <div
                            key={race.round}
                            ref={highlight ? highlightRef : null}
                            className={`shrink-0 min-w-41.25 rounded-lg px-4.5 py-3.5 border transition-colors
                                ${highlight
                                    ? 'border-[#e8002d] bg-[#e8002d]/5'
                                    : race.done
                                        ? 'border-card-border bg-[#111113] opacity-50'
                                        : 'border-card-border bg-[#111113] hover:border-white/15'
                                }`}
                        >
                            <div className={`font-condensed text-[0.67rem] font-semibold tracking-widest uppercase mb-1
                                ${highlight ? 'text-[#e8002d]' : 'text-[#555]'}`}>
                                Round {race.round}{race.current ? ' · Live' : isLatest ? ' · Latest' : ''}
                            </div>
                            <div className="font-condensed text-[0.95rem] font-bold uppercase tracking-[0.04em] mb-0.5">{race.name}</div>
                            <div className="text-[0.73rem] text-[#555] font-light">{race.date}</div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
