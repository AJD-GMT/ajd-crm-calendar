'use client';

import { type Campaign } from '@/features/campaigns/types';
import { isToday, isCurrentMonth } from '@/lib/utils/date';
import { cn } from '@/lib/utils';
import { CampaignCard } from './campaign-card';
import { useState } from 'react';

interface CalendarDayCellProps {
  date: Date;
  campaigns: Campaign[];
  year: number;
  month: number;
  onCampaignClick?: (campaign: Campaign) => void;
}

const MAX_VISIBLE_CAMPAIGNS = 3;

export function CalendarDayCell({
  date,
  campaigns,
  year,
  month,
  onCampaignClick,
}: CalendarDayCellProps) {
  const [showAll, setShowAll] = useState(false);
  const isCurrentMonthDate = isCurrentMonth(date, year, month);
  const isTodayDate = isToday(date);

  const visibleCampaigns = showAll
    ? campaigns
    : campaigns.slice(0, MAX_VISIBLE_CAMPAIGNS);
  const remainingCount = campaigns.length - MAX_VISIBLE_CAMPAIGNS;

  return (
    <div
      className={cn(
        'min-h-[120px] border-r border-b border-gray-200 p-2',
        !isCurrentMonthDate && 'bg-gray-50'
      )}
    >
      {/* 날짜 숫자 */}
      <div className="flex items-center justify-between mb-2">
        <span
          className={cn(
            'inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium',
            isTodayDate && 'bg-blue-500 text-white',
            !isTodayDate && isCurrentMonthDate && 'text-gray-900',
            !isTodayDate && !isCurrentMonthDate && 'text-gray-400'
          )}
        >
          {date.getDate()}
        </span>
      </div>

      {/* 캠페인 카드 목록 */}
      <div className="space-y-1">
        {visibleCampaigns.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            onClick={() => onCampaignClick?.(campaign)}
          />
        ))}

        {/* 더보기 버튼 */}
        {!showAll && remainingCount > 0 && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="w-full text-left px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
          >
            +{remainingCount} 더보기
          </button>
        )}

        {/* 접기 버튼 */}
        {showAll && campaigns.length > MAX_VISIBLE_CAMPAIGNS && (
          <button
            type="button"
            onClick={() => setShowAll(false)}
            className="w-full text-left px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
          >
            접기
          </button>
        )}
      </div>
    </div>
  );
}
