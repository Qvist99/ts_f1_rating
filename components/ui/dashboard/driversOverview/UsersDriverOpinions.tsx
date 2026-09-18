import Slider from "@/components/ui/Slider";
import DriverCard from "./DriverCard";
import FanCommentsCard from "./FanCommentsCard";
import type { DriverWithCommentsAndStats } from "@/lib/types";

interface UsersDriverOpinionsProps {
    driversWithStatsAndRace: (DriverWithCommentsAndStats & {
        best_race: {
            race_name: string;
            round: number;
            date_end: string;
        } | null;
    })[];
}

export default async function UsersDriverOpinions({ driversWithStatsAndRace }: UsersDriverOpinionsProps) {
    return (
        <Slider
            pages={driversWithStatsAndRace.map(driver => (
                <div className="h-full flex gap-2">
                    <div className="bg-card-bg border-2 border-card-border h-full w-[50%] rounded ">
                        <DriverCard driver={driver} />
                    </div>
                    <div className="bg-card-bg border-2 border-card-border h-full w-[50%] rounded ">
                        <FanCommentsCard driver={driver} />
                    </div>
                </div>
            ))}
        />

    )
}