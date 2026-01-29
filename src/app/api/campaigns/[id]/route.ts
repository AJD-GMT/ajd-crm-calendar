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
import { campaignSchema } from '@/features/campaigns/schemas';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/campaigns/[id]
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();

    const { data: campaign, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !campaign) {
      return apiNotFound('캠페인을 찾을 수 없습니다');
    }

    return apiSuccess(campaign);
  } catch (error) {
    console.error('Unexpected error:', error);
    return apiServerError();
  }
}

// PUT /api/campaigns/[id]
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    // 인증 체크
    await requireAuth();

    const { id } = await context.params;
    const supabase = await createClient();
    const body = await request.json();

    // 검증
    const validationResult = campaignSchema.safeParse(body);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return apiError(firstError.message, 400);
    }

    const data = validationResult.data;

    // 캠페인 존재 확인
    const { data: existing } = await supabase
      .from('campaigns')
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) {
      return apiNotFound('캠페인을 찾을 수 없습니다');
    }

    // 캠페인 수정
    const { data: campaign, error } = await supabase
      .from('campaigns')
      .update({
        title: data.title,
        send_at: data.send_at,
        biz_unit: data.biz_unit,
        channel: data.channel,
        audience_size: data.audience_size,
        expected_reaction: data.expected_reaction,
        cs_memo: data.cs_memo || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Campaign update error:', error);
      return apiServerError('캠페인 수정에 실패했습니다');
    }

    return apiSuccess(campaign);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return apiUnauthorized();
    }
    console.error('Unexpected error:', error);
    return apiServerError();
  }
}

// DELETE /api/campaigns/[id]
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // 인증 체크
    await requireAuth();

    const { id } = await context.params;
    const supabase = await createClient();

    // 캠페인 존재 확인
    const { data: existing } = await supabase
      .from('campaigns')
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) {
      return apiNotFound('캠페인을 찾을 수 없습니다');
    }

    // 캠페인 삭제
    const { error } = await supabase.from('campaigns').delete().eq('id', id);

    if (error) {
      console.error('Campaign deletion error:', error);
      return apiServerError('캠페인 삭제에 실패했습니다');
    }

    return apiSuccess({ message: '캠페인이 삭제되었습니다' });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return apiUnauthorized();
    }
    console.error('Unexpected error:', error);
    return apiServerError();
  }
}
