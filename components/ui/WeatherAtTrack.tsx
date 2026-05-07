import { WeatherDataFromApi } from "@/lib/types"
import { RaceSession } from "@/lib/types"
import { getNextSession } from "@/lib/races/getNextSession"
import { weatherConfig } from "@/lib/weather"
import { CloudOff } from "lucide-react"



export default async function WeatherAtTrack({ sessions, meetingKey }: { sessions: RaceSession[], meetingKey: number }) {
    const nextSession = getNextSession(sessions)

    let sessionKey: string | number = "latest"
    const sharedCss = "flex flex-col border border-border p-4 w-[350px]"
    if (nextSession) {
        sessionKey = nextSession.session_key
    }


    const apiUrl = `https://api.openf1.org/v1/weather?meeting_key=${meetingKey}&session_key=${sessionKey}`

    const res = await fetch(apiUrl, {
        next: {
            revalidate: 60, // Revalidate every 60 seconds
        },
    })

    if (!res.ok) {
        if (res.status !== 404) {
            console.error("Failed to fetch weather data:", res.statusText)
        }

        return (
            <div className={`${sharedCss} justify-center items-center text-center`}>
                <CloudOff size={32} className="mx-auto mb-2" />
                <p className="text-sm text-text-muted">Weather data will be available closer to the session start time.</p>
            </div>
        )
    }

    const weatherDataArray: WeatherDataFromApi[] = await res.json()
    const weatherData = weatherDataArray[weatherDataArray.length - 1] // Get the latest weather data

    // remove date, session_key and meeting_key from the weather data as this does not need too be displayed
    const { date, session_key, meeting_key, ...displayWeatherData } = weatherData


    return (
        <div className={`${sharedCss} flex flex-col gap-[2px]`}>
            {Object.entries(displayWeatherData).map(([key, value], index) => {
                const { label, suffix, icon: Icon } = weatherConfig[key]

                return (
                    <div key={key} className={`flex justify-between px-2 ${index % 2 === 0 ? "bg-[#2d3748]" : ""} `}>
                        <span className="flex items-center gap-2">
                            <Icon size={16} />
                            {label}
                        </span>
                        <span>{value}{suffix}</span>
                    </div>
                )
            })}
        </div>
    )
}
