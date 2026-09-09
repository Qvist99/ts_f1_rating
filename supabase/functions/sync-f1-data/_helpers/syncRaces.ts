import { SupabaseClient } from "@supabase/supabase-js";

import type {
  RaceFromAPI,
  RaceFromDB,
  SessionFromAPI,
} from "../_helpers/types.ts";

async function fetchSessions(meetingKey: number) {
  const res = await fetch(
    `https://api.openf1.org/v1/sessions?meeting_key=${meetingKey}`,
  );

  if (!res.ok) {
    console.error(
      `Failed to fetch sessions for meeting ${meetingKey}: ${res.status}`,
    );
    return [];
  }

  const sessions = await res.json() as SessionFromAPI[];

  return sessions.map((s) => ({
    session_key: s.session_key,
    session_name: s.session_name,
    session_type: s.session_type,
    date_start: s.date_start,
    date_end: s.date_end,
    is_cancelled: s.is_cancelled,
  }));
}

export default async function syncRaces(
  supabase: SupabaseClient,
  throttle: () => Promise<void>,
): Promise<{
  meetingKeyToRaceId: Map<number, string>;
  meetingKeyToSessionKey: Map<number, number | undefined>;
  racesData: RaceFromDB[];
}> {
  const year = new Date().getFullYear();
  console.log(`Syncing races for ${year}...`);

  const res = await fetch(`https://api.openf1.org/v1/meetings?year=${year}`);

  if (!res.ok) {
    console.error(`Failed to fetch races: ${res.status}`);
    return {
      meetingKeyToRaceId: new Map(),
      meetingKeyToSessionKey: new Map(),
      racesData: [],
    };
  }

  // remove the testing rounds and sort by date so we can increment the round number correctly
  const racesRaw = (await res.json() as RaceFromAPI[])
    .filter((race) => !race.meeting_name.toLowerCase().includes("testing"))
    .sort((a, b) =>
      new Date(a.date_start).getTime() - new Date(b.date_start).getTime()
    );

  const racesToUpsert = [];

  for (const [index, race] of racesRaw.entries()) {
    await throttle();

    const sessions = await fetchSessions(race.meeting_key);

    racesToUpsert.push({
      meeting_key: race.meeting_key,
      round: index + 1,
      circuit_name: race.circuit_short_name,
      circuit_image_url: race.circuit_image,
      country_flag_url: race.country_flag,
      country_name: race.country_name,
      date_start: race.date_start,
      date_end: race.date_end,
      is_cancelled: race.is_cancelled,
      race_name: race.meeting_name,
      race_location: race.location,
      race_official_name: race.meeting_official_name,
      sessions,
    });
  }

  const { data, error } = await supabase
    .from("races")
    .upsert(racesToUpsert, { onConflict: "meeting_key" })
    .select("id, meeting_key, sessions");

  if (error || !data) {
    console.error("Error upserting races:", error);
    return {
      meetingKeyToRaceId: new Map(),
      meetingKeyToSessionKey: new Map(),
      racesData: [],
    };
  }

  const meetingKeyToRaceId = new Map(data.map((r) => [r.meeting_key, r.id]));
  const meetingKeyToSessionKey = new Map(
    data.map((r) => [
      r.meeting_key,
      r.sessions.find((s: { session_type: string }) =>
        s.session_type === "Race"
      )?.session_key,
    ]),
  );

  console.log(`Races sync complete! ${data.length} rows upserted`);

  return { meetingKeyToRaceId, meetingKeyToSessionKey, racesData: data };
}
