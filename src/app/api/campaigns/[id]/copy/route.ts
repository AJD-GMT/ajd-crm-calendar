import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  apiSuccess,
  apiError,
  apiUnauthorized,
  apiNotFound,
  apiServerError,
} from '@/lib/utils/api-response';
import { requireAuth } from '@/lib/utils/auth';
import { z } from 'zod';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const copyCampaignSchema = z.object({
  send_at: z.string().min(1, '발송 일시를 선택해주세요'),
});

// POST /api/campaigns/[id]/copy
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    // 인증 체크
    const user = await requireAuth();

    const { id } = await context.params;
    const supabase = await createClient();
    const body = await request.json();

    // 검증
    const validationResult = copyCampaignSchema.safeParse(body);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return apiError(firstError.message, 400);
    }

    const { send_at } = validationResult.data;

    // 원본 캠페인 조회
    const { data: original, error: fetchError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !original) {
      return apiNotFound('복사할 캠페인을 찾을 수 없습니다');
    }

    // 새 캠페인 생성 (id, created_at, updated_at 제외)
    const { data: newCampaign, error: createError } = await supabase
      .from('campaigns')
      .insert({
        title: `${original.title} (복사본)`,
        send_at,
        biz_unit: original.biz_unit,
        channel: original.channel,
        audience_size: original.audience_size,
        expected_reaction: original.expected_reaction,
        cs_memo: original.cs_memo,
        created_by: user.id,
      })
      .select()
      .single();

    if (createError) {
      console.error('Campaign copy error:', createError);
      return apiServerError('캠페인 복사에 실패했습니다');
    }

    return apiSuccess(newCampaign, 201);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return apiUnauthorized();
    }
    console.error('Unexpected error:', error);
    return apiServerError();
  }
}
