export type MatchDocumentsRow = {
  id: string;
  content: string;
  title: string | null;
  source: string | null;
  similarity: number;
};

export type Database = {
  public: {
    Tables: {
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          domain: string;
          attempts: number;
          correct: number;
          mastery_pct: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          domain: string;
          attempts?: number;
          correct?: number;
          mastery_pct?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          domain?: string;
          attempts?: number;
          correct?: number;
          mastery_pct?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_notes: {
        Row: {
          id: string;
          user_id: string;
          topic: string;
          content: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          topic: string;
          content?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          topic?: string;
          content?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      match_documents: {
        Args: { query_embedding: number[]; match_count?: number };
        Returns: MatchDocumentsRow[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
