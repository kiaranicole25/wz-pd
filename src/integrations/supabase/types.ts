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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor_role: string
          actor_username: string
          area: string
          created_at: string
          detalle: string
          id: string
        }
        Insert: {
          action: string
          actor_role: string
          actor_username: string
          area: string
          created_at?: string
          detalle?: string
          id?: string
        }
        Update: {
          action?: string
          actor_role?: string
          actor_username?: string
          area?: string
          created_at?: string
          detalle?: string
          id?: string
        }
        Relationships: []
      }
      avisos_importantes: {
        Row: {
          created_at: string
          desarrollo: string
          id: string
          imagen_url: string | null
          redactor: string
          titulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          desarrollo?: string
          id?: string
          imagen_url?: string | null
          redactor?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          desarrollo?: string
          id?: string
          imagen_url?: string | null
          redactor?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      cupula_users: {
        Row: {
          created_at: string
          id: string
          password_hash: string
          perm_importantes: boolean
          perm_logs: boolean
          perm_noticias: boolean
          perm_sapd: boolean
          perm_vetados: boolean
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          password_hash: string
          perm_importantes?: boolean
          perm_logs?: boolean
          perm_noticias?: boolean
          perm_sapd?: boolean
          perm_vetados?: boolean
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          password_hash?: string
          perm_importantes?: boolean
          perm_logs?: boolean
          perm_noticias?: boolean
          perm_sapd?: boolean
          perm_vetados?: boolean
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      noticias: {
        Row: {
          created_at: string
          desarrollo: string
          id: string
          imagen_url: string | null
          redactor: string
          titulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          desarrollo?: string
          id?: string
          imagen_url?: string | null
          redactor?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          desarrollo?: string
          id?: string
          imagen_url?: string | null
          redactor?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      personal: {
        Row: {
          cargo: string
          created_at: string
          division: string
          expediente: string
          id: string
          imagen_url: string | null
          nombre: string
          notas: string
          placa: string
          rango_id: string
          updated_at: string
        }
        Insert: {
          cargo?: string
          created_at?: string
          division?: string
          expediente: string
          id?: string
          imagen_url?: string | null
          nombre: string
          notas?: string
          placa?: string
          rango_id: string
          updated_at?: string
        }
        Update: {
          cargo?: string
          created_at?: string
          division?: string
          expediente?: string
          id?: string
          imagen_url?: string | null
          nombre?: string
          notas?: string
          placa?: string
          rango_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "personal_rango_id_fkey"
            columns: ["rango_id"]
            isOneToOne: false
            referencedRelation: "rangos"
            referencedColumns: ["id"]
          },
        ]
      }
      profugos: {
        Row: {
          created_at: string
          delitos: string[]
          id: string
          imagen_url: string | null
          localidad: string
          nombre: string
          numero_procesamiento: string
          orden: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          delitos?: string[]
          id?: string
          imagen_url?: string | null
          localidad?: string
          nombre: string
          numero_procesamiento: string
          orden?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          delitos?: string[]
          id?: string
          imagen_url?: string | null
          localidad?: string
          nombre?: string
          numero_procesamiento?: string
          orden?: number
          updated_at?: string
        }
        Relationships: []
      }
      rangos: {
        Row: {
          created_at: string
          id: string
          key: string
          label: string
          orden: number
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          label: string
          orden: number
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          label?: string
          orden?: number
        }
        Relationships: []
      }
      vetados: {
        Row: {
          created_at: string
          discord_id: string
          id: string
          motivo: string
          nombre: string
          orden: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          discord_id?: string
          id?: string
          motivo: string
          nombre: string
          orden?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          discord_id?: string
          id?: string
          motivo?: string
          nombre?: string
          orden?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      cupula_users_public: {
        Row: {
          created_at: string | null
          id: string | null
          perm_importantes: boolean | null
          perm_logs: boolean | null
          perm_noticias: boolean | null
          perm_sapd: boolean | null
          perm_vetados: boolean | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          perm_importantes?: boolean | null
          perm_logs?: boolean | null
          perm_noticias?: boolean | null
          perm_sapd?: boolean | null
          perm_vetados?: boolean | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          perm_importantes?: boolean | null
          perm_logs?: boolean | null
          perm_noticias?: boolean | null
          perm_sapd?: boolean | null
          perm_vetados?: boolean | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      next_expediente: { Args: never; Returns: string }
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
