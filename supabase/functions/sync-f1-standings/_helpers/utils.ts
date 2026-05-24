export type DriverStandingFromApi = {
  meeting_key: number;
  session_key: number;
  driver_number: number;
  position_start: number;
  position_current: number;
  points_start: number;
  points_current: number;
};

export type ConstructorStandingFromApi = {
  meeting_key: number;
  session_key: number;
  team_name: string;
  position_start: number;
  position_current: number;
  points_start: number;
  points_current: number;
};

const MIN_DRIVERS = 22;
const MIN_CONSTRUCTORS = 11;

export function isDriverStandingsComplete(standings: DriverStandingFromApi[]) {
  if (standings.length < MIN_DRIVERS) return false;
  return standings.every(
    (s) =>
      s.points_current !== null &&
      s.position_current !== null &&
      s.position_start !== null &&
      s.driver_number !== null,
  );
}

export function isConstructorStandingsComplete(
  standings: ConstructorStandingFromApi[],
) {
  if (standings.length < MIN_CONSTRUCTORS) return false;
  return standings.every(
    (s) =>
      s.points_current !== null &&
      s.position_current !== null &&
      s.position_start !== null &&
      s.team_name !== null,
  );
}
