"use client"
import { useState } from "react"
import Link from "next/link"
import { Races } from "@/lib/types"
import { getLatestRace } from "@/lib/races/getLatestRace"
import SectionLabel from "./SectionLabel"

interface FanOpinionProps {
    races: Races[] | null
}


const COMMENTS = [
    { positive: true, text: 'Drove out of his skin considering where the car was' },
    { positive: true, text: 'Impressive pace in the wet — kept it clean all race' },
    { positive: true, text: 'Best of the rest given what RB gave him' },
    { positive: false, text: 'Not his best weekend, made a few uncharacteristic errors' },
    { positive: false, text: 'Expected more from a driver of his calibre' },
]

export default function FanOpinion({ races }: FanOpinionProps) {
    const [selected, setSelected] = useState(7)
    const latestRace = getLatestRace(races)

    return (
        <section id="fan-opinion" className="py-24 border-t border-card-border grid grid-cols-2 gap-20 items-center -mx-10 px-10">
            {/* Copy */}
            <div>
                <SectionLabel>Fan Opinion</SectionLabel>
                <h2 className="font-condensed font-extrabold text-[clamp(2rem,3.5vw,3.2rem)] uppercase tracking-[-0.01em] leading-none mb-8 max-w-120">
                    Say exactly what you think
                </h2>
                <p className="text-[0.95rem] text-[#888] font-light leading-[1.75] max-w-100 mb-4">
                    Score each driver from 1 to 10 after every round. Leave a positive or negative comment. Watch your opinion stack up against thousands of fans worldwide.
                </p>
                <p className="text-[0.95rem] text-[#888] font-light leading-[1.75] max-w-100">
                    Fan ratings are independent of championship points — a driver can lead the standings and still be rated poorly by the crowd. That's the whole point.
                </p>
                <div className="mt-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 bg-[#e8002d] text-white font-condensed font-bold text-[0.9rem] tracking-[0.08em] uppercase py-3 px-5.5 rounded-[3px] hover:bg-[#ff1a45] transition-all hover:-translate-y-px"
                    >
                        Open the App
                    </Link>
                </div>
            </div>

            {/* Rating mock */}
            <div className="bg-[#111113] border border-card-border rounded-[6px] overflow-hidden">
                <div className="flex items-center justify-between px-4.5 py-3.5 border-b border-card-border">
                    <div className="font-condensed font-bold text-[0.85rem] uppercase tracking-[0.08em] text-[#888]">
                        Max Verstappen · Red Bull #1
                    </div>
                    <div className="font-condensed text-[0.7rem] text-[#555] tracking-[0.06em]">{latestRace ? `${latestRace.race_name} · R${latestRace.round}` : 'Canadian GP · R7'}</div>
                </div>

                <div className="grid px-4.5 py-5 border-b border-card-border" style={{ gridTemplateColumns: '1fr auto' }}>
                    <div>
                        <div className="font-condensed text-[1.15rem] font-bold uppercase tracking-[0.04em]">Rate This Driver</div>
                        <div className="text-[0.75rem] text-[#555] mt-0.5">Your rating for the race</div>
                    </div>
                    <div className="font-condensed text-[2.8rem] font-black leading-none">
                        {selected}<span className="text-base text-[#555] font-normal">/10</span>
                    </div>
                </div>

                <div className="flex gap-1.25 px-4.5 py-3.5 border-b border-card-border">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                        <button
                            key={n}
                            onClick={() => setSelected(n)}
                            className={`flex-1 py-2.25 rounded-[3px] font-condensed text-[0.85rem] font-bold cursor-pointer text-center border transition-all
                ${selected === n
                                    ? 'bg-[#e8002d] border-[#e8002d] text-white'
                                    : 'bg-white/4 border-card-border text-[#888] hover:bg-white/8 hover:text-[#f0f0f0]'
                                }`}
                        >
                            {n}
                        </button>
                    ))}
                </div>

                <div className="px-4.5 py-3.5">
                    <div className="text-[0.7rem] text-[#555] uppercase tracking-[0.08em] mb-2.5">Fan Comments</div>
                    {COMMENTS.map((c, i) => (
                        <div key={i} className="flex gap-2.5 py-2 border-t border-card-border text-[0.82rem] items-start">
                            <span className={`text-[0.68rem] mt-0.5 shrink-0 ${c.positive ? 'text-green-500' : 'text-[#e8002d]'}`}>
                                {c.positive ? '▲' : '▼'}
                            </span>
                            <span className="text-[#888] font-light">{c.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
