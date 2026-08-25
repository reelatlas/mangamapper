export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      anime_progress: {
        Row: {
          anime_id: string
          id: string
          in_library: boolean
          last_read_chapter: string | null
          last_read_volume: number | null
          last_watched_episode: number | null
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          anime_id: string
          id?: string
          in_library?: boolean
          last_read_chapter?: string | null
          last_read_volume?: number | null
          last_watched_episode?: number | null
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          anime_id?: string
          id?: string
          in_library?: boolean
          last_read_chapter?: string | null
          last_read_volume?: number | null
          last_watched_episode?: number | null
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chapter_anchors: {
        Row: {
          chapter: number
          chapters_adapted: string | null
          continue_chapter: number | null
          continue_kind: string | null
          continue_note: string | null
          created_at: string
          episode: number
          note: string | null
          series_id: string
          source: string
          start_chapter: number | null
          volume: number | null
        }
        Insert: {
          chapter: number
          chapters_adapted?: string | null
          continue_chapter?: number | null
          continue_kind?: string | null
          continue_note?: string | null
          created_at?: string
          episode: number
          note?: string | null
          series_id: string
          source: string
          start_chapter?: number | null
          volume?: number | null
        }
        Update: {
          chapter?: number
          chapters_adapted?: string | null
          continue_chapter?: number | null
          continue_kind?: string | null
          continue_note?: string | null
          created_at?: string
          episode?: number
          note?: string | null
          series_id?: string
          source?: string
          start_chapter?: number | null
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chapter_anchors_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      episode_annotations: {
        Row: {
          chapters: string | null
          created_at: string
          episode: number
          kind: string
          note: string | null
          series_id: string
        }
        Insert: {
          chapters?: string | null
          created_at?: string
          episode: number
          kind: string
          note?: string | null
          series_id: string
        }
        Update: {
          chapters?: string | null
          created_at?: string
          episode?: number
          kind?: string
          note?: string | null
          series_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "episode_annotations_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      episodes: {
        Row: {
          air_date: string | null
          number: number
          series_id: string
          title: string
          type: string
        }
        Insert: {
          air_date?: string | null
          number: number
          series_id: string
          title?: string
          type: string
        }
        Update: {
          air_date?: string | null
          number?: number
          series_id?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "episodes_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      ingest_afg_pages: {
        Row: {
          changed_at: string
          content_hash: string
          etag: string | null
          fetched_at: string
          last_modified: string | null
          raw: Json
          raw_html: string | null
          slug: string
        }
        Insert: {
          changed_at?: string
          content_hash: string
          etag?: string | null
          fetched_at?: string
          last_modified?: string | null
          raw: Json
          raw_html?: string | null
          slug: string
        }
        Update: {
          changed_at?: string
          content_hash?: string
          etag?: string | null
          fetched_at?: string
          last_modified?: string | null
          raw?: Json
          raw_html?: string | null
          slug?: string
        }
        Relationships: []
      }
      ingest_afl_shows: {
        Row: {
          changed_at: string
          content_hash: string
          etag: string | null
          fetched_at: string
          last_modified: string | null
          raw: Json
          slug: string
        }
        Insert: {
          changed_at?: string
          content_hash: string
          etag?: string | null
          fetched_at?: string
          last_modified?: string | null
          raw: Json
          slug: string
        }
        Update: {
          changed_at?: string
          content_hash?: string
          etag?: string | null
          fetched_at?: string
          last_modified?: string | null
          raw?: Json
          slug?: string
        }
        Relationships: []
      }
      ingest_anilist_media: {
        Row: {
          anilist_id: number
          changed_at: string
          content_hash: string
          fetched_at: string
          raw: Json
        }
        Insert: {
          anilist_id: number
          changed_at?: string
          content_hash: string
          fetched_at?: string
          raw: Json
        }
        Update: {
          anilist_id?: number
          changed_at?: string
          content_hash?: string
          fetched_at?: string
          raw?: Json
        }
        Relationships: []
      }
      ingest_flags: {
        Row: {
          created_at: string
          detail: Json
          id: number
          kind: string
          resolved_at: string | null
          run_id: number | null
          series_key: string
          source: string
          status: string
        }
        Insert: {
          created_at?: string
          detail?: Json
          id?: never
          kind: string
          resolved_at?: string | null
          run_id?: number | null
          series_key: string
          source: string
          status?: string
        }
        Update: {
          created_at?: string
          detail?: Json
          id?: never
          kind?: string
          resolved_at?: string | null
          run_id?: number | null
          series_key?: string
          source?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "ingest_flags_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "ingest_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      ingest_fractionals: {
        Row: {
          air_date: string | null
          disposition: string | null
          fetched_at: string
          note: string | null
          position: number
          series_id: string
          source: string
          title: string | null
        }
        Insert: {
          air_date?: string | null
          disposition?: string | null
          fetched_at?: string
          note?: string | null
          position: number
          series_id: string
          source?: string
          title?: string | null
        }
        Update: {
          air_date?: string | null
          disposition?: string | null
          fetched_at?: string
          note?: string | null
          position?: number
          series_id?: string
          source?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ingest_wiki_fractionals_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      ingest_mangaupdates: {
        Row: {
          changed_at: string
          content_hash: string
          fetched_at: string
          manga_anilist_id: number
          mangadex_uuid: string | null
          mu_series_id: number
          mu_slug: string | null
          raw: Json
        }
        Insert: {
          changed_at?: string
          content_hash: string
          fetched_at?: string
          manga_anilist_id: number
          mangadex_uuid?: string | null
          mu_series_id: number
          mu_slug?: string | null
          raw: Json
        }
        Update: {
          changed_at?: string
          content_hash?: string
          fetched_at?: string
          manga_anilist_id?: number
          mangadex_uuid?: string | null
          mu_series_id?: number
          mu_slug?: string | null
          raw?: Json
        }
        Relationships: []
      }
      ingest_runs: {
        Row: {
          changed: number
          fetched: number
          finished_at: string | null
          flagged: number
          id: number
          note: string | null
          source: string
          started_at: string
          status: string
          unchanged: number
        }
        Insert: {
          changed?: number
          fetched?: number
          finished_at?: string | null
          flagged?: number
          id?: never
          note?: string | null
          source: string
          started_at?: string
          status?: string
          unchanged?: number
        }
        Update: {
          changed?: number
          fetched?: number
          finished_at?: string | null
          flagged?: number
          id?: never
          note?: string | null
          source?: string
          started_at?: string
          status?: string
          unchanged?: number
        }
        Relationships: []
      }
      ingest_wikipedia_chapters: {
        Row: {
          changed_at: string
          content_hash: string
          fetched_at: string
          manga_anilist_id: number
          page_title: string
          raw_wikitext: string
        }
        Insert: {
          changed_at?: string
          content_hash: string
          fetched_at?: string
          manga_anilist_id: number
          page_title: string
          raw_wikitext: string
        }
        Update: {
          changed_at?: string
          content_hash?: string
          fetched_at?: string
          manga_anilist_id?: number
          page_title?: string
          raw_wikitext?: string
        }
        Relationships: []
      }
      manga_reader_sites: {
        Row: {
          anime_id: string | null
          created_at: string
          id: string
          name: string
          notes: string | null
          series_url: string | null
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          anime_id?: string | null
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          series_url?: string | null
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          anime_id?: string | null
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          series_url?: string | null
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      series: {
        Row: {
          afl_slug: string | null
          aired_episodes: number
          anilist_id: number | null
          asterisk_review: string | null
          average_score: number | null
          banner_url: string | null
          continue_from_chapter: number | null
          cover_color: string | null
          cover_url: string | null
          duration_min: number | null
          end_date: string | null
          external_links: Json
          favourites: number | null
          format: string | null
          genres: string[]
          id: string
          is_adult: boolean
          latest_known_chapters: number | null
          mal_id: number | null
          manga_anilist_id: number | null
          manga_start_chapter: number | null
          manga_start_volume: number | null
          manga_status: string | null
          mapping_mode: string
          max_adapted_chapter: number | null
          mean_score: number | null
          next_airing_at: string | null
          popularity: number
          search_text: string
          season: string | null
          season_year: number | null
          source_type: string
          start_date: string | null
          status: string
          studios: string[]
          synonyms: string[]
          synopsis_html: string | null
          tags: Json
          title: string
          title_english: string | null
          title_native: string | null
          total_chapters: number | null
          total_episodes: number | null
          total_volumes: number | null
          trending: number | null
          updated_at: string
        }
        Insert: {
          afl_slug?: string | null
          aired_episodes?: number
          anilist_id?: number | null
          asterisk_review?: string | null
          average_score?: number | null
          banner_url?: string | null
          continue_from_chapter?: number | null
          cover_color?: string | null
          cover_url?: string | null
          duration_min?: number | null
          end_date?: string | null
          external_links?: Json
          favourites?: number | null
          format?: string | null
          genres?: string[]
          id: string
          is_adult?: boolean
          latest_known_chapters?: number | null
          mal_id?: number | null
          manga_anilist_id?: number | null
          manga_start_chapter?: number | null
          manga_start_volume?: number | null
          manga_status?: string | null
          mapping_mode?: string
          max_adapted_chapter?: number | null
          mean_score?: number | null
          next_airing_at?: string | null
          popularity?: number
          search_text?: string
          season?: string | null
          season_year?: number | null
          source_type?: string
          start_date?: string | null
          status: string
          studios?: string[]
          synonyms?: string[]
          synopsis_html?: string | null
          tags?: Json
          title: string
          title_english?: string | null
          title_native?: string | null
          total_chapters?: number | null
          total_episodes?: number | null
          total_volumes?: number | null
          trending?: number | null
          updated_at?: string
        }
        Update: {
          afl_slug?: string | null
          aired_episodes?: number
          anilist_id?: number | null
          asterisk_review?: string | null
          average_score?: number | null
          banner_url?: string | null
          continue_from_chapter?: number | null
          cover_color?: string | null
          cover_url?: string | null
          duration_min?: number | null
          end_date?: string | null
          external_links?: Json
          favourites?: number | null
          format?: string | null
          genres?: string[]
          id?: string
          is_adult?: boolean
          latest_known_chapters?: number | null
          mal_id?: number | null
          manga_anilist_id?: number | null
          manga_start_chapter?: number | null
          manga_start_volume?: number | null
          manga_status?: string | null
          mapping_mode?: string
          max_adapted_chapter?: number | null
          mean_score?: number | null
          next_airing_at?: string | null
          popularity?: number
          search_text?: string
          season?: string | null
          season_year?: number | null
          source_type?: string
          start_date?: string | null
          status?: string
          studios?: string[]
          synonyms?: string[]
          synopsis_html?: string | null
          tags?: Json
          title?: string
          title_english?: string | null
          title_native?: string | null
          total_chapters?: number | null
          total_episodes?: number | null
          total_volumes?: number | null
          trending?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      series_components: {
        Row: {
          afl_offset: number
          afl_slug: string | null
          air_date: string | null
          anilist_id: number
          episode_end: number | null
          episode_start: number | null
          kind: string
          label: string | null
          season_order: number
          series_id: string
          watch_position: number | null
        }
        Insert: {
          afl_offset?: number
          afl_slug?: string | null
          air_date?: string | null
          anilist_id: number
          episode_end?: number | null
          episode_start?: number | null
          kind?: string
          label?: string | null
          season_order: number
          series_id: string
          watch_position?: number | null
        }
        Update: {
          afl_offset?: number
          afl_slug?: string | null
          air_date?: string | null
          anilist_id?: number
          episode_end?: number | null
          episode_start?: number | null
          kind?: string
          label?: string | null
          season_order?: number
          series_id?: string
          watch_position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "series_components_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      series_external_ids: {
        Row: {
          created_at: string
          external_id: string
          series_id: string
          source: string
        }
        Insert: {
          created_at?: string
          external_id: string
          series_id: string
          source: string
        }
        Update: {
          created_at?: string
          external_id?: string
          series_id?: string
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "series_external_ids_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      series_relations: {
        Row: {
          from_series: string
          kind: string
          to_series: string
        }
        Insert: {
          from_series: string
          kind: string
          to_series: string
        }
        Update: {
          from_series?: string
          kind?: string
          to_series?: string
        }
        Relationships: [
          {
            foreignKeyName: "series_relations_from_series_fkey"
            columns: ["from_series"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "series_relations_to_series_fkey"
            columns: ["to_series"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      series_scopes: {
        Row: {
          afl_slug: string
          end_chapter: number | null
          end_volume: number | null
          note: string | null
          start_chapter: number | null
          start_volume: number | null
          updated_at: string
        }
        Insert: {
          afl_slug: string
          end_chapter?: number | null
          end_volume?: number | null
          note?: string | null
          start_chapter?: number | null
          start_volume?: number | null
          updated_at?: string
        }
        Update: {
          afl_slug?: string
          end_chapter?: number | null
          end_volume?: number | null
          note?: string | null
          start_chapter?: number | null
          start_volume?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      source_map: {
        Row: {
          afg_slug: string | null
          afl_slug: string
          anilist_id: number | null
          confidence: number
          created_at: string
          disposition: string
          mal_id: number | null
          match_method: string
          note: string | null
          updated_at: string
          verified: boolean
        }
        Insert: {
          afg_slug?: string | null
          afl_slug: string
          anilist_id?: number | null
          confidence?: number
          created_at?: string
          disposition?: string
          mal_id?: number | null
          match_method: string
          note?: string | null
          updated_at?: string
          verified?: boolean
        }
        Update: {
          afg_slug?: string | null
          afl_slug?: string
          anilist_id?: number | null
          confidence?: number
          created_at?: string
          disposition?: string
          mal_id?: number | null
          match_method?: string
          note?: string | null
          updated_at?: string
          verified?: boolean
        }
        Relationships: []
      }
      volume_boundaries: {
        Row: {
          chapter_end: number | null
          chapter_start: number
          created_at: string
          manga_anilist_id: number
          source: string
          source_page: string | null
          volume: number
        }
        Insert: {
          chapter_end?: number | null
          chapter_start: number
          created_at?: string
          manga_anilist_id: number
          source?: string
          source_page?: string | null
          volume: number
        }
        Update: {
          chapter_end?: number | null
          chapter_start?: number
          created_at?: string
          manga_anilist_id?: number
          source?: string
          source_page?: string | null
          volume?: number
        }
        Relationships: []
      }
      watch_order_entries: {
        Row: {
          air_date: string | null
          chapter: number | null
          chapters_adapted: string | null
          created_at: string
          display_label: string | null
          kind: string | null
          note: string | null
          position: number
          series_id: string
          title: string
          volume: number | null
        }
        Insert: {
          air_date?: string | null
          chapter?: number | null
          chapters_adapted?: string | null
          created_at?: string
          display_label?: string | null
          kind?: string | null
          note?: string | null
          position: number
          series_id: string
          title: string
          volume?: number | null
        }
        Update: {
          air_date?: string | null
          chapter?: number | null
          chapters_adapted?: string | null
          created_at?: string
          display_label?: string | null
          kind?: string | null
          note?: string | null
          position?: number
          series_id?: string
          title?: string
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "watch_order_entries_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      invoke_edge_refresh: { Args: { fn: string }; Returns: undefined }
      set_vault_secret: {
        Args: { secret_name: string; secret_value: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
  public: {
    Enums: {},
  },
} as const
