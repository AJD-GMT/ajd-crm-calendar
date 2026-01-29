import { createClient } from '@/lib/supabase/client';
import type { Campaign, CampaignInsert, CampaignUpdate, CampaignFilters } from '../types';

export const campaignService = {
  // 캠페인 목록 조회
  async getCampaigns(filters?: CampaignFilters): Promise<Campaign[]> {
    const supabase = createClient();
    let query = supabase
      .from('campaigns')
      .select('*')
      .order('send_at', { ascending: true });

    // 필터 적용
    if (filters?.bizUnit && filters.bizUnit.length > 0) {
      query = query.in('biz_unit', filters.bizUnit);
    }

    if (filters?.channel && filters.channel.length > 0) {
      query = query.in('channel', filters.channel);
    }

    if (filters?.reaction && filters.reaction.length > 0) {
      query = query.in('expected_reaction', filters.reaction);
    }

    if (filters?.searchQuery) {
      query = query.ilike('title', `%${filters.searchQuery}%`);
    }

    if (filters?.startDate) {
      query = query.gte('send_at', filters.startDate);
    }

    if (filters?.endDate) {
      query = query.lte('send_at', filters.endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data as Campaign[]) || [];
  },

  // 캠페인 단건 조회
  async getCampaign(id: string): Promise<Campaign> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Campaign;
  },

  // 캠페인 생성
  async createCampaign(campaign: CampaignInsert): Promise<Campaign> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const insertData = [{
      ...campaign,
      created_by: user?.id,
    }] as any;
    /* eslint-enable @typescript-eslint/no-explicit-any */

    const { data, error } = await supabase
      .from('campaigns')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return data as Campaign;
  },

  // 캠페인 수정
  async updateCampaign(id: string, campaign: CampaignUpdate): Promise<Campaign> {
    const supabase = createClient();
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const updateData = campaign as any;
    /* eslint-enable @typescript-eslint/no-explicit-any */

    const { data, error } = await supabase
      .from('campaigns')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Campaign;
  },

  // 캠페인 삭제
  async deleteCampaign(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // 캠페인 복사
  async copyCampaign(id: string, newSendAt: string): Promise<Campaign> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 기존 캠페인 조회
    const original = await this.getCampaign(id);

    // 새 캠페인 생성 (id, created_at, updated_at 제외)
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const insertData = [{
      title: original.title,
      send_at: newSendAt,
      biz_unit: original.biz_unit,
      channel: original.channel,
      audience_size: original.audience_size,
      expected_reaction: original.expected_reaction,
      cs_memo: original.cs_memo,
      created_by: user?.id,
    }] as any;
    /* eslint-enable @typescript-eslint/no-explicit-any */

    const { data, error } = await supabase
      .from('campaigns')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return data as Campaign;
  },
};
