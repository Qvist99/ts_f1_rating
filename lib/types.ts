import { Database } from "./supabase/merged-types";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
// Should really overlook the types after v1 is done and use generated types from supabase for better type safety and less maintenance. But for now this is good enough and faster to iterate with.
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
        sessions: RaceSession[];
        round: number;
}

export type RaceSession = {
    date_end: string;
    date_start: string;
    is_cancelled: boolean;
    session_name: "Practice 1" | "Practice 2" | "Practice 3" | "Qualifying" | "Sprint" | "Race"
    session_type: "Practice" | "Qualifying" | "Race"
    session_key: string;
}

export type Drivers = {
    id: string;
    first_name: string;
    last_name: string;
    team_name: string;
    team_color: string;
    acronym:string;
    driver_number: number;
    headshot_url: string;
    is_retired: boolean;
}

export type RaceRatings = {
    id: string;
    race_id: string;
    user_id: string;
    rating: number;
    meeting_key: number;
}

export type DriverRatings = {
    id: string;
    driver_id: string;
    race_id: string;
    user_id: string;
    rating: number;
    meeting_key: number;
}

export type DriverComments = {
    id: string;
    driver_id: string;
    user_id: string;
    positive_comment: string[];
    negative_comment: string[];
}


export type WeatherDataFromApi = { 
    date: string;
    session_key: number;
    track_temperature: number; // Track temperature (°C).
    rainfall: 0 | 1; // Whether there is rainfall.
    wind_direction: number; // Wind direction (°), from 0° to 359°.
    wind_speed: number; // Wind speed (m/s).
    humidity: number; // Relative humidity in percentage
    air_temperature: number; // Air temperature (°C)
    meeting_key: number;
    pressure: number; // Air pressure (mbar).   
}

export type DriverStandingFromApi = {
    meeting_key: number;
    session_key: number;
    driver_number: number;
    position_start: number;
    position_current: number;
    points_start: number;
    points_current: number;
}

export type ConstructorStandingFromApi = {
    meeting_key: number;
    session_key: number;
    team_name: string;
    position_start: number;
    position_current: number;
    points_start: number;
    points_current: number;
}


export type UserRaceRatingFromApi = {
    id: string;
    race_id: string;
    rating: number;
    user_id: string;
    races: Pick<Races, "race_name">
} // Remove before we commit

export type AverageRaceRating = {
    race_name: string;
    average: number;
}

export type DriverRatingFromApi = {
    driver_id: string;
    id: string;
    race_id: string;
    rating: number;
    user_id: string;
    drivers: {
        first_name: string;
        last_name: string;
    };
} // Remove before we commit

export type AverageDriverRating = {
    driver_name: string;
    average: number;
}


export type DriverWithRatingAndComments = Drivers & {
  driver_comments: DriverComments[];
  driver_ratings: (DriverRatings & {
    races: Pick<Races, "race_name" | "round" | "date_end">
  })[];
}

export type DriverWithRatings = Database["public"]["Tables"]["drivers"]["Row"] & {
    driver_ratings: Database["public"]["Tables"]["driver_ratings"]["Row"][];
} 

export type RaceWithRatings = Database["public"]["Tables"]["races"]["Row"] & {
    race_ratings: Database["public"]["Tables"]["race_ratings"]["Row"][];
}

export type DriversWithRatingsPromise = PromiseLike<PostgrestSingleResponse<DriverWithRatings[]>>

export type DriverWithRatingsPromise = PromiseLike<PostgrestSingleResponse<DriverWithRatings>>

export type RacesWithRatingsPromise = PromiseLike<PostgrestSingleResponse<RaceWithRatings[]>>

export type RaceWithRatingsPromise = PromiseLike<PostgrestSingleResponse<RaceWithRatings>>

export interface Comment {
    id: string
    user_id: string
    text: string
    type: "positive" | "negative"
    updated_at: string
}

export type DriverStats = Database["public"]["Views"]["driver_stats"]["Row"]

export type DriverWithStats = Database["public"]["Tables"]["drivers"]["Row"] & {
    driver_stats: DriverStats[];
}