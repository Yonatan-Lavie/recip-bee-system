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
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      DriveToken: {
        Row: {
          accessToken: string
          createdAt: string
          expiresAt: string
          id: string
          refreshToken: string
          updatedAt: string
          userId: string
        }
        Insert: {
          accessToken: string
          createdAt?: string
          expiresAt: string
          id: string
          refreshToken: string
          updatedAt: string
          userId: string
        }
        Update: {
          accessToken?: string
          createdAt?: string
          expiresAt?: string
          id?: string
          refreshToken?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "DriveToken_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Receipt: {
        Row: {
          amount: number | null
          category: string | null
          currency: string
          date: string | null
          driveId: string
          fileName: string
          fileSize: number
          fileUrl: string
          id: string
          metadata: Json
          mimeType: string
          processedAt: string | null
          rawText: string | null
          status: string
          uploadedAt: string
          userId: string
        }
        Insert: {
          amount?: number | null
          category?: string | null
          currency?: string
          date?: string | null
          driveId: string
          fileName: string
          fileSize: number
          fileUrl: string
          id: string
          metadata: Json
          mimeType: string
          processedAt?: string | null
          rawText?: string | null
          status?: string
          uploadedAt?: string
          userId: string
        }
        Update: {
          amount?: number | null
          category?: string | null
          currency?: string
          date?: string | null
          driveId?: string
          fileName?: string
          fileSize?: number
          fileUrl?: string
          id?: string
          metadata?: Json
          mimeType?: string
          processedAt?: string | null
          rawText?: string | null
          status?: string
          uploadedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Receipt_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Settings: {
        Row: {
          emailNotifications: boolean
          emailReports: boolean
          id: string
          reportDay: number
          reportEmail: string | null
          reportFrequency: string
          telegramNotifications: boolean
          updatedAt: string
          userId: string
        }
        Insert: {
          emailNotifications?: boolean
          emailReports?: boolean
          id: string
          reportDay?: number
          reportEmail?: string | null
          reportFrequency?: string
          telegramNotifications?: boolean
          updatedAt: string
          userId: string
        }
        Update: {
          emailNotifications?: boolean
          emailReports?: boolean
          id?: string
          reportDay?: number
          reportEmail?: string | null
          reportFrequency?: string
          telegramNotifications?: boolean
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Settings_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Subscription: {
        Row: {
          canceledAt: string | null
          createdAt: string
          currentPeriodEnd: string
          currentPeriodStart: string
          id: string
          planType: string
          status: string
          stripeCustomerId: string | null
          stripePriceId: string | null
          stripeSubscriptionId: string | null
          trialEnd: string | null
          trialStart: string | null
          updatedAt: string
          userId: string
        }
        Insert: {
          canceledAt?: string | null
          createdAt?: string
          currentPeriodEnd: string
          currentPeriodStart: string
          id: string
          planType: string
          status: string
          stripeCustomerId?: string | null
          stripePriceId?: string | null
          stripeSubscriptionId?: string | null
          trialEnd?: string | null
          trialStart?: string | null
          updatedAt: string
          userId: string
        }
        Update: {
          canceledAt?: string | null
          createdAt?: string
          currentPeriodEnd?: string
          currentPeriodStart?: string
          id?: string
          planType?: string
          status?: string
          stripeCustomerId?: string | null
          stripePriceId?: string | null
          stripeSubscriptionId?: string | null
          trialEnd?: string | null
          trialStart?: string | null
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Subscription_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      User: {
        Row: {
          authProvider: string | null
          authProviderId: string | null
          createdAt: string
          email: string
          id: string
          isActive: boolean
          name: string | null
          password: string | null
          updatedAt: string
        }
        Insert: {
          authProvider?: string | null
          authProviderId?: string | null
          createdAt?: string
          email: string
          id: string
          isActive?: boolean
          name?: string | null
          password?: string | null
          updatedAt: string
        }
        Update: {
          authProvider?: string | null
          authProviderId?: string | null
          createdAt?: string
          email?: string
          id?: string
          isActive?: boolean
          name?: string | null
          password?: string | null
          updatedAt?: string
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
