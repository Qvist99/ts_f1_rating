import { createClient } from "@/lib/supabase/server"
import Slider from "../Slider";
import { averageDriverRatings } from "@/lib/races/averageDriverRatings";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../dialog";

export default async function DriverRankingOverview() {

    const supabase = await createClient();

    // Current date in timestamptz
    const currentDate = new Date().toISOString();

    // Fetch recent 3 races id's base on the current date

    const { data: recentRaces, error: recentRacesError } = await supabase.from("races").select("id").eq("is_cancelled", false).lte("date_end", currentDate).order("date_end", { ascending: false }).limit(3);

    if (recentRacesError) {
        console.error("Error fetching recent races:", recentRacesError);
        return null; // Might want to return fallback ui here instead
    }

    const recentRaceIds = recentRaces.map(r => r.id);


    const { data: driverRatings, error: driverRatingsError } = await supabase.from("driver_ratings")
        .select("*, drivers(first_name, last_name)")
        .in("race_id", recentRaceIds);

    if (driverRatingsError) {
        console.error("Error fetching driver ratings:", driverRatingsError);
        return null; // Might want to return fallback ui here instead
    }

    const averageRatings = averageDriverRatings(driverRatings);

    const sortedRatings = averageRatings.sort((a, b) => b.average - a.average);

    const totalDriversRated = averageRatings.length;

    const sliceCount = Math.floor(totalDriversRated / 2);

    const top5 = sortedRatings.slice(0, Math.ceil(totalDriversRated / 2));
    const worst5 = sortedRatings.slice(-sliceCount).reverse();

    return (
        <div className="h-full">
            <Slider action={{ node: <AllDriversDialog averageRatings={averageRatings} /> }} pages={
                [
                    <SliderPage key={"five-best-drivers"} averageRatings={top5}
                        headerText="Top Drivers"
                        totalDrivers={totalDriversRated}
                        type="best"
                    />,
                    <SliderPage
                        key={"five-worst-drivers"}
                        averageRatings={worst5}
                        headerText="Worst Drivers"
                        totalDrivers={totalDriversRated}
                        type="worst" />
                ]} />
        </div>
    )
}



function SliderPage({ averageRatings, headerText, totalDrivers, type }: { averageRatings: { driver_name: string, average: number }[], headerText: string, totalDrivers: number, type: "best" | "worst" }) {
    const currYear = new Date().getFullYear();

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col">
                <h2 className="text-lg text-text-primary font-bold ">{headerText}</h2>
                <span className="text-sm text-text-muted font-bold">Last 3 races</span>
            </div>

            <div className="flex flex-col">
                {averageRatings.map((rating, i) => (
                    <div key={i} className="flex justify-between text-sm border-b border-text-muted py-[1px]">
                        <div className="flex gap-1">
                            <span>
                                {type === "worst" ? totalDrivers - i : i + 1}.

                            </span>
                            <span>{rating.driver_name}</span>
                        </div>
                        <div>
                            <span>{rating.average.toFixed(1)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}


function AllDriversDialog({ averageRatings }: { averageRatings: { driver_name: string, average: number }[] }) {
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
                                <span className="font-bold">{rating.driver_name}</span>
                            </div>
                            <div>
                                <span>{rating.average.toFixed(1)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}