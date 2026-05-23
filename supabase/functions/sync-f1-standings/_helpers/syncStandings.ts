import { SupabaseClient } from "@supabase/supabase-js";

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

  // Find closest race weekend to now
  const closestRace = races?.reduce((prev, curr) => {
    const prevDiff = Math.abs(
      new Date(prev.date_end).getTime() - now.getTime(),
    );
    const currDiff = Math.abs(
      new Date(curr.date_end).getTime() - now.getTime(),
    );
    return currDiff < prevDiff ? curr : prev;
  });

  const pointScoringSessions = closestRace.sessions.filter(
    (s: { session_type: string; date_end: string; is_cancelled: boolean }) =>
      s.session_type === "Race" &&
      !s.is_cancelled &&
      new Date(s.date_end) < now,
  );

  if (!pointScoringSessions.length) {
    console.log("No completed point-scoring sessions yet, skipping...");
    return;
  }

  const latestPointSession = pointScoringSessions.sort(
    (a: { date_end: string }, b: { date_end: string }) =>
      new Date(b.date_end).getTime() - new Date(a.date_end).getTime(),
  )[0];

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

  const meetingKey = closestRace.meeting_key;
  const sessionKey = latestPointSession.session_key;

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
