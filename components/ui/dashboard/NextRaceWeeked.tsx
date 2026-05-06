import { createClient } from "@/lib/supabase/server"
import Image from "next/image";
import NextSession from "../NextSession";


export default async function NextRaceWeeked() {
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

    console.log("raceData", raceData)


    // Fetch the weather data from the https://api.openf1.org/v1/weather?meeting_key=1284&session_key=latest endpoint. Gives us an array of the weather data where we want to only use the last element in the array

    // Need to have an placeholder for when the weather data is not yet available, Something like "tbc in place of the weather data and an svg of a sun with a question mark or something like that"

    // Display session times, country flag, circuit image, circuit name, country name, race name, maybe race location, 

    // Have a countdown timer that counts down to race start as this will give the user a link where it can go and rate the race and the drivers for this round

    // Only switch too the next race 2 days after the current race is finished too give users some time to finish their ratings


    return (
        <div>
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

            <div className="">
                {/* Next session component - track weather box and Rate drivers button */}
                <NextSession sessions={raceData.sessions} />
            </div>

        </div>
    )
}
