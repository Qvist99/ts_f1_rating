import { DriverWithRatingAndComments } from "@/lib/types"
import Image from "next/image"
import { getDriverRatingStats } from "@/lib/driverRatingStats";


export default function DriverCard({ driver }: { driver: DriverWithRatingAndComments }) {
    const averageRating = getDriverRatingStats(driver);

    const currYear = new Date().getFullYear();

    return (
        <div className="py-2 px-4">
            <div className="flex gap-2 items-center">
                <div className="rounded-full overflow-hidden border-2 border-[#aaabac55] " /* style={{ borderColor: `#${driver.team_color}` }} */>
                    <Image src={driver.headshot_url} alt={`${driver.first_name} ${driver.last_name}`} width={75} height={75} />
                </div>
                <div className="flex flex-col">
                    <h2 className="text-lg text-text-primary font-bold font-condensed">{driver.first_name} {driver.last_name}</h2>
                    <p className="text-sm text-text-muted font-bold leading-none">{driver.team_name}</p>
                </div>
            </div>
            <div className="mt-2 flex gap-2">
                <span className="px-2 py-0.5 bg-[#24282F] border border-[#3E4248] text-[#8B949E] rounded font-condensed font-semibold">
                    #{driver.driver_number}
                </span>
                <TeamTag teamName={driver.team_name} teamColor={driver.team_color} />
            </div>

            <Line />

            <div className="mt-2 flex flex-col gap-1">
                <p className="text-text-muted font-semibold text-sm font-condensed">AVG. RATING - {currYear}</p>
                <RatingBar rating={averageRating.average} ratingAmount={driver.driver_ratings.length} />
            </div>

            <Line />

            <div className="mt-2">
                {averageRating.bestRound && (
                    <BestRace
                        raceName={averageRating.bestRound.races.race_name}
                        rating={averageRating.bestRound.rating}
                        round={averageRating.bestRound.races.round}
                        date={averageRating.bestRound.races.date_end}
                    />
                )}
            </div>
        </div>
    )
}


function TeamTag({ teamName, teamColor }: { teamName: string, teamColor: string }) {
    const bgColor = `#${teamColor}`
    const textColor = getContrastingTextColor(bgColor)

    return (
        <span className={`px-2 py-0.5 border border-[#3E4248]  rounded font-condensed font-semibold`} style={{ backgroundColor: bgColor, color: textColor }}>
            {teamName}
        </span>
    )
}

function getContrastingTextColor(hexColor: string): string {
    const color = hexColor.replace('#', '');
    // Convert hex to RGB
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    // Calculate the brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    // Return black for light colors and white for dark colors
    return brightness > 128 ? '#000000' : '#FFFFFF';
}

function Line() {
    return (
        <div className="w-full h-px bg-card-border mt-3 " />
    )
}


function RatingBar({ rating, ratingAmount }: { rating: number, ratingAmount: number }) {
    const percentage = (rating / 10) * 100;

    const ratingFormatted = rating === 10 ? "10" : rating.toFixed(1);

    return (
        <div>
            <div className="flex gap-1 font-condensed items-end">
                <h2 className="text-text-primary text-4xl font-bold">{ratingFormatted}</h2>
                <span className="text-text-muted text-2xl">/</span>
                <p className="text-text-muted font-bold">10</p>
            </div>
            <div className="w-full h-1 bg-[#3E4248] rounded mt-2">
                <div className="h-full rounded bg-[#E3B341]" style={{ width: `${percentage}%` }} />
            </div>
            <span className="text-text-muted text-sm font-semibold font-condensed">Based on {ratingAmount} ratings</span>
        </div>
    )

}


function BestRace({ raceName, rating, round, date }: { raceName: string, rating: number, round: number, date: string }) {
    // month year from date
    const dateObj = new Date(date);
    const month = dateObj.toLocaleString('default', { month: 'long' });
    const year = dateObj.getFullYear();

    const ratingFormatted = rating === 10 ? "10" : rating.toFixed(1);

    return (
        <div className="flex justify-between">
            <div className="flex flex-col">
                <p className="text-sm text-text-muted font-semibold font-condensed ">Best Race</p>
                <p className="font-condensed font-bold text-text-primary text-lg leading-none">{raceName}</p>
                <p className="text-sm text-text-muted leading-none ">Round {round} - {month} {year}</p>
            </div>

            <div className="flex flex-col font-condensed font-bold tabular-nums">
                <span className="text-[#E3B341] text-2xl">{ratingFormatted}</span>
                <span className="text-text-muted text-lg leading-none">/10</span>
            </div>
        </div>
    )



}
