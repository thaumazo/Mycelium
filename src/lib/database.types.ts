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
      api_keys: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string | null
          user: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string | null
          user?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string | null
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "API_Keys_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      items: {
        Row: {
          created_at: string
          id: number
          name: string
          user: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          user?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "log_items_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      items_tags: {
        Row: {
          item: string
          profile: string | null
          tag: string
        }
        Insert: {
          item: string
          profile?: string | null
          tag: string
        }
        Update: {
          item?: string
          profile?: string | null
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "items_tags_item_fkey"
            columns: ["item"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "items_tags_profile_fkey"
            columns: ["profile"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_tags_tag_fkey"
            columns: ["tag"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["name"]
          },
        ]
      }
      log: {
        Row: {
          created_at: string
          data: Json | null
          description: string | null
          id: string
          item: number | null
          user: string | null
        }
        Insert: {
          created_at?: string
          data?: Json | null
          description?: string | null
          id?: string
          item?: number | null
          user?: string | null
        }
        Update: {
          created_at?: string
          data?: Json | null
          description?: string | null
          id?: string
          item?: number | null
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "log_item_fkey"
            columns: ["item"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string
          id: number
          name: string
          user: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          user?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tags_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string
          due: string | null
          id: string
          name: string | null
          scheduled: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          due?: string | null
          id?: string
          name?: string | null
          scheduled?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          due?: string | null
          id?: string
          name?: string | null
          scheduled?: string | null
          status?: string | null
        }
        Relationships: []
      }
      typing: {
        Row: {
          accuracy: number | null
          created_at: string
          id: string
          profile: string | null
          wpm: number | null
        }
        Insert: {
          accuracy?: number | null
          created_at?: string
          id?: string
          profile?: string | null
          wpm?: number | null
        }
        Update: {
          accuracy?: number | null
          created_at?: string
          id?: string
          profile?: string | null
          wpm?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "typing_profile_fkey"
            columns: ["profile"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      typing_profiles: {
        Row: {
          "accuracy h": number | null
          avg_wpm: number | null
          created_at: string
          id: string
          user: string | null
        }
        Insert: {
          "accuracy h"?: number | null
          avg_wpm?: number | null
          created_at?: string
          id?: string
          user?: string | null
        }
        Update: {
          "accuracy h"?: number | null
          avg_wpm?: number | null
          created_at?: string
          id?: string
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "typing_profiles_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      fetch_foreign_keys: {
        Args: {
          table_name: string
        }
        Returns: {
          column_name: string
          foreign_table_name: string
          foreign_column_name: string
        }[]
      }
      get_foreign_keys: {
        Args: {
          table_name: string
        }
        Returns: {
          foreign_table_name: string
        }[]
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
