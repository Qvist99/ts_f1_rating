export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      constructor_standings: {
        Row: {
          id: string
          standings: Json
          updated_at: string
          year: number
        }
        Insert: {
          id?: string
          standings: Json
          updated_at?: string
          year: number
        }
        Update: {
          id?: string
          standings?: Json
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      driver_comments: {
        Row: {
          driver_id: string
          id: string
          text: string
          type: Database["public"]["Enums"]["comment_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          driver_id: string
          id?: string
          text: string
          type: Database["public"]["Enums"]["comment_type"]
          updated_at?: string
          user_id?: string
        }
        Update: {
          driver_id?: string
          id?: string
          text?: string
          type?: Database["public"]["Enums"]["comment_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_comments_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_stats"
            referencedColumns: ["driver_id"]
          },
          {
            foreignKeyName: "driver_comments_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_ratings: {
        Row: {
          driver_id: string
          id: string
          meeting_key: number
          race_id: string
          rating: number
          user_id: string
        }
        Insert: {
          driver_id: string
          id?: string
          meeting_key: number
          race_id: string
          rating: number
          user_id?: string
        }
        Update: {
          driver_id?: string
          id?: string
          meeting_key?: number
          race_id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_ratings_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_stats"
            referencedColumns: ["driver_id"]
          },
          {
            foreignKeyName: "driver_ratings_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_ratings_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_standings: {
        Row: {
          id: string
          standings: Json
          updated_at: string
          year: number
        }
        Insert: {
          id?: string
          standings: Json
          updated_at?: string
          year: number
        }
        Update: {
          id?: string
          standings?: Json
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      drivers: {
        Row: {
          acronym: string
          driver_number: number
          first_name: string
          headshot_url: string
          id: string
          last_name: string
          team_color: string
          team_name: string
          year: number
        }
        Insert: {
          acronym: string
          driver_number: number
          first_name: string
          headshot_url: string
          id?: string
          last_name: string
          team_color: string
          team_name: string
          year: number
        }
        Update: {
          acronym?: string
          driver_number?: number
          first_name?: string
          headshot_url?: string
          id?: string
          last_name?: string
          team_color?: string
          team_name?: string
          year?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          deletion_requested_at: string | null
          display_name: string | null
          email: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          deletion_requested_at?: string | null
          display_name?: string | null
          email?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          deletion_requested_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      race_drivers: {
        Row: {
          driver_id: string
          race_id: string
        }
        Insert: {
          driver_id: string
          race_id: string
        }
        Update: {
          driver_id?: string
          race_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "race_drivers_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_stats"
            referencedColumns: ["driver_id"]
          },
          {
            foreignKeyName: "race_drivers_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "race_drivers_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          },
        ]
      }
      race_ratings: {
        Row: {
          id: string
          meeting_key: number
          race_id: string
          rating: number
          user_id: string
        }
        Insert: {
          id?: string
          meeting_key: number
          race_id: string
          rating: number
          user_id?: string
        }
        Update: {
          id?: string
          meeting_key?: number
          race_id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "race_ratings_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          },
        ]
      }
      races: {
        Row: {
          circuit_image_url: string
          circuit_name: string
          country_flag_url: string
          country_name: string
          date_end: string
          date_start: string
          id: string
          is_cancelled: boolean
          meeting_key: number
          race_location: string
          race_name: string
          race_official_name: string
          round: number
          sessions: Json
        }
        Insert: {
          circuit_image_url: string
          circuit_name: string
          country_flag_url: string
          country_name: string
          date_end: string
          date_start: string
          id?: string
          is_cancelled?: boolean
          meeting_key: number
          race_location: string
          race_name: string
          race_official_name: string
          round: number
          sessions: Json
        }
        Update: {
          circuit_image_url?: string
          circuit_name?: string
          country_flag_url?: string
          country_name?: string
          date_end?: string
          date_start?: string
          id?: string
          is_cancelled?: boolean
          meeting_key?: number
          race_location?: string
          race_name?: string
          race_official_name?: string
          round?: number
          sessions?: Json
        }
        Relationships: []
      }
    }
    Views: {
      driver_stats: {
        Row: {
          avg_rating_best_round: number | null
          avg_rating_last_3: number | null
          avg_rating_last_5: number | null
          avg_rating_season: number | null
          best_round_race_id: string | null
          driver_id: string | null
          my_comments: number | null
          negative_comments: number | null
          positive_comments: number | null
          total_comments: number | null
          total_ratings: number | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_ratings_race_id_fkey"
            columns: ["best_round_race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          },
        ]
      }
      race_rating_stats: {
        Row: {
          avg_rating: number | null
          country_name: string | null
          date_end: string | null
          date_start: string | null
          is_cancelled: boolean | null
          race_id: string | null
          race_location: string | null
          race_name: string | null
          round: number | null
          total_ratings: number | null
        }
        Relationships: [
          {
            foreignKeyName: "race_ratings_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      comment_type: "positive" | "negative"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      comment_type: ["positive", "negative"],
    },
  },
} as const

