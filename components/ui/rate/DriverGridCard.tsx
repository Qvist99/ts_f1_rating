"use client"
import { DriverWithRatings, RaceWithRatings } from "@/lib/types"
import { RatingButtons } from "./RatingButtons"
import { useRating } from "@/lib/hooks/useRating"
import { upsertDriverRating } from "@/lib/supabase/actions/driverRatings"

export default function DriverGridCard({ driver, race, }: { driver: DriverWithRatings, race: RaceWithRatings, }) {

    const { localRating, outlineState, handleRate } = useRating({
        initialRating: driver.driver_ratings?.[0]?.rating,
        onSave: async (val) => await upsertDriverRating(driver.id, race.id, race.meeting_key, val),
        type: "driver"
    })


    const outlineClass = {
        idle: localRating ? 'border-l-2 border-l-green-500 outline outline-card-border' : 'outline outline-card-border',
        updating: 'outline outline-amber-500/40 bg-amber-500/5',
        saving: 'outline outline-amber-500/40 bg-amber-500/5',
        saved: 'outline outline-green-500/30 bg-green-500/5',
        error: 'outline outline-red-500/40 bg-red-500/5',
    }[outlineState]


    return (
        <div className={`p-5 flex flex-col gap-4 bg-card-bg transition-colors duration-200 ${outlineClass}`}>

            {/* Driver info */}
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <span className="text-[17px] font-medium text-text-primary">{driver.first_name} {driver.last_name}</span>
                    <span className="text-xs text-[#3E4248]">{driver.team_name}</span>
                </div>
                <div className="w-0.75 min-h-13 rounded" style={{ background: `#${driver.team_color}` }} />
            </div>

            {/* Rating */}
            <RatingButtons value={localRating} onChange={handleRate} type="driver" />
        </div>
    )
}

