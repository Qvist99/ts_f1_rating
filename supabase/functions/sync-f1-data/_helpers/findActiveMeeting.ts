interface Session {
  session_key: number;
  session_name: string;
  session_type: string;
  date_start: string;
  date_end: string;
  is_cancelled: boolean;
}

interface Race {
  meeting_key: number;
  sessions: Session[];
}

export default function findActiveMeeting(races: Race[]): number | null {
  const now = new Date();

  for (const race of races) {
    const practiceSessions = race.sessions.filter((s) =>
      s.session_type === "Practice" && !s.is_cancelled
    );

    const raceSessions = race.sessions.filter((s) =>
      s.session_type === "Race" && !s.is_cancelled
    );

    if (!practiceSessions.length || !raceSessions.length) continue;

    const earliestPracticeEnd = new Date(
      Math.min(...practiceSessions.map((s) => new Date(s.date_end).getTime())),
    );

    const raceEnd = new Date(raceSessions[0].date_end);

    const windowOpen = now > earliestPracticeEnd;
    const windowClosed = now > raceEnd;

    if (windowOpen && !windowClosed) {
      return race.meeting_key;
    }
  }
  return null;
}
