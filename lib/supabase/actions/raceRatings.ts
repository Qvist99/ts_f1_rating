"use server";
import { getAuthenticatedUser } from "@/lib/supabase/queries/auth";

export async function upsertRaceRating(
    raceId: string,
    meetingKey: number,
    rating: number,
) {
    const { supabase } = await getAuthenticatedUser();

    return supabase
        .from("race_ratings")
        .upsert(
            { race_id: raceId, meeting_key: meetingKey, rating: rating },
            { onConflict: "race_id, user_id" },
        );
}
