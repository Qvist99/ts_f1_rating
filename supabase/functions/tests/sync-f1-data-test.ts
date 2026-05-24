import { assertEquals } from "jsr:@std/assert@1";

import findActiveMeeting from "../sync-f1-data/_helpers/findActiveMeeting.ts";
import type {
  Race,
  Session,
} from "../sync-f1-data/_helpers/findActiveMeeting.ts";

const hoursFromNow = (hours: number): string =>
  new Date(Date.now() + hours * 3600000).toISOString();

const makeSession = (
  type: string,
  startHours: number,
  endHours: number,
  cancelled = false,
): Session => ({
  session_key: Math.floor(Math.random() * 10000),
  session_name: type,
  session_type: type,
  date_start: hoursFromNow(startHours),
  date_end: hoursFromNow(endHours),
  is_cancelled: cancelled,
});

const makeRace = (sessions: Session[], meeting_key = 1234): Race => ({
  meeting_key,
  sessions,
});

// ─── Tests ────────────────────────────────────────────────────────────────────

Deno.test("findActiveMeeting: returns null for empty array", () => {
  assertEquals(findActiveMeeting([]), null);
});

Deno.test("findActiveMeeting: returns null when FP1 has not finished yet", () => {
  const race = makeRace([
    makeSession("Practice", 1, 2), // FP1 in future
    makeSession("Race", 48, 50),
  ]);
  assertEquals(findActiveMeeting([race]), null);
});

Deno.test("findActiveMeeting: returns null when race has already finished", () => {
  const race = makeRace([
    makeSession("Practice", -10, -8), // FP1 done
    makeSession("Race", -3, -1), // race done
  ]);
  assertEquals(findActiveMeeting([race]), null);
});

Deno.test("findActiveMeeting: returns meeting_key when inside active window", () => {
  const race = makeRace([
    makeSession("Practice", -5, -4), // FP1 done
    makeSession("Race", 2, 4), // race not done
  ], 1254);
  assertEquals(findActiveMeeting([race]), 1254);
});

Deno.test("findActiveMeeting: ignores cancelled practice sessions", () => {
  const race = makeRace([
    makeSession("Practice", -5, -4, true), // cancelled
    makeSession("Race", 2, 4),
  ]);
  assertEquals(findActiveMeeting([race]), null);
});

Deno.test("findActiveMeeting: ignores cancelled race sessions", () => {
  const race = makeRace([
    makeSession("Practice", -5, -4),
    makeSession("Race", 2, 4, true), // cancelled
  ]);
  assertEquals(findActiveMeeting([race]), null);
});

Deno.test("findActiveMeeting: uses earliest practice session as window open", () => {
  const race = makeRace([
    makeSession("Practice", -8, -6), // FP1 done
    makeSession("Practice", -5, -3), // FP2 done
    makeSession("Practice", -2, -1), // FP3 done
    makeSession("Race", 2, 4),
  ], 1254);
  assertEquals(findActiveMeeting([race]), 1254);
});

Deno.test("findActiveMeeting: returns null when only practice sessions exist", () => {
  const race = makeRace([
    makeSession("Practice", -5, -4),
  ]);
  assertEquals(findActiveMeeting([race]), null);
});

Deno.test("findActiveMeeting: returns null when only race session exists", () => {
  const race = makeRace([
    makeSession("Race", 2, 4),
  ]);
  assertEquals(findActiveMeeting([race]), null);
});

Deno.test("findActiveMeeting: returns correct meeting_key with multiple races", () => {
  const pastRace = makeRace([
    makeSession("Practice", -20, -18),
    makeSession("Race", -10, -8), // already finished
  ], 1111);

  const activeRace = makeRace([
    makeSession("Practice", -5, -4), // FP1 done
    makeSession("Race", 2, 4), // race not done
  ], 2222);

  const futureRace = makeRace([
    makeSession("Practice", 10, 12),
    makeSession("Race", 48, 50),
  ], 3333);

  assertEquals(findActiveMeeting([pastRace, activeRace, futureRace]), 2222);
});
