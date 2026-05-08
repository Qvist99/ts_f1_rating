import { createClient } from "@/lib/supabase/server"
import Slider from "../Slider";
import { averageRaceRatings } from "@/lib/races/averageRaceRatings";
import { AverageRaceRating } from "@/lib/types";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "../dialog";

export default async function RaceRatingOverview() {
    const supabase = await createClient();

    const { data, error } = await supabase.from("race_ratings")
        .select("*, races(race_name)")


    if (error) {
        console.error("Error fetching race ratings:", error);
        // Maybe return an error component here instead of null in the future
        return null;
    }

    const averageRatings = averageRaceRatings(data);

    const sortedRatings = averageRatings.sort((a, b) => b.average - a.average);

    const totalRacesRated = averageRatings.length;

    const sliceCount = totalRacesRated < 10 ? Math.ceil(totalRacesRated / 2) : 5;

    const top5 = sortedRatings.slice(0, sliceCount);
    const worst5 = sortedRatings.slice(-sliceCount);

    return (
        <div className="h-full">
            <Slider action={{ node: <AllRacesDialog averageRatings={averageRatings} /> }} pages={
                [
                    <SliderPage key={"five-best-races"} averageRatings={top5}
                        headerText="Best Races"
                        totalRaces={totalRacesRated}
                        type="best"
                    />,
                    <SliderPage
                        key={"five-worst-races"}
                        averageRatings={worst5}
                        headerText="Worst Races"
                        totalRaces={totalRacesRated}
                        type="worst" />
                ]} />
        </div>
    )
}


function SliderPage({ averageRatings, headerText, totalRaces, type }: { averageRatings: AverageRaceRating[], headerText: string, totalRaces: number, type: "best" | "worst" }) {
    const currYear = new Date().getFullYear();

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col">
                <h2 className="text-lg text-text-primary font-bold ">{headerText}</h2>
                <span className="text-sm text-text-muted font-bold">{currYear} Season</span>
            </div>

            <div className="flex flex-col">
                {averageRatings.map((rating, i) => (
                    <div key={i} className="flex justify-between text-sm border-b border-text-muted py-[1px]">
                        <div className="flex gap-1">
                            <span>
                                {type === "worst" ? totalRaces - i : i + 1}.

                            </span>
                            <span>{rating.race_name}</span>
                        </div>
                        <div>
                            <span>{rating.average}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function AllRacesDialog({ averageRatings }: { averageRatings: AverageRaceRating[] }) {
    return (
        <Dialog>
            <DialogTrigger className="text-sm text-gray-400 hover:text-text-primary transition-colors cursor-pointer">View all</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Users race ratings</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                    {averageRatings.map((rating, i) => (
                        <div key={i} className="flex justify-between text-sm border-b border-text-muted py-[1px]">
                            <div className="flex gap-1">
                                <span>
                                    {i + 1}.
                                </span>
                                <span className="font-bold">{rating.race_name}</span>
                            </div>
                            <div>
                                <span>{rating.average}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}


