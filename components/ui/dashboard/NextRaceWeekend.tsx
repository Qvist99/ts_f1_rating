import { createClient } from "@/lib/supabase/server"
import Image from "next/image";
import NextSession from "../NextSession";
import WeatherAtTrack from "../WeatherAtTrack";


export default async function NextRaceWeekend() {
    const supabase = await createClient();

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    //TODO

    // Either fetch all races and filter out the closest race or make it a date field in supabase so we can query it directly.
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

    return (
        <div className="relative">
            <div className="flex justify-between">
                <div className="flex gap-4 items-center justify-center">
                    {/* Find svgs for the countries and map them instead as the images from the api are suboptimal */}
                    <div className="w-[45px] h-[45px] rounded-full overflow-hidden relative">
                        <Image src={raceData.country_flag_url} alt={raceData.country_name} fill className="object-cover" />
                    </div>

                    <div>
                        <h2 className="text-base text-text-primary font-bold">{raceData.race_name}</h2>
                        <p className="text-[1.125rem] text-text-muted font-bold">{raceData.circuit_name}</p>
                    </div>


                </div>

                <div>
                    <Image src={raceData.circuit_image_url} alt={raceData.circuit_name} width={105} height={0} style={{ height: "auto" }} />
                </div>

            </div>

            <div className="flex justify-between items-stretch">
                {/* Next session component - track weather box and Rate drivers button */}
                <div className="flex gap-4">
                    <NextSession sessions={raceData.sessions} />
                    <WeatherAtTrack sessions={raceData.sessions} meetingKey={raceData.meeting_key} />
                </div>

                <div className="flex flex-col justify-end">
                    <button>Rate Drivers</button>
                </div>
            </div>

        </div>
    )
}
