/**
 * 날짜 유틸리티 함수
 */

/**
 * 특정 년/월의 모든 날짜 배열 반환 (이전/다음 월 날짜 포함)
 * @param year - 연도
 * @param month - 월 (0-11)
 * @returns 캘린더 그리드에 표시할 날짜 배열 (6주 * 7일 = 42일)
 */
export function getMonthDays(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // 해당 월의 첫 날이 무슨 요일인지 (0: 일요일, 6: 토요일)
  const startDayOfWeek = firstDay.getDay();

  const days: Date[] = [];

  // 이전 월의 날짜들 추가
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push(date);
  }

  // 현재 월의 날짜들 추가
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  // 다음 월의 날짜들 추가 (6주 완성)
  const remainingDays = 42 - days.length; // 6주 * 7일
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
}

/**
 * 두 날짜가 같은 날인지 비교
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * 해당 날짜가 오늘인지 확인
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * 날짜가 현재 월에 속하는지 확인
 */
export function isCurrentMonth(date: Date, year: number, month: number): boolean {
  return date.getFullYear() === year && date.getMonth() === month;
}

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷
 */
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 시간을 HH:MM 형식으로 포맷 (타임존 변환 없이 문자열에서 직접 추출)
 */
export function formatTime(dateStr: string): string {
  // ISO 형식: "2026-01-29T18:00:00" 또는 "2026-01-29T18:00:00.000Z"
  const match = dateStr.match(/T(\d{2}):(\d{2})/);
  if (match) {
    return `${match[1]}:${match[2]}`;
  }
  // 폴백: 기존 방식
  const date = new Date(dateStr);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * 숫자를 천단위 구분자로 포맷
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ko-KR');
}
