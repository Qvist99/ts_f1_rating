export type Races = {
        circuit_image_url: string;
        circuit_name: string;
        country_flag_url: string;
        country_name: string;
        date_end: string;
        date_start: string;
        id: string;
        is_cancelled: boolean;
        meeting_key: number;
        race_location: string;
        race_name: string;
        race_official_name: string;
        sessions: RaceSession[]
}

export type RaceSession = {
    date_end: string;
    date_start: string;
    is_cancelled: boolean;
    session_name: "Practice 1" | "Practice 2" | "Practice 3" | "Qualifying" | "Sprint" | "Race"
    session_type: "Practice" | "Qualifying" | "Race"
    session_key: string;
}


export type WeatherDataFromApi = { 
    date: string;
    session_key: string;
    track_temperature: number; // Track temperature (°C).
    rainfall: 0 | 1; // Whether there is rainfall.
    wind_direction: number; // Wind direction (°), from 0° to 359°.
    wind_speed: number; // Wind speed (m/s).
    humidity: number; // Relative humidity in percentage
    air_temperature: number; // Air temperature (°C)
    meeting_key: number;
    pressure: number; // Air pressure (mbar).   
}


export type UserRaceRatingFromApi = {
    id: string;
    race_id: string;
    rating: number;
    user_id: string;
    races: Pick<Races, "race_name">
}

export type AverageRaceRating = {
    race_name: string;
    average: number;
}