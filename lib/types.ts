import { Database } from "./supabase/merged-types";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

// Base data from tables
export type Races = Database["public"]["Tables"]["races"]["Row"];

export type Drivers = Database["public"]["Tables"]["drivers"]["Row"];

export type RaceRatings = Database["public"]["Tables"]["race_ratings"]["Row"];

export type DriverRatings =
    Database["public"]["Tables"]["driver_ratings"]["Row"];

export type DriverComments =
    Database["public"]["Tables"]["driver_comments"]["Row"];

export type DriverStats = Database["public"]["Views"]["driver_stats"]["Row"];

export type RaceRatingStats =
    Database["public"]["Views"]["race_rating_stats"]["Row"];

export type DriverStanding =
    Database["public"]["Tables"]["driver_standings"]["Row"];

export type ConstructorStanding =
    Database["public"]["Tables"]["constructor_standings"]["Row"];

export type RaceSession = {
    date_end: string;
    date_start: string;
    is_cancelled: boolean;
    session_name:
        | "Practice 1"
        | "Practice 2"
        | "Practice 3"
        | "Qualifying"
        | "Sprint"
        | "Race";
    session_type: "Practice" | "Qualifying" | "Race";
    session_key: string;
};

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
};

export type DriverStandingFromApi = {
    meeting_key: number;
    session_key: number;
    driver_number: number;
    position_start: number;
    position_current: number;
    points_start: number;
    points_current: number;
};

export type ConstructorStandingFromApi = {
    meeting_key: number;
    session_key: number;
    team_name: string;
    position_start: number;
    position_current: number;
    points_start: number;
    points_current: number;
};

export type DriverWithCommentsAndStats = Drivers & {
    driver_comments: DriverComments[];
    driver_stats: DriverStats;
};

export type DriverWithRatings = Drivers & {
    driver_ratings: DriverRatings[];
};

export type RaceWithRatings = Races & {
    race_ratings: RaceRatings[];
};

export type DriversWithRatingsPromise = PromiseLike<
    PostgrestSingleResponse<DriverWithRatings[]>
>;

export type DriverWithRatingsPromise = PromiseLike<
    PostgrestSingleResponse<DriverWithRatings>
>;

export type RacesWithRatingsPromise = PromiseLike<
    PostgrestSingleResponse<RaceWithRatings[]>
>;

export type RaceWithRatingsPromise = PromiseLike<
    PostgrestSingleResponse<RaceWithRatings>
>;

export type DriverStandingsPromise = PromiseLike<
    PostgrestSingleResponse<
        {
            standings: DriverStandingFromApi[];
        } | null
    >
>;

export type ConstructorStandingsPromise = PromiseLike<
    PostgrestSingleResponse<
        {
            standings: ConstructorStandingFromApi[];
        } | null
    >
>;

export interface Comment {
    id: string;
    user_id: string;
    text: string;
    type: "positive" | "negative";
    updated_at: string;
}

export type DriverWithStats = Drivers & {
    driver_stats: DriverStats[];
};

export type DriversWithStatsPromise = PromiseLike<
    PostgrestSingleResponse<DriverWithStats[]>
>;
export type RaceRatingStatsPromise = PromiseLike<
    PostgrestSingleResponse<RaceRatingStats[]>
>;
