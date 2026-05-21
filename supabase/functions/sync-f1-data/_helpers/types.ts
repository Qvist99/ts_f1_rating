export interface DriverFromAPI {
  driver_number: number;
  first_name: string;
  last_name: string;
  team_name: string;
  team_colour: string;
  name_acronym: string;
  headshot_url: string;
}

export interface RaceFromAPI {
  circuit_short_name: string;
  circuit_image: string;
  circuit_info_url: string;
  country_flag: string;
  country_name: string;
  date_start: string;
  date_end: string;
  is_cancelled: boolean;
  meeting_key: number;
  meeting_name: string;
  meeting_official_name: string;
  location: string;
}

export interface SessionFromAPI {
  session_name: string;
  session_type: string;
  date_start: string;
  date_end: string;
  is_cancelled: boolean;
  session_key: number;
}

export interface RaceFromDB {
  id: string;
  meeting_key: number;
  sessions: {
    session_key: number;
    session_name: string;
    session_type: string;
    date_start: string;
    date_end: string;
    is_cancelled: boolean;
  }[];
}
