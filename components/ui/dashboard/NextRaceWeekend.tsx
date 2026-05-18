import { createClient } from "@/lib/supabase/server"
import Image from "next/image";
import NextSession from "../NextSession";
import WeatherAtTrack from "../WeatherAtTrack";
import { Star } from "lucide-react";
import Link from "next/link";

export default async function NextRaceWeekend() {
    const supabase = await createClient();

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const { data: raceData, error: raceDataError } = await supabase
        .from("races")
        .select("*")
        .eq("is_cancelled", false)
        .gt("date_end", twoDaysAgo.toISOString())
        .order("date_start", { ascending: true })
        .limit(1)
        .single();


    if (raceDataError) {
        console.error("Error fetching race data:", raceDataError);
        return null;
    }

    const isRaceWeekStarted = new Date(raceData.date_start) <= new Date();

    const startDate = new Date(raceData.date_start).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const endDate = new Date(raceData.date_end).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const dateDisplay = startDate === endDate ? startDate : `${startDate} - ${endDate}`;

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between mb-3">
                <div className="flex gap-4 items-center justify-center">
                    {/* Find svgs for the countries and map them instead as the images from the api are suboptimal */}
                    <div className="w-[40px] h-[40px] rounded-full overflow-hidden relative">
                        <Image src={raceData.country_flag_url} alt={raceData.country_name} fill className="object-cover" />
                    </div>

                    <div>
                        <h2 className="text-xl text-text-primary font-bold leading-none mb-0 font-condensed">{raceData.race_name}</h2>
                        <p className="text-sm text-text-muted font-bold">{raceData.circuit_name} - Round {raceData.round}</p>
                    </div>


                </div>

                <div>
                    <Image src={raceData.circuit_image_url} alt={raceData.circuit_name} width={70} height={0} style={{ height: "auto" }} />
                </div>

            </div>

            <div className="flex justify-between gap-4 border-t border-b border-card-border -mx-4 px-4 -my-2 py-2">
                {/* Next session component - track weather box and Rate drivers button */}
                <NextSession sessions={raceData.sessions} />
                <div className="flex w-[30%]  rounded">
                    <WeatherAtTrack sessions={raceData.sessions} meetingKey={raceData.meeting_key} />
                </div>

            </div>

            <div className="flex justify-between items-center mt-4 h-full w-full">
                <p className="text-text-muted font-bold">{dateDisplay}</p>

                {isRaceWeekStarted ? (

                    <Link
                        href={`dashboard/rate/${raceData.id}`}
                        className="flex gap-2 items-center px-4 py-2 border border-gray-600 hover:border-gray-400 rounded-md text-sm transition-colors font-condensed font-bold"

                    >
                        <Star size={16} />
                        Rate Drivers
                    </Link>
                ) : (
                    <span title="Will be made available when FP1 starts" className="flex gap-2 items-center px-4 py-2 bg-gray-700 text-gray-500 rounded-md cursor-not-allowed font-condensed font-bold">
                        <Star size={16} />
                        Rate Drivers
                    </span>
                )
                }
            </div>

        </div>
    )
}
