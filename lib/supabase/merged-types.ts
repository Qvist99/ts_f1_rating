import { MergeDeep } from "type-fest";
import { Database as DatabaseGenerated } from "./types";
import {
  ConstructorStandingFromApi,
  DriverStandingFromApi,
  RaceSession,
} from "../types";

// Override the type for a specific column in a view:
export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Tables: {
        races: {
          Row: {
            sessions: RaceSession[];
          };
        };
        driver_standings: {
          Row: {
            standings: DriverStandingFromApi[];
          };
        };
        constructor_standings: {
          Row: {
            standings: ConstructorStandingFromApi[];
          };
        };
      };
    };
  }
>;
