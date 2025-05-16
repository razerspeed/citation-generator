export interface Database {
  public: {
    Tables: {
      citations: {
        Row: {
          id: string;
          user_id: string;
          citation_data: any;
          in_text_citation: string;
          bibliography_citation: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          citation_data: any;
          in_text_citation: string;
          bibliography_citation: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          citation_data?: any;
          in_text_citation?: string;
          bibliography_citation?: string;
          created_at?: string;
          updated_at?: string;
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
  };
}
