import { createClient } from "@/lib/supabase/server"


export default async function NextRaceWeeked() {
    await new Promise(resolve => setTimeout(resolve, 2000))

    //TODO

    // Either fetch all races and filter out the closest race or make it a date field in supabase so we can query it directly.

    // Fetch the weather data from the https://api.openf1.org/v1/weather?meeting_key=1284&session_key=latest endpoint. Gives us an array of the weather data where we want to only use the last element in the array

    // Need to have an placeholder for when the weather data is not yet available, Something like "tbc in place of the weahter data and an svg of a sun with a question mark or something like that"

    // Display session times, country flag, circuit image, circuit name, country name, race name, maybe race location, 

    // Have a countdown timer that counts down to race start as this will give the user a link where it can go and rate the race and the drivers for this round

    // Only switch too the next race 2 days after the current race is finished too give users some time to finish their ratings


    return (
        <div>NextRaceWeeked</div>
    )
}
