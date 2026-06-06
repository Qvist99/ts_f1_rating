"use client"

import { WeatherDataFromApi } from "@/lib/types"
import { RaceSession } from "@/lib/types"
import { getSessionWithBuffer } from "@/lib/races/getNextSession"
import { CloudOff } from "lucide-react"
import { useEffect, useState } from "react"

interface WeatherAtTrackProps {
    sessions: RaceSession[]
}


export default function WeatherAtTrack({ sessions }: WeatherAtTrackProps) {
    const [weatherData, setWeatherData] = useState<WeatherDataFromApi | null>(null);
    const [loading, setLoading] = useState(true);

    const sharedCss = "flex flex-col w-full pl-3.5 pr-0"
    useEffect(() => {
        const fetchWeather = async () => {
            const session = getSessionWithBuffer(sessions, 10)
            if (!session) {
                setLoading(false)
                return
            }
            const res = await fetch("/api/weather")
            if (!res.ok) {
                setLoading(false)
                return
            }
            const data = await res.json() as WeatherDataFromApi
            setWeatherData(data)
            setLoading(false)
        }

        fetchWeather()
        const id = setInterval(fetchWeather, 60_000)
        return () => clearInterval(id)
    }, [])

    if (loading) {
        return <LoadingState />
    }

    if (!weatherData) {
        return <WeatherNotAvailable />
    }

    const reformatedWeatherData = [
        { label: "TRACK", value: `${weatherData.trackTemp}`, suffix: "°" },
        { label: "AIR", value: `${weatherData.airTemp}`, suffix: "°" },
        { label: "HUMIDITY", value: `${weatherData.humidity}`, suffix: "%" },
        { label: `${getWindDirection(weatherData.windDirection)} M/S`, value: `${weatherData.windSpeed}`, suffix: "" },
    ]



    return (
        <div className={`${sharedCss} gap-0.5`}>
            <h2 className="text-text-muted font-bold">Conditions</h2>
            <div className="flex flex-col gap-2 h-full">
                <div className="grid grid-cols-2 gap-1 h-full">
                    {reformatedWeatherData.map(({ label, value, suffix }, index) => (
                        <WeatherCard key={index} label={label} suffix={suffix} value={value} />
                    )
                    )}
                </div>
                <div className="flex gap-2 items-center bg-[#111B27] border border-[#1B324E] p-2 rounded">
                    <div className="h-2 w-2 bg-[#4A9EFF] rounded"></div>
                    <p className="text-[#3267A5] font-condensed font-bold">{weatherData.rainfall ? "Wet" : "Dry"} - {weatherData.pressure} mbar</p>
                </div>
            </div>
        </div>
    )
}

function WeatherCard({ label, suffix, value }: { label: string; suffix: string; value: string | number }) {
    return (
        <div className="flex flex-col justify-center items-center bg-card-bg border border-card-border rounded w-full font-condensed">
            <p className="text-lg font-bold text-text-primary">{value}{suffix}</p>
            <p className="text-sm font-bold text-text-muted">{label}</p>
        </div>
    )

}

function getWindDirection(degree: number) {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(degree / 45) % 8;
    return directions[index];
}


function WeatherNotAvailable() {
    return (
        <div className="flex flex-col w-full pl-3.5 pr-0 justify-center items-center text-center">
            <CloudOff size={32} className=" mb-2" />
            <p className="text-sm text-text-muted">Weather data will be available closer to the session start time.</p>
        </div>
    )
}

function LoadingState() {
    return (
        <div className="flex flex-col w-full pl-3.5 pr-0 justify-center items-center text-center">
            <Spinner />
        </div>
    )
}

function Spinner() {
    return (
        <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    )
}