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
      contas: {
        Row: {
          criado_em: string | null
          data_vencimento: string
          id: string
          nome: string
          pago: boolean | null
          parcela_atual: number | null
          tipo: string
          total_parcelas: number | null
          usuario_id: string
          valor: number
        }
        Insert: {
          criado_em?: string | null
          data_vencimento: string
          id?: string
          nome: string
          pago?: boolean | null
          parcela_atual?: number | null
          tipo: string
          total_parcelas?: number | null
          usuario_id: string
          valor: number
        }
        Update: {
          criado_em?: string | null
          data_vencimento?: string
          id?: string
          nome?: string
          pago?: boolean | null
          parcela_atual?: number | null
          tipo?: string
          total_parcelas?: number | null
          usuario_id?: string
          valor?: number
        }
        Relationships: []
      }
      comentarios_contas: {
        Row: {
          id: string
          usuario_id: string
          conta_id: string
          texto: string
          data_comentario: string
          mes: number
          ano: number
          tipo_conta: string
          identificador_parcela: string | null
          criado_em: string | null
        }
        Insert: {
          id?: string
          usuario_id: string
          conta_id: string
          texto: string
          data_comentario?: string
          mes: number
          ano: number
          tipo_conta: string
          identificador_parcela?: string | null
          criado_em?: string | null
        }
        Update: {
          id?: string
          usuario_id?: string
          conta_id?: string
          texto?: string
          data_comentario?: string
          mes?: number
          ano?: number
          tipo_conta?: string
          identificador_parcela?: string | null
          criado_em?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comentarios_contas_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          }
        ]
      }
      pagamentos_contas: {
        Row: {
          id: string
          usuario_id: string
          conta_id: string
          data_pagamento: string
          data_vencimento: string
          mes: number
          ano: number
          tipo_conta: string
          identificador_parcela: string | null
          criado_em: string | null
        }
        Insert: {
          id?: string
          usuario_id: string
          conta_id: string
          data_pagamento: string
          data_vencimento: string
          mes: number
          ano: number
          tipo_conta: string
          identificador_parcela?: string | null
          criado_em?: string | null
        }
        Update: {
          id?: string
          usuario_id?: string
          conta_id?: string
          data_pagamento?: string
          data_vencimento?: string
          mes?: number
          ano?: number
          tipo_conta?: string
          identificador_parcela?: string | null
          criado_em?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_contas_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          }
        ]
      }
      perfis: {
        Row: {
          criado_em: string | null
          email: string | null
          id: string
          nome: string | null
        }
        Insert: {
          criado_em?: string | null
          email?: string | null
          id: string
          nome?: string | null
        }
        Update: {
          criado_em?: string | null
          email?: string | null
          id?: string
          nome?: string | null
        }
        Relationships: []
      }
      rendas: {
        Row: {
          criado_em: string | null
          data_pagamento: number
          id: string
          nome: string
          tipo: string
          usuario_id: string
          valor: number
        }
        Insert: {
          criado_em?: string | null
          data_pagamento: number
          id?: string
          nome: string
          tipo: string
          usuario_id: string
          valor: number
        }
        Update: {
          criado_em?: string | null
          data_pagamento?: number
          id?: string
          nome?: string
          tipo?: string
          usuario_id?: string
          valor?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
