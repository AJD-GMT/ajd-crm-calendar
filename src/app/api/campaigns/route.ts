import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  apiSuccess,
  apiError,
  apiUnauthorized,
  apiServerError,
} from '@/lib/utils/api-response';
import { requireAuth } from '@/lib/utils/auth';
import { campaignSchema } from '@/features/campaigns/schemas';
import type { Campaign } from '@/features/campaigns/types';

// GET /api/campaigns?year=2025&month=1&biz_unit=인터넷&channel=SMS
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const year = searchParams.get('year');
    const month = searchParams.get('month');
    const bizUnit = searchParams.getAll('biz_unit');
    const channel = searchParams.getAll('channel');
    const expectedReaction = searchParams.getAll('expected_reaction');

    let query = supabase.from('campaigns').select('*').order('send_at', { ascending: true });

    // 날짜 필터
    if (year && month) {
      const startDate = `${year}-${month.padStart(2, '0')}-01`;
      const endDate = new Date(parseInt(year), parseInt(month), 0)
        .toISOString()
        .split('T')[0];
      query = query.gte('send_at', startDate).lte('send_at', endDate);
    }

    // 사업부 필터
    if (bizUnit.length > 0) {
      query = query.in('biz_unit', bizUnit);
    }

    // 채널 필터
    if (channel.length > 0) {
      query = query.in('channel', channel);
    }

    // 예상 반응도 필터
    if (expectedReaction.length > 0) {
      query = query.in('expected_reaction', expectedReaction);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Campaign fetch error:', error);
      return apiServerError('캠페인 목록을 가져오는데 실패했습니다');
    }

    return apiSuccess<Campaign[]>(data || []);
  } catch (error) {
    console.error('Unexpected error:', error);
    return apiServerError();
  }
}

// POST /api/campaigns
export async function POST(request: NextRequest) {
  try {
    // 인증 체크
    const user = await requireAuth();

    const supabase = await createClient();
    const body = await request.json();

    // 검증
    const validationResult = campaignSchema.safeParse(body);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return apiError(firstError.message, 400);
    }

    const data = validationResult.data;

    // 캠페인 생성
    const { data: campaign, error } = await supabase
      .from('campaigns')
      .insert({
        title: data.title,
        send_at: data.send_at,
        biz_unit: data.biz_unit,
        channel: data.channel,
        audience_size: data.audience_size,
        expected_reaction: data.expected_reaction,
        send_message: data.send_message || null,
        cs_memo: data.cs_memo || null,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Campaign creation error:', error);
      return apiServerError('캠페인 생성에 실패했습니다');
    }

    return apiSuccess(campaign, 201);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return apiUnauthorized();
    }
    console.error('Unexpected error:', error);
    return apiServerError();
  }
}
