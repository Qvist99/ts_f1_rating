import { RaceSession } from "../types";


export function getNextSession(sessions: RaceSession[]) {
  const sorted = [...sessions].sort(
    (a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime()
  );

  const now = new Date();
  return sorted.find(session => new Date(session.date_end) > now);
}
