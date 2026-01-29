'use client';

import { useMemo } from 'react';
import { useCalendar } from '@/features/calendar/hooks/use-calendar';
import { useCampaigns } from '@/features/campaigns/queries';
import { CalendarHeader } from './calendar-header';
import { CalendarDayCell } from './calendar-day-cell';
import { formatDateKey } from '@/lib/utils/date';
import type { Campaign, CampaignFilters } from '@/features/campaigns/types';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

interface CrmCalendarProps {
  onCampaignClick?: (campaign: Campaign) => void;
  filters?: CampaignFilters;
}

export function CrmCalendar({ onCampaignClick, filters }: CrmCalendarProps) {
  const { year, month, days, goToPrevMonth, goToNextMonth, goToToday } = useCalendar();

  // 캠페인 데이터 페칭
  const { data: campaigns = [], isLoading, error } = useCampaigns(filters);

  // 날짜별로 캠페인 그룹화
  const campaignsByDate = useMemo(() => {
    const grouped: Record<string, Campaign[]> = {};

    campaigns.forEach((campaign) => {
      const dateKey = formatDateKey(new Date(campaign.send_at));
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(campaign);
    });

    // 각 날짜별로 시간순 정렬
    Object.keys(grouped).forEach((dateKey) => {
      grouped[dateKey].sort(
        (a, b) => new Date(a.send_at).getTime() - new Date(b.send_at).getTime()
      );
    });

    return grouped;
  }, [campaigns]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-500">
          캠페인 데이터를 불러오는데 실패했습니다.
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 캘린더 헤더 */}
      <CalendarHeader
        year={year}
        month={month}
        onPrevMonth={goToPrevMonth}
        onNextMonth={goToNextMonth}
        onToday={goToToday}
      />

      {/* 캘린더 그리드 */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {WEEKDAYS.map((day, index) => (
            <div
              key={day}
              className={`
                py-3 text-center text-sm font-semibold
                ${index === 0 ? 'text-red-600' : ''}
                ${index === 6 ? 'text-blue-600' : ''}
                ${index !== 0 && index !== 6 ? 'text-gray-700' : ''}
              `}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7">
          {days.map((date, index) => {
            const dateKey = formatDateKey(date);
            const dayCampaigns = campaignsByDate[dateKey] || [];

            return (
              <CalendarDayCell
                key={index}
                date={date}
                campaigns={dayCampaigns}
                year={year}
                month={month}
                onCampaignClick={onCampaignClick}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
