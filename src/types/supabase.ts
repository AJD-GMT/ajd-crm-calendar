export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      campaigns: {
        Row: {
          id: string;
          title: string;
          send_at: string;
          biz_unit: string;
          channel: string;
          audience_size: number;
          expected_reaction: 'HIGH' | 'MID' | 'LOW';
          cs_memo: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          send_at: string;
          biz_unit: string;
          channel: string;
          audience_size?: number;
          expected_reaction?: 'HIGH' | 'MID' | 'LOW';
          cs_memo?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          send_at?: string;
          biz_unit?: string;
          channel?: string;
          audience_size?: number;
          expected_reaction?: 'HIGH' | 'MID' | 'LOW';
          cs_memo?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    Views: {};
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    Functions: {};
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    Enums: {};
  };
}
