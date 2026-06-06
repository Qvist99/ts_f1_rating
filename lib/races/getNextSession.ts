import { RaceSession } from "../types";

export function getNextSession(sessions: RaceSession[]) {
  const sorted = [...sessions].sort(
    (a, b) =>
      new Date(a.date_start).getTime() - new Date(b.date_start).getTime(),
  );

  const now = new Date();
  return sorted.find((session) => new Date(session.date_end) > now);
}

export function getSessionWithBuffer(
  sessions: RaceSession[],
  bufferMinutes: number,
) {
  const sorted = [...sessions].sort(
    (a, b) =>
      new Date(a.date_start).getTime() - new Date(b.date_start).getTime(),
  );

  const now = new Date();
  const buffer = bufferMinutes * 60 * 1000;

  return sorted.find((session) => {
    const start = new Date(session.date_start).getTime() - buffer;
    const end = new Date(session.date_end).getTime() + buffer;
    return now.getTime() >= start && now.getTime() <= end;
  });
}
