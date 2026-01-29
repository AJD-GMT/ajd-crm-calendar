import type { Database } from '@/types/supabase';

export type Campaign = Database['public']['Tables']['campaigns']['Row'];
export type CampaignInsert = Database['public']['Tables']['campaigns']['Insert'];
export type CampaignUpdate = Database['public']['Tables']['campaigns']['Update'];

export type ExpectedReaction = 'HIGH' | 'MID' | 'LOW';

export interface CampaignFilters {
  bizUnit?: string[];
  channel?: string[];
  reaction?: string[];
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
}

export interface CampaignFormData {
  title: string;
  send_at: string;
  biz_unit: string;
  channel: string;
  audience_size: number;
  expected_reaction: ExpectedReaction;
  cs_memo?: string;
}
