export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      permissions: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      songs: {
        Row: {
          artists: string[]
          camera_supported: boolean
          created_at: string | null
          difficulty: Database["public"]["Enums"]["difficulty"]
          duration: number | null
          effort: Database["public"]["Enums"]["effort"]
          exclusivity: string | null
          game: string
          id: string
          image_path: string | null
          jdplus_required: boolean
          mode: Database["public"]["Enums"]["mode"]
          release_year: number
          tags: string[] | null
          title: string
          version: string | null
        }
        Insert: {
          artists: string[]
          camera_supported?: boolean
          created_at?: string | null
          difficulty: Database["public"]["Enums"]["difficulty"]
          duration?: number | null
          effort: Database["public"]["Enums"]["effort"]
          exclusivity?: string | null
          game: string
          id?: string
          image_path?: string | null
          jdplus_required?: boolean
          mode: Database["public"]["Enums"]["mode"]
          release_year: number
          tags?: string[] | null
          title: string
          version?: string | null
        }
        Update: {
          artists?: string[]
          camera_supported?: boolean
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty"]
          duration?: number | null
          effort?: Database["public"]["Enums"]["effort"]
          exclusivity?: string | null
          game?: string
          id?: string
          image_path?: string | null
          jdplus_required?: boolean
          mode?: Database["public"]["Enums"]["mode"]
          release_year?: number
          tags?: string[] | null
          title?: string
          version?: string | null
        }
        Relationships: []
      }
      tournaments: {
        Row: {
          cameraAllowed: boolean | null
          commentsAllowed: boolean
          created_at: string
          creatorId: string | null
          description: string | null
          duration: number | null
          endDate: string | null
          fillGapMode: boolean | null
          id: string
          isHidden: boolean | null
          isPrivate: boolean | null
          isPublished: boolean | null
          liveChat: boolean | null
          livestreamLink: string | null
          maxSongs: number | null
          organisers: string[] | null
          participants: string[] | null
          platforms: string[] | null
          randomType: Database["public"]["Enums"]["random_type"] | null
          recurrence: boolean
          recurrences: string[] | null
          songs: string[] | null
          songSelection: Database["public"]["Enums"]["song_selection"]
          songsSuggestionsAllowed: boolean | null
          startDate: string
          timeLimitedBy: Database["public"]["Enums"]["timelimit"] | null
          title: string
          verificationMethod:
            | Database["public"]["Enums"]["verification_method"]
            | null
        }
        Insert: {
          cameraAllowed?: boolean | null
          commentsAllowed: boolean
          created_at?: string
          creatorId?: string | null
          description?: string | null
          duration?: number | null
          endDate?: string | null
          fillGapMode?: boolean | null
          id?: string
          isHidden?: boolean | null
          isPrivate?: boolean | null
          isPublished?: boolean | null
          liveChat?: boolean | null
          livestreamLink?: string | null
          maxSongs?: number | null
          organisers?: string[] | null
          participants?: string[] | null
          platforms?: string[] | null
          randomType?: Database["public"]["Enums"]["random_type"] | null
          recurrence?: boolean
          recurrences?: string[] | null
          songs?: string[] | null
          songSelection: Database["public"]["Enums"]["song_selection"]
          songsSuggestionsAllowed?: boolean | null
          startDate: string
          timeLimitedBy?: Database["public"]["Enums"]["timelimit"] | null
          title?: string
          verificationMethod?:
            | Database["public"]["Enums"]["verification_method"]
            | null
        }
        Update: {
          cameraAllowed?: boolean | null
          commentsAllowed?: boolean
          created_at?: string
          creatorId?: string | null
          description?: string | null
          duration?: number | null
          endDate?: string | null
          fillGapMode?: boolean | null
          id?: string
          isHidden?: boolean | null
          isPrivate?: boolean | null
          isPublished?: boolean | null
          liveChat?: boolean | null
          livestreamLink?: string | null
          maxSongs?: number | null
          organisers?: string[] | null
          participants?: string[] | null
          platforms?: string[] | null
          randomType?: Database["public"]["Enums"]["random_type"] | null
          recurrence?: boolean
          recurrences?: string[] | null
          songs?: string[] | null
          songSelection?: Database["public"]["Enums"]["song_selection"]
          songsSuggestionsAllowed?: boolean | null
          startDate?: string
          timeLimitedBy?: Database["public"]["Enums"]["timelimit"] | null
          title?: string
          verificationMethod?:
            | Database["public"]["Enums"]["verification_method"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_creatorId_fkey"
            columns: ["creatorId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          permission_id: string
          user_id: string
        }
        Insert: {
          permission_id?: string
          user_id?: string
        }
        Update: {
          permission_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          discord_id: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          username: string
        }
        Insert: {
          discord_id?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          username: string
        }
        Update: {
          discord_id?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          username?: string
        }
        Relationships: []
      }
      verification_codes: {
        Row: {
          code: string | null
          user_id: string
        }
        Insert: {
          code?: string | null
          user_id?: string
        }
        Update: {
          code?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_codes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      difficulty: "Easy" | "Medium" | "Hard" | "Extreme"
      effort: "Chill" | "Moderate" | "Intense"
      mode: "Solo" | "Duet" | "Trio" | "Quartet"
      random_type: "now" | "beforeStart" | "during"
      recurrence_units: "days" | "weeks" | "months"
      song_selection: "random" | "manual"
      timelimit: "endDate" | "duration" | "songs"
      verification_method: "ocr" | "manual" | "both"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
