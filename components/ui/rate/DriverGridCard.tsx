"use client"
import { DriverWithRatings, RaceWithRatings } from "@/lib/types"
import { RatingButtons } from "./RatingButtons"
import { createClient } from "@/lib/supabase/client"
import { useRating } from "@/lib/hooks/useRating"

export default function DriverGridCard({ driver, race, }: { driver: DriverWithRatings, race: RaceWithRatings, }) {
    const supabase = createClient()

    const { localRating, borderState, handleRate } = useRating({
        initialRating: driver.driver_ratings?.[0]?.rating,
        onSave: async (val) => await supabase
            .from('driver_ratings')
            .upsert(
                { driver_id: driver.id, race_id: race.id, meeting_key: race.meeting_key, rating: val },
                { onConflict: 'driver_id, race_id, user_id' }
            ),
        type: "driver"
    })


    const borderClass = {
        idle: localRating ? 'border-l-2 border-l-[#e10600] border border-card-border' : 'border border-card-border',
        updating: 'border border-amber-500/40 bg-amber-500/5',
        saving: 'border border-amber-500/40 bg-amber-500/5',
        saved: 'border border-green-500/30 bg-green-500/5',
        error: 'border border-red-500/40 bg-red-500/5',
    }[borderState]


    return (
        <div className={`rounded-lg p-5 flex flex-col gap-4 bg-card-bg transition-colors duration-200 ${borderClass}`}>

            {/* Driver info */}
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <span className="text-[17px] font-medium text-[#e8eaf2]">{driver.first_name} {driver.last_name}</span>
                    <span className="text-xs text-[#3E4248]">{driver.team_name}</span>
                </div>
                <div className="w-[3px] min-h-[52px] rounded" style={{ background: `#${driver.team_color}` }} />
            </div>

            {/* Rating */}
            <RatingButtons value={localRating} onChange={handleRate} type="driver" />
        </div>
    )
}

