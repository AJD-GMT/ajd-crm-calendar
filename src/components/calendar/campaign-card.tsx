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
  [DEPARTMENTS.BUDGET_PHONE]: 'bg-cyan-100 border-cyan-500',
  [DEPARTMENTS.FUNERAL]: 'bg-gray-100 border-gray-500',
  [DEPARTMENTS.MOVING]: 'bg-amber-100 border-amber-500',
  [DEPARTMENTS.CLEANING]: 'bg-teal-100 border-teal-500',
  [DEPARTMENTS.CARD]: 'bg-red-100 border-red-500',
  [DEPARTMENTS.REALESTATE]: 'bg-orange-100 border-orange-500',
  [DEPARTMENTS.INTERIOR]: 'bg-purple-100 border-purple-500',
};

// 반응도별 아이콘
const REACTION_ICONS: Record<string, string> = {
  HIGH: '🔥',
  MID: '🙂',
  LOW: '🧊',
};

// 복수 사업부의 첫 번째 사업부 기준으로 색상 결정
function getFirstBizUnit(bizUnit: string): string {
  return bizUnit.split(',')[0].trim();
}

export function CampaignCard({ campaign, onClick }: CampaignCardProps) {
  const firstBizUnit = getFirstBizUnit(campaign.biz_unit);
  const bgClass = BIZ_UNIT_BG[firstBizUnit] || 'bg-gray-100 border-gray-500';
  const reactionIcon = REACTION_ICONS[campaign.expected_reaction] || '🙂';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full text-left px-2 py-1.5 rounded border-l-2 text-xs',
        'hover:shadow-sm transition-shadow cursor-pointer',
        bgClass
      )}
    >
      {/* 캠페인명 */}
      <div className="font-semibold text-gray-900 truncate">
        {campaign.title}
      </div>

      {/* 발송 시간 */}
      <div className="text-gray-700 mt-0.5">
        {formatTime(campaign.send_at)}
      </div>

      {/* 발송 규모 + 예상 반응도 */}
      <div className="flex items-center justify-between mt-0.5 text-gray-600">
        <span>{formatNumber(campaign.audience_size)}명</span>
        <span className="text-sm">{reactionIcon}</span>
      </div>

      {/* 사업부 */}
      <div className="mt-0.5 text-gray-500 truncate">
        {campaign.biz_unit}
      </div>
    </button>
  );
}
