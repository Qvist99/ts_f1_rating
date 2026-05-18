'use client'
import { createClient } from "@/lib/supabase/client"
import { RaceWithRatings } from "@/lib/types"

import { useRating } from "@/lib/hooks/useRating"
import { RatingButtons } from "./RatingButtons"


export default function DriverGridFooter({ race }: {
    race: RaceWithRatings

}) {
    const supabase = createClient()

    const { localRating, borderState, handleRate } = useRating({
        initialRating: race.race_ratings?.[0]?.rating,
        onSave: async (val) => await supabase
            .from("race_ratings")
            .upsert(
                { race_id: race.id, meeting_key: race.meeting_key, rating: val },
                { onConflict: "race_id, user_id" }
            )
    })


    const borderClass = {
        idle: 'border-t border-[#282D33] bg-[#161B22]',
        updating: 'border-t border-amber-600 bg-[#1a1608]',
        saving: 'border-t border-amber-600 bg-[#1a1608]',
        saved: 'border-t border-green-700 bg-[#0f1a10]',
        error: 'border-t border-red-800 bg-[#1a0f0f]',
    }[borderState]


    return (
        <div className={`fixed bottom-0 w-full -mx-36 px-36 py-3 flex items-center gap-6 transition-colors duration-200 ${borderClass}`}>
            {/* Race info */}
            <div className="flex flex-col gap-0.5 min-w-32 flex-shrink-0">
                <span className="text-[10px] text-[#3E4248] uppercase tracking-wider font-condensed">Rate the race</span>
                <span className="text-sm font-medium text-[#a1a1aa]">{race.country_name}</span>
                <span className="text-[11px] text-[#3E4248]">Round {race.round}</span>
            </div>

            <div className="w-px h-8 bg-[#282D33] flex-shrink-0" />

            {/* Rating */}
            <RatingButtons value={localRating} onChange={handleRate} type="race" />
        </div>
    )
}
