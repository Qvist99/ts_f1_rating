import { SupabaseClient } from "@supabase/supabase-js";
import {
  isConstructorStandingsComplete,
  isDriverStandingsComplete,
} from "./utils.ts";

export default async function syncStandings(
  supabase: SupabaseClient,
): Promise<void> {
  console.log("Syncing standings...");

  const now = new Date();
  const year = now.getFullYear();

  const { data: races, error: racesError } = await supabase
    .from("races")
    .select("id, date_start, date_end, sessions, meeting_key")
    .eq("is_cancelled", false)
    .order("date_end", { ascending: true });

  if (racesError) {
    console.error("Error fetching races:", racesError);
    return;
  }

  // Find the most recently finished point scoring session
  const completedPointSessions = (races ?? []).flatMap((race) =>
    (race.sessions as any[])
      .filter(
        (s) =>
          s.session_type === "Race" &&
          !s.is_cancelled &&
          new Date(s.date_end) < now,
      )
      .map((session) => ({ race, session }))
  );

  if (!completedPointSessions.length) {
    console.log("No completed point-scoring sessions yet, skipping...");
    return;
  }

  const { race: latestRace, session: latestPointSession } =
    completedPointSessions.reduce((latest, curr) =>
      new Date(curr.session.date_end) > new Date(latest.session.date_end)
        ? curr
        : latest
    );

  const latestSessionEnd = new Date(latestPointSession.date_end);

  const [
    { data: driverStandingsUpdate },
    { data: constructorStandingsUpdate },
  ] = await Promise.all([
    supabase
      .from("driver_standings")
      .select("updated_at")
      .eq("year", year)
      .maybeSingle(),
    supabase
      .from("constructor_standings")
      .select("updated_at")
      .eq("year", year)
      .maybeSingle(),
  ]);

  const driverStandingsUpdatedAt = driverStandingsUpdate?.updated_at
    ? new Date(driverStandingsUpdate.updated_at)
    : null;

  const constructorStandingsUpdatedAt = constructorStandingsUpdate?.updated_at
    ? new Date(constructorStandingsUpdate.updated_at)
    : null;

  // Skip only if both are up to date
  if (
    driverStandingsUpdatedAt && driverStandingsUpdatedAt > latestSessionEnd &&
    constructorStandingsUpdatedAt &&
    constructorStandingsUpdatedAt > latestSessionEnd
  ) {
    console.log("Standings already up to date, skipping...");
    return;
  }

  console.log(
    driverStandingsUpdatedAt
      ? "Standings outdated, syncing..."
      : "No standings found, creating...",
  );

  const meetingKey = latestRace.meeting_key;
  const sessionKey = latestPointSession.session_key;
  console.log(
    "Syncing standings for meeting:",
    meetingKey,
    "session:",
    sessionKey,
  );

  const [driverStandingsResponse, constructorStandingsResponse] = await Promise
    .all([
      fetch(
        `https://api.openf1.org/v1/championship_drivers?meeting_key=${meetingKey}&session_key=${sessionKey}`,
      ),
      fetch(
        `https://api.openf1.org/v1/championship_teams?meeting_key=${meetingKey}&session_key=${sessionKey}`,
      ),
    ]);

  if (!driverStandingsResponse.ok) {
    console.error(
      "Error fetching driver standings:",
      driverStandingsResponse.statusText,
    );
    return;
  }

  if (!constructorStandingsResponse.ok) {
    console.error(
      "Error fetching constructor standings:",
      constructorStandingsResponse.statusText,
    );
    return;
  }

  const [driverStandingsData, constructorStandingsData] = await Promise.all([
    driverStandingsResponse.json(),
    constructorStandingsResponse.json(),
  ]);

  if (!isDriverStandingsComplete(driverStandingsData)) {
    console.error("Driver standings data is incomplete, skipping...");
    return;
  }

  if (!isConstructorStandingsComplete(constructorStandingsData)) {
    console.error("Constructor standings data is incomplete, skipping...");
    return;
  }

  const updatedAt = new Date().toISOString();

  const [{ error: driverUpsertError }, { error: constructorUpsertError }] =
    await Promise.all([
      supabase
        .from("driver_standings")
        .upsert(
          { year, standings: driverStandingsData, updated_at: updatedAt },
          { onConflict: "year" },
        ),
      supabase
        .from("constructor_standings")
        .upsert({
          year,
          standings: constructorStandingsData,
          updated_at: updatedAt,
        }, { onConflict: "year" }),
    ]);

  if (driverUpsertError) {
    console.error("Error upserting driver standings:", driverUpsertError);
  } else console.log("Driver standings synced!");

  if (constructorUpsertError) {
    console.error(
      "Error upserting constructor standings:",
      constructorUpsertError,
    );
  } else console.log("Constructor standings synced!");
}
