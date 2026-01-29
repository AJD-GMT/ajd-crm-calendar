'use client';

import { Calendar, Clock, Users, TrendingUp, MessageSquare, Edit, Copy, Trash2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { parseISODateParts, extractTimeFromISO } from '@/lib/utils/date';
import type { Campaign } from '@/features/campaigns/types';

const WEEKDAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

interface CampaignDetailPanelProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (campaign: Campaign) => void;
  onCopy?: (campaign: Campaign) => void;
  onDelete?: (campaign: Campaign) => void;
  isAuthenticated?: boolean;
}

const BIZ_UNIT_COLORS: Record<string, string> = {
  AJ렌터카: 'bg-blue-100 text-blue-800',
  AJ카플랫: 'bg-green-100 text-green-800',
  AJD: 'bg-purple-100 text-purple-800',
};

const REACTION_LABELS: Record<string, { label: string; icon: string }> = {
  HIGH: { label: '높음', icon: '🔥' },
  MID: { label: '중간', icon: '⭐' },
  LOW: { label: '낮음', icon: '💤' },
};

export function CampaignDetailPanel({
  campaign,
  isOpen,
  onClose,
  onEdit,
  onCopy,
  onDelete,
  isAuthenticated = false,
}: CampaignDetailPanelProps) {
  if (!campaign) return null;

  // 타임존 변환 없이 문자열에서 직접 추출
  const { year, month, day } = parseISODateParts(campaign.send_at);
  const time = extractTimeFromISO(campaign.send_at);
  const weekday = WEEKDAY_NAMES[new Date(year, month, day).getDay()];
  const reactionInfo = REACTION_LABELS[campaign.expected_reaction] || REACTION_LABELS.MID;
  const bizUnitColor = BIZ_UNIT_COLORS[campaign.biz_unit] || 'bg-gray-100 text-gray-800';

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>캠페인 상세</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] pb-6">
          {/* 캠페인명 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3>
          </div>

          {/* 발송일시 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>발송 날짜</span>
            </div>
            <p className="text-base font-medium">
              {year}년 {String(month + 1).padStart(2, '0')}월 {String(day).padStart(2, '0')}일 ({weekday})
            </p>
          </div>

          {/* 발송 시간 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>발송 시간</span>
            </div>
            <p className="text-base font-medium">
              {time}
            </p>
          </div>

          {/* 사업부 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>사업부</span>
            </div>
            <Badge className={bizUnitColor}>{campaign.biz_unit}</Badge>
          </div>

          {/* 채널 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MessageSquare className="h-4 w-4" />
              <span>채널</span>
            </div>
            <p className="text-base font-medium">{campaign.channel}</p>
          </div>

          {/* 발송 규모 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>발송 규모</span>
            </div>
            <p className="text-base font-medium">
              {campaign.audience_size.toLocaleString()}명
            </p>
          </div>

          {/* 예상 반응도 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="h-4 w-4" />
              <span>예상 반응도</span>
            </div>
            <p className="text-base font-medium">
              <span className="mr-1">{reactionInfo.icon}</span>
              {reactionInfo.label}
            </p>
          </div>

          {/* CS 참고 메모 */}
          {campaign.cs_memo && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>CS 참고 메모</span>
              </div>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md whitespace-pre-wrap">
                {campaign.cs_memo}
              </p>
            </div>
          )}

          {/* 액션 버튼들 (로그인 시에만 표시) */}
          {isAuthenticated && (
            <div className="pt-4 border-t space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => onEdit?.(campaign)}
              >
                <Edit className="h-4 w-4 mr-2" />
                수정
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => onCopy?.(campaign)}
              >
                <Copy className="h-4 w-4 mr-2" />
                복사
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => onDelete?.(campaign)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                삭제
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
