export type RaceSession = {
    date_end: string;
    date_start: string;
    is_cancelled: boolean;
    session_name: "Practice 1" | "Practice 2" | "Practice 3" | "Qualifying" | "Sprint" | "Race"
    session_type: "Practice" | "Qualifying" | "Race"
}