import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getLatestRace } from "./getLatestRace";
import type { Races, RaceSession } from "@/lib/types";

function makeSession(overrides: Partial<RaceSession> = {}): RaceSession {
    return {
        date_start: "2025-06-15T10:00:00Z",
        date_end: "2025-06-15T11:00:00Z",
        is_cancelled: false,
        session_name: "Race",
        session_type: "Race",
        session_key: "session-1",
        ...overrides,
    };
}

function makeRace(overrides: Partial<Races> = {}): Races {
    return {
        circuit_image_url: "https://example.com/circuit.jpg",
        circuit_name: "Test Circuit",
        country_flag_url: "https://example.com/flag.png",
        country_name: "Testland",
        date_end: "2025-06-15T16:00:00Z",
        date_start: "2025-06-15T13:00:00Z",
        id: "race-1",
        is_cancelled: false,
        meeting_key: 1,
        race_location: "Test City",
        race_name: "Test Grand Prix",
        race_official_name: "Formula 1 Test Grand Prix 2025",
        round: 1,
        sessions: [makeSession()],
        ...overrides,
    };
}

describe("getLatestRace", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("returns undefined when races is null", () => {
        expect(getLatestRace(null)).toBeUndefined();
    });

    it("returns undefined when races is an empty array", () => {
        expect(getLatestRace([])).toBeUndefined();
    });

    it("returns undefined when all races are in the future", () => {
        const races = [
            makeRace({ id: "future-1", date_start: "2025-07-01T00:00:00Z" }),
            makeRace({ id: "future-2", date_start: "2025-08-01T00:00:00Z" }),
        ];
        expect(getLatestRace(races)).toBeUndefined();
    });

    it("returns the most recent past race among a mix of past and future races", () => {
        const mostRecentPast = makeRace({
            id: "most-recent-past",
            date_start: "2025-06-01T00:00:00Z",
        });

        const races = [
            makeRace({ id: "future", date_start: "2025-08-01T00:00:00Z" }),
            mostRecentPast,
            makeRace({ id: "older-past", date_start: "2025-01-01T00:00:00Z" }),
        ];

        expect(getLatestRace(races)).toEqual(mostRecentPast);
    });

    it("returns the single race when it is in the past", () => {
        const race = makeRace({ date_start: "2025-06-01T00:00:00Z" });
        expect(getLatestRace([race])).toEqual(race);
    });

    it("does not mutate the original races array", () => {
        const races = [
            makeRace({ id: "a", date_start: "2025-01-01T00:00:00Z" }),
            makeRace({ id: "b", date_start: "2025-02-01T00:00:00Z" }),
        ];
        const originalOrder = races.map((r) => r.id);

        getLatestRace(races);

        expect(races.map((r) => r.id)).toEqual(originalOrder);
    });

    it("treats a race starting at exactly 'now' as not yet past", () => {
        const raceNow = makeRace({ date_start: "2025-06-15T12:00:00Z" });
        expect(getLatestRace([raceNow])).toBeUndefined();
    });
});
