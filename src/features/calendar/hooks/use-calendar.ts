'use client';

import { useState, useCallback, useMemo } from 'react';
import { getMonthDays } from '@/lib/utils/date';

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 이전 월로 이동
  const goToPrevMonth = useCallback(() => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  // 다음 월로 이동
  const goToNextMonth = useCallback(() => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  // 오늘로 이동
  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  // 해당 월의 모든 날짜 (캘린더 그리드용)
  const days = useMemo(() => getMonthDays(year, month), [year, month]);

  return {
    year,
    month,
    days,
    currentDate,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
  };
}
