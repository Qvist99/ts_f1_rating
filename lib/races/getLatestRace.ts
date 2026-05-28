import { Races } from "@/lib/types";

export function getLatestRace(races: Races[] | null) {
    if (!races) return undefined;

    const sorted = [...races].sort(
        (a, b) =>
            new Date(b.date_start).getTime() - new Date(a.date_start).getTime(),
    );

    return sorted.find((race) => new Date(race.date_start) < new Date());
}
