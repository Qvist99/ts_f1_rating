import { DriverRatingFromApi } from "@/lib/types";

export function averageDriverRatings(driverRatings: DriverRatingFromApi[]) {
    const grouped = driverRatings.reduce((acc, curr) => {
        if (!acc[curr.driver_id]) {
            acc[curr.driver_id] = { driver_name: `${curr.drivers.first_name} ${curr.drivers.last_name}`, ratings: [] }
        }
        acc[curr.driver_id].ratings.push(curr.rating)
        return acc
    }, {} as Record<string, { driver_name: string, ratings: number[] }>)

    return Object.values(grouped).map(({ driver_name, ratings }) => ({
        driver_name,
        average: ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
    }))
}