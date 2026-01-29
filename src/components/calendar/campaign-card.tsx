'use client';

import { type Campaign } from '@/features/campaigns/types';
import { DEPARTMENTS } from '@/constants';
import { formatTime, formatNumber } from '@/lib/utils/date';
import { cn } from '@/lib/utils';

interface CampaignCardProps {
  campaign: Campaign;
  onClick?: () => void;
}

// 사업부별 배경색 매핑
const BIZ_UNIT_BG: Record<string, string> = {
  [DEPARTMENTS.INTERNET]: 'bg-blue-100 border-blue-500',
  [DEPARTMENTS.RENTAL]: 'bg-emerald-100 border-emerald-500',
  [DEPARTMENTS.MOBILE]: 'bg-violet-100 border-violet-500',
  [DEPARTMENTS.MOVING]: 'bg-amber-100 border-amber-500',
  [DEPARTMENTS.FUNERAL]: 'bg-gray-100 border-gray-500',
  [DEPARTMENTS.COMMON]: 'bg-pink-100 border-pink-500',
};

// 반응도별 아이콘
const REACTION_ICONS: Record<string, string> = {
  HIGH: '🔥',
  MID: '🙂',
  LOW: '🧊',
};

export function CampaignCard({ campaign, onClick }: CampaignCardProps) {
  const bgClass = BIZ_UNIT_BG[campaign.biz_unit] || 'bg-gray-100 border-gray-500';
  const reactionIcon = REACTION_ICONS[campaign.expected_reaction] || '🙂';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full text-left px-2 py-1 rounded border-l-2 text-xs',
        'hover:shadow-sm transition-shadow cursor-pointer',
        bgClass
      )}
    >
      <div className="flex items-center justify-between gap-1">
        {/* 발송 시간 */}
        <span className="font-medium text-gray-900">
          {formatTime(campaign.send_at)}
        </span>

        {/* 반응도 아이콘 */}
        <span className="text-sm">{reactionIcon}</span>
      </div>

      <div className="mt-0.5 text-gray-700">
        {/* 발송 규모 */}
        <span className="font-semibold">{formatNumber(campaign.audience_size)}명</span>
      </div>

      {/* 사업부 */}
      <div className="mt-0.5 text-gray-600 truncate">
        {campaign.biz_unit}
      </div>
    </button>
  );
}
