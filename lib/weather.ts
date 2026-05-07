import { LucideIcon,Thermometer, Wind, Droplets, Gauge, Compass, CloudRain, Tractor  } from "lucide-react"


export const weatherConfig: { [key: string]: {
    label: string;
    suffix: string;
    icon: LucideIcon
} } = {
    track_temperature: {
        label: "Track Temperature",
        suffix: "°C",
        icon: Tractor // trac ktor !!! Replace later when im not lazy enough to find a track icon
    },
    rainfall: {
        label: "Rainfall",
        suffix: "", // Rainfall is a boolean, so no suffix needed maybe add an moving svg if rainfall?
        icon: CloudRain,
    },
    wind_direction: {
        label: "Wind Direction",
        suffix: "°", // in future add an svg that shows the wind direction based on the value
        icon: Compass,
    },
    wind_speed: {
        label: "Wind Speed",
        suffix: " m/s",
        icon: Wind,
    },
    humidity: {
        label: "Humidity",
        suffix: "%",
        icon: Droplets,
    },
    air_temperature: {
        label: "Air Temperature",
        suffix: "°C",
        icon: Thermometer,
    },
    pressure: {
        label: "Pressure",
        suffix: " mbar",
        icon: Gauge,
    },
}