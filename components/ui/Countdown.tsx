"use client"

import { useCountdown } from "@/lib/races/useCountdown"
import { RaceSession } from "@/lib/types";

function CountdownBox({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center -skew-x-6">
            <div className="bg-gray-700 min-w-[76px] h-full p-2 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold skew-x-6">{value}</span>
                <span className="text-xs text-text-muted mt-1 skew-x-6">{label}</span>
            </div>
        </div>
    );
}

export function Countdown({ session }: { session: RaceSession | undefined }) {
    const { days, hours, minutes, seconds } = useCountdown(session?.date_start);

    return (

        <div className="w-fit">
            <div>
                <div className="flex gap-2 ">
                    <CountdownBox value={days} label="Days" />
                    <CountdownBox value={hours} label="Hours" />
                    <CountdownBox value={minutes} label="Minutes" />
                    <CountdownBox value={seconds} label="Seconds" />
                </div>
            </div>
        </div>
    );
}