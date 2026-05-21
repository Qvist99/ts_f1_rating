// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import createRateLimiter from "./_helpers/createRateLimiter.ts";
import syncDrivers from "./_helpers/syncDrivers.ts";
import syncRaces from "./_helpers/syncRaces.ts";
import findActiveMeeting from "./_helpers/findActiveMeeting.ts";
import { createClient } from "@supabase/supabase-js";

console.log("sync-f1-data function started");

Deno.serve(async (req) => {
  const authHeader = req.headers.get("Authorization");
  const cronSecret = Deno.env.get("CRON_SECRET");

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const throttle = createRateLimiter(20);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Respond immediately
  const response = new Response(
    JSON.stringify({ message: "Sync started" }),
    { headers: { "Content-Type": "application/json" } },
  );

  // Run sync in background — Deno will keep the process alive until this resolves
  EdgeRuntime.waitUntil(
    (async () => {
      try {
        const { meetingKeyToRaceId, meetingKeyToSessionKey, racesData } =
          await syncRaces(supabase, throttle);

        const activeMeetingKey = findActiveMeeting(racesData);

        if (!activeMeetingKey) {
          console.log("No driver sync needed");
          return;
        }

        await syncDrivers(
          supabase,
          throttle,
          activeMeetingKey,
          meetingKeyToRaceId,
          meetingKeyToSessionKey,
        );
      } catch (err) {
        console.error("Unhandled error in sync:", err);
      }
    })(),
  );

  return response;
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/sync-f1-data' \
  --header 'Authorization: Bearer <YOUR_CRON_SECRET>' \
  --header 'Content-Type: application/json'

*/
