export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      astrograph: {
        Row: {
          content: Json;
          created_at: string | null;
          id: number;
          name: string;
          type: string;
          user: number;
        };
        Insert: {
          content: Json;
          created_at?: string | null;
          id?: number;
          name?: string;
          type?: string;
          user: number;
        };
        Update: {
          content?: Json;
          created_at?: string | null;
          id?: number;
          name?: string;
          type?: string;
          user?: number;
        };
      };
      user: {
        Row: {
          avatar: string | null;
          created_at: string;
          email: string;
          id: number;
          password: string;
          phone: string | null;
          role: string;
          subemail: string | null;
          username: string;
        };
        Insert: {
          avatar?: string | null;
          created_at?: string;
          email?: string;
          id?: number;
          password?: string;
          phone?: string | null;
          role?: string;
          subemail?: string | null;
          username?: string;
        };
        Update: {
          avatar?: string | null;
          created_at?: string;
          email?: string;
          id?: number;
          password?: string;
          phone?: string | null;
          role?: string;
          subemail?: string | null;
          username?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
