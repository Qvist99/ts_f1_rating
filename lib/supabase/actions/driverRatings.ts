"use server";
import { getAuthenticatedUser } from "@/lib/supabase/queries/auth";

export async function upsertDriverRating(
    driverId: string,
    raceId: string,
    meetingKey: number,
    rating: number,
) {
    const { supabase } = await getAuthenticatedUser();

    return supabase
        .from("driver_ratings")
        .upsert(
            {
                driver_id: driverId,
                race_id: raceId,
                meeting_key: meetingKey,
                rating: rating,
            },
            { onConflict: "driver_id, race_id, user_id" },
        );
}
