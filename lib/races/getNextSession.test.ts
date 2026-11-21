import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getNextSession, getSessionWithBuffer } from "./getNextSession";
import type { RaceSession } from "../types";

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

const NOW = "2025-06-15T12:00:00Z";

describe("getNextSession", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(NOW));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("returns undefined for an empty array", () => {
        expect(getNextSession([])).toBeUndefined();
    });

    it("returns undefined when all sessions have already ended", () => {
        const sessions = [
            makeSession({
                session_key: "p1",
                date_start: "2025-06-15T08:00:00Z",
                date_end: "2025-06-15T09:00:00Z",
            }),
            makeSession({
                session_key: "p2",
                date_start: "2025-06-15T09:30:00Z",
                date_end: "2025-06-15T10:30:00Z",
            }),
        ];
        expect(getNextSession(sessions)).toBeUndefined();
    });

    it("returns a currently in-progress session (started, not yet ended)", () => {
        const inProgress = makeSession({
            session_key: "in-progress",
            date_start: "2025-06-15T11:30:00Z",
            date_end: "2025-06-15T13:00:00Z",
        });
        expect(getNextSession([inProgress])).toEqual(inProgress);
    });

    it("returns the earliest upcoming session, ignoring ones already finished", () => {
        const finished = makeSession({
            session_key: "finished",
            date_start: "2025-06-15T08:00:00Z",
            date_end: "2025-06-15T09:00:00Z",
        });
        const nextUp = makeSession({
            session_key: "next-up",
            date_start: "2025-06-15T14:00:00Z",
            date_end: "2025-06-15T15:00:00Z",
        });
        const later = makeSession({
            session_key: "later",
            date_start: "2025-06-16T14:00:00Z",
            date_end: "2025-06-16T15:00:00Z",
        });

        // deliberately out of order to confirm sorting happens
        expect(getNextSession([later, finished, nextUp])).toEqual(nextUp);
    });

    it("treats a session ending exactly at 'now' as already finished", () => {
        const endingNow = makeSession({ date_end: NOW });
        expect(getNextSession([endingNow])).toBeUndefined();
    });

    it("does not mutate the original sessions array", () => {
        const sessions = [
            makeSession({
                session_key: "b",
                date_start: "2025-06-15T14:00:00Z",
            }),
            makeSession({
                session_key: "a",
                date_start: "2025-06-15T08:00:00Z",
            }),
        ];
        const originalOrder = sessions.map((s) => s.session_key);

        getNextSession(sessions);

        expect(sessions.map((s) => s.session_key)).toEqual(originalOrder);
    });
});

describe("getSessionWithBuffer", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(NOW));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("returns undefined for an empty array", () => {
        expect(getSessionWithBuffer([], 15)).toBeUndefined();
    });

    it("returns the session when now falls within its actual start/end", () => {
        const session = makeSession({
            date_start: "2025-06-15T11:30:00Z",
            date_end: "2025-06-15T13:00:00Z",
        });
        expect(getSessionWithBuffer([session], 15)).toEqual(session);
    });

    it("returns undefined when now is well outside the session and its buffer", () => {
        const session = makeSession({
            date_start: "2025-06-15T08:00:00Z",
            date_end: "2025-06-15T09:00:00Z",
        });
        expect(getSessionWithBuffer([session], 15)).toBeUndefined();
    });

    it("returns the session when now is within the pre-start buffer", () => {
        // session starts 12:10, now is 12:00 -> 10 min before start
        const session = makeSession({
            date_start: "2025-06-15T12:10:00Z",
            date_end: "2025-06-15T13:00:00Z",
        });
        expect(getSessionWithBuffer([session], 15)).toEqual(session);
    });

    it("returns the session when now is within the post-end buffer", () => {
        // session ended 11:50, now is 12:00 -> 10 min after end
        const session = makeSession({
            date_start: "2025-06-15T11:00:00Z",
            date_end: "2025-06-15T11:50:00Z",
        });
        expect(getSessionWithBuffer([session], 15)).toEqual(session);
    });

    it("excludes a session just outside the buffer window", () => {
        // session ended 11:44, now is 12:00 -> 16 min after end, buffer is 15
        const session = makeSession({
            date_start: "2025-06-15T11:00:00Z",
            date_end: "2025-06-15T11:44:00Z",
        });
        expect(getSessionWithBuffer([session], 15)).toBeUndefined();
    });

    it("includes a session exactly at the buffer boundary (inclusive)", () => {
        // session ends exactly 15 min before now
        const session = makeSession({
            date_start: "2025-06-15T11:00:00Z",
            date_end: "2025-06-15T11:45:00Z",
        });
        expect(getSessionWithBuffer([session], 15)).toEqual(session);
    });

    it("behaves like an exact-time check when bufferMinutes is 0", () => {
        const session = makeSession({
            date_start: "2025-06-15T11:00:00Z",
            date_end: "2025-06-15T11:59:00Z", // ended 1 min before now
        });
        expect(getSessionWithBuffer([session], 0)).toBeUndefined();
    });

    it("returns the earliest matching session when multiple sessions overlap now (with buffer)", () => {
        const earlier = makeSession({
            session_key: "earlier",
            date_start: "2025-06-15T11:00:00Z",
            date_end: "2025-06-15T11:50:00Z", // within 15 min buffer of now
        });
        const later = makeSession({
            session_key: "later",
            date_start: "2025-06-15T12:05:00Z", // also within buffer of now
            date_end: "2025-06-15T13:00:00Z",
        });

        // out of order input to confirm sort-then-find behavior
        expect(getSessionWithBuffer([later, earlier], 15)).toEqual(earlier);
    });

    it("does not mutate the original sessions array", () => {
        const sessions = [
            makeSession({
                session_key: "b",
                date_start: "2025-06-15T14:00:00Z",
            }),
            makeSession({
                session_key: "a",
                date_start: "2025-06-15T08:00:00Z",
            }),
        ];
        const originalOrder = sessions.map((s) => s.session_key);

        getSessionWithBuffer(sessions, 15);

        expect(sessions.map((s) => s.session_key)).toEqual(originalOrder);
    });
});
