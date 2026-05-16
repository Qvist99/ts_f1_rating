import { UserRaceRatingFromApi } from "@/lib/types";

export function averageRaceRatings(raceRatings: UserRaceRatingFromApi[]) {
    const grouped = raceRatings.reduce((acc, curr) => {
        if (!acc[curr.race_id]) {
            acc[curr.race_id] = { race_name: curr.races.race_name, ratings: [] }
        }
        acc[curr.race_id].ratings.push(curr.rating)
        return acc
    }, {} as Record<string, { race_name: string, ratings: number[] }>)

    return Object.values(grouped).map(({ race_name, ratings }) => ({
        race_name,
        average: ratings.reduce((a, b) => a + b, 0) / ratings.length
    }))
}
