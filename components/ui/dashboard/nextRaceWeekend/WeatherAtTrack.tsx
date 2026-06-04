import { WeatherDataFromApi } from "@/lib/types"
import { RaceSession } from "@/lib/types"
import { getNextSession } from "@/lib/races/getNextSession"
import { CloudOff } from "lucide-react"



export default async function WeatherAtTrack({ sessions, meetingKey }: { sessions: RaceSession[], meetingKey: number }) {
    const nextSession = getNextSession(sessions)

    let sessionKey: string | number = "latest"
    const sharedCss = "flex flex-col w-full pl-3.5 pr-0"
    if (nextSession) {
        sessionKey = nextSession.session_key
    }

    // Since we cant reach the endpoint during sessions for free lets return weather not available for now and implement our own weather solution in the future.
    return <WeatherNotAvailable />


    const apiUrl = `https://api.openf1.org/v1/weather?meeting_key=${meetingKey}&session_key=${sessionKey}`

    const res = await fetch(apiUrl, {
        next: {
            revalidate: 60, // Revalidate every 60 seconds
        },
    })

    if (!res.ok) {
        if (res.status !== 404) {

            return <WeatherNotAvailable />
        }

        return <WeatherNotAvailable />

    }

    const weatherDataArray: WeatherDataFromApi[] = await res.json()
    const weatherData = weatherDataArray[weatherDataArray.length - 1] // Get the latest weather data


    const reformatedWeatherData = [
        { label: "TRACK", value: `${weatherData.track_temperature}`, suffix: "°" },
        { label: "AIR", value: `${weatherData.air_temperature}`, suffix: "°" },
        { label: "HUMIDITY", value: `${weatherData.humidity}`, suffix: "%" },
        { label: `${getWindDirection(weatherData.wind_direction)} M/S`, value: `${weatherData.wind_speed}`, suffix: "" },
    ]



    return (
        <div className={`${sharedCss} gap-[2px]`}>
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
                    <p className="text-[#3267A5] font-condensed font-bold">{weatherData.rainfall === 0 ? "Dry" : "Wet"} - {weatherData.pressure} mbar</p>
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