"use client"

import { useCountdown } from "@/lib/races/useCountdown"
import { RaceSession } from "@/lib/types";
import { useEffect, useState } from "react";

function CountdownBox({ value, label }: { value: number; label: string }) {
    return (
        <div className="w-[30px] h-full  flex flex-col items-center justify-center">
            <span className="text-xl font-bold ">{value}</span>
            <span className="text-xs text-text-muted font-bold">{label}</span>
        </div>
    );
}

export function Countdown({ session }: { session: RaceSession | undefined }) {
    const { days, hours, minutes, seconds } = useCountdown(session?.date_start);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);


    if (!mounted) return (
        <div className="flex gap-2">
            {["D", "H", "M", "S"].map(label => (
                <CountdownBox key={label} value={0} label={label} />
            ))}
        </div>
    );


    return (

        <div className="w-fit flex">
            <div className="flex gap-2 items-center ">
                <CountdownBox value={days} label="D" />
                <CountdownBox value={hours} label="H" />
                <CountdownBox value={minutes} label="M" />
                <CountdownBox value={seconds} label="S" />
            </div>
        </div>
    );
}