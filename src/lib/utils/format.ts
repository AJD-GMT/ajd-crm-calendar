import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// 숫자 포맷 (천 단위 구분)
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('ko-KR').format(value);
}

// 대상자 수 포맷 (예: 9,980명)
export function formatAudienceSize(size: number): string {
  return `${formatNumber(size)}명`;
}

// 날짜 포맷
export function formatDate(
  date: string | Date,
  formatStr: string = 'yyyy-MM-dd HH:mm'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr, { locale: ko });
}

// 캘린더용 날짜 포맷
export function formatCalendarDate(date: string | Date): string {
  return formatDate(date, 'yyyy-MM-dd');
}

// 시간 포맷
export function formatTime(date: string | Date): string {
  return formatDate(date, 'HH:mm');
}

// 상대 시간 포맷 (예: 2시간 전)
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const target = typeof date === 'string' ? new Date(date) : date;
  const diffInMs = now.getTime() - target.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return '방금 전';
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  if (diffInHours < 24) return `${diffInHours}시간 전`;
  if (diffInDays < 7) return `${diffInDays}일 전`;

  return formatDate(date, 'yyyy년 M월 d일');
}
