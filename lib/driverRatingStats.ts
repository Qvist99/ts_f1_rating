import { DriverWithRatingAndComments } from "@/lib/types";
import { getAverageRating } from "./averageRatings";

export function getDriverRatingStats(driver: DriverWithRatingAndComments){
    const ratings = driver.driver_ratings.map(r => r.rating);

    if(ratings.length === 0) return {
        average: 0,
        bestRound: null
    };

    const average = getAverageRating(ratings);

    const bestRound = driver.driver_ratings.reduce((best, current) => {
        return current.rating > best.rating ? current : best;
    }, driver.driver_ratings[0]);

    return {
        average,
        bestRound
    }
}