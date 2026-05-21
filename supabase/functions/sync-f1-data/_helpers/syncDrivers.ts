import { SupabaseClient } from "@supabase/supabase-js";

import type { DriverFromAPI } from "../_helpers/types.ts";

export default async function syncDrivers(
  supabase: SupabaseClient,
  throttle: () => Promise<void>,
  activeMeetingKey: number,
  meetingKeyToRaceId: Map<number, string>,
  meetingKeyToSessionKey: Map<number, number | undefined>,
): Promise<void> {
  const year = new Date().getFullYear();
  console.log(`Syncing drivers for meeting ${activeMeetingKey}...`);

  const raceId = meetingKeyToRaceId.get(activeMeetingKey);
  const sessionKey = meetingKeyToSessionKey.get(activeMeetingKey);

  if (!raceId) {
    console.error(`No race_id found for meeting ${activeMeetingKey}`);
    return;
  }

  if (!sessionKey) {
    console.error(`No race session_key found for meeting ${activeMeetingKey}`);
    return;
  }

  await throttle();

  const res = await fetch(
    `https://api.openf1.org/v1/drivers?session_key=${sessionKey}`,
  );

  if (!res.ok) {
    console.error(
      `Failed to fetch drivers for session ${sessionKey}: ${res.status}`,
    );
    return;
  }

  const driversRaw = await res.json() as DriverFromAPI[];

  // dedupe just in case the api for some reason returns duplicate drivers for a session
  const uniqueDrivers = [...new Map(
    driversRaw.map((d) => [d.driver_number, d]),
  ).values()];

  const driversToUpsert = uniqueDrivers.map((driver) => ({
    driver_number: driver.driver_number,
    year,
    first_name: driver.first_name,
    last_name: driver.last_name,
    team_name: driver.team_name,
    team_color: driver.team_colour,
    acronym: driver.name_acronym,
    headshot_url: driver.headshot_url,
  }));

  const { data: upsertedDrivers, error: driversError } = await supabase
    .from("drivers")
    .upsert(driversToUpsert, { onConflict: "driver_number, year" })
    .select("id, driver_number");

  if (driversError || !upsertedDrivers) {
    console.error(
      `Error upserting drivers for meeting ${activeMeetingKey}:`,
      driversError,
    );
    return;
  }

  console.log(`Drivers upserted: ${upsertedDrivers.length} rows`);

  const { error: deleteError } = await supabase
    .from("race_drivers")
    .delete()
    .eq("race_id", raceId);

  if (deleteError) {
    console.error(
      `Error clearing race_drivers for race ${raceId}:`,
      deleteError,
    );
    return;
  }

  const { error: insertError } = await supabase
    .from("race_drivers")
    .insert(upsertedDrivers.map((d) => ({ race_id: raceId, driver_id: d.id })));

  if (insertError) {
    console.error(
      `Error inserting race_drivers for race ${raceId}:`,
      insertError,
    );
    return;
  }

  console.log(`race_drivers updated for race ${raceId}`);
  console.log("Drivers sync complete!");
}
