import { DriverRatingFromApi, DriverWithRatingAndComments } from "@/lib/types";
// Might keep for later or rename in the future for the right panel in the dashboard when we want the driver ratings for all drivers at once
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



export function getDriverRatingStats(driver: DriverWithRatingAndComments){
    const ratings = driver.driver_ratings.map(r => r.rating);

    if(ratings.length === 0) return {
        average: 0,
        bestRound: null
    };

    const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

    const bestRound = driver.driver_ratings.reduce((best, current) => {
        return current.rating > best.rating ? current : best;
    }, driver.driver_ratings[0]);

    return {
        average,
        bestRound
    }
}