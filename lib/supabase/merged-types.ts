import { MergeDeep } from 'type-fest'
import { Database as DatabaseGenerated } from './types'
import { RaceSession } from '../types'


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
        driver_comments: {
          Row: {
            positive_comment: string[];
            negative_comment: string[];
          };
        }
      };
    };
  }
>