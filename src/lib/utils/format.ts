import { extractDateFromISO, extractTimeFromISO, parseISOAsLocal } from './date';

// 숫자 포맷 (천 단위 구분)
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('ko-KR').format(value);
}

// 대상자 수 포맷 (예: 9,980명)
export function formatAudienceSize(size: number): string {
  return `${formatNumber(size)}명`;
}

// 날짜 포맷 (한국 시간 기준, 타임존 변환 없음)
export function formatDate(date: string | Date): string {
  if (typeof date === 'string') {
    return extractDateFromISO(date);
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 캘린더용 날짜 포맷
export function formatCalendarDate(date: string | Date): string {
  return formatDate(date);
}

// 시간 포맷 (한국 시간 기준, 타임존 변환 없음)
export function formatTime(date: string | Date): string {
  if (typeof date === 'string') {
    return extractTimeFromISO(date);
  }
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// 상대 시간 포맷 (예: 2시간 전)
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const target = typeof date === 'string' ? parseISOAsLocal(date) : date;
  const diffInMs = now.getTime() - target.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return '방금 전';
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  if (diffInHours < 24) return `${diffInHours}시간 전`;
  if (diffInDays < 7) return `${diffInDays}일 전`;

  return formatDate(date);
}
