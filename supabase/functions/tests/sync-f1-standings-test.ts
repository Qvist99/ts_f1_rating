import { assertEquals } from "jsr:@std/assert@1";

import {
    isConstructorStandingsComplete,
    isDriverStandingsComplete,
} from "../sync-f1-standings/_helpers/utils.ts";
import type {
    ConstructorStandingFromApi,
    DriverStandingFromApi,
} from "../sync-f1-standings/_helpers/utils.ts";

const makeDriver = (
    overrides: Partial<DriverStandingFromApi> = {},
): DriverStandingFromApi => ({
    meeting_key: 1285,
    session_key: 11286,
    driver_number: 1,
    position_start: 1,
    position_current: 1,
    points_start: 100,
    points_current: 125,
    ...overrides,
});

const makeConstructor = (
    overrides: Partial<ConstructorStandingFromApi> = {},
): ConstructorStandingFromApi => ({
    meeting_key: 1285,
    session_key: 11286,
    team_name: "Red Bull Racing",
    position_start: 1,
    position_current: 1,
    points_start: 100,
    points_current: 125,
    ...overrides,
});

const makeDrivers = (
    count: number,
    overrides: Partial<DriverStandingFromApi> = {},
) => Array.from(
    { length: count },
    (_, i) => makeDriver({ driver_number: i + 1, ...overrides }),
);

const makeConstructors = (
    count: number,
    overrides: Partial<ConstructorStandingFromApi> = {},
) => Array.from(
    { length: count },
    (_, i) => makeConstructor({ team_name: `Team ${i + 1}`, ...overrides }),
);

Deno.test("isDriverStandingsComplete: returns false for empty array", () => {
    assertEquals(isDriverStandingsComplete([]), false);
});

Deno.test("isDriverStandingsComplete: returns false when fewer than 22 drivers", () => {
    assertEquals(isDriverStandingsComplete(makeDrivers(21)), false);
});

Deno.test("isDriverStandingsComplete: returns true for 22 complete drivers", () => {
    assertEquals(isDriverStandingsComplete(makeDrivers(22)), true);
});

Deno.test("isDriverStandingsComplete: returns true for more than 22 drivers", () => {
    assertEquals(isDriverStandingsComplete(makeDrivers(23)), true);
});

Deno.test("isDriverStandingsComplete: returns false when position_current is null", () => {
    assertEquals(
        isDriverStandingsComplete(
            makeDrivers(22, { position_current: null as any }),
        ),
        false,
    );
});

Deno.test("isDriverStandingsComplete: returns false when position_start is null", () => {
    assertEquals(
        isDriverStandingsComplete(
            makeDrivers(22, { position_start: null as any }),
        ),
        false,
    );
});

Deno.test("isDriverStandingsComplete: returns false when points_current is null", () => {
    assertEquals(
        isDriverStandingsComplete(
            makeDrivers(22, { points_current: null as any }),
        ),
        false,
    );
});

Deno.test("isDriverStandingsComplete: returns false when driver_number is null", () => {
    assertEquals(
        isDriverStandingsComplete(
            makeDrivers(22, { driver_number: null as any }),
        ),
        false,
    );
});

// ─── Constructor standings tests ──────────────────────────────────────────────

Deno.test("isConstructorStandingsComplete: returns false for empty array", () => {
    assertEquals(isConstructorStandingsComplete([]), false);
});

Deno.test("isConstructorStandingsComplete: returns false when fewer than 11 constructors", () => {
    assertEquals(isConstructorStandingsComplete(makeConstructors(10)), false);
});

Deno.test("isConstructorStandingsComplete: returns true for 11 complete constructors", () => {
    assertEquals(isConstructorStandingsComplete(makeConstructors(11)), true);
});

Deno.test("isConstructorStandingsComplete: returns false when position_current is null", () => {
    assertEquals(
        isConstructorStandingsComplete(
            makeConstructors(11, { position_current: null as any }),
        ),
        false,
    );
});

Deno.test("isConstructorStandingsComplete: returns false when position_start is null", () => {
    assertEquals(
        isConstructorStandingsComplete(
            makeConstructors(11, { position_start: null as any }),
        ),
        false,
    );
});

Deno.test("isConstructorStandingsComplete: returns false when points_current is null", () => {
    assertEquals(
        isConstructorStandingsComplete(
            makeConstructors(11, { points_current: null as any }),
        ),
        false,
    );
});

Deno.test("isConstructorStandingsComplete: returns false when team_name is null", () => {
    assertEquals(
        isConstructorStandingsComplete(
            makeConstructors(11, { team_name: null as any }),
        ),
        false,
    );
});
