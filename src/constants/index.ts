// 사업부 정의
export const DEPARTMENTS = {
  INTERNET: "인터넷",
  RENTAL: "렌탈",
  MOBILE: "모바일",
  MOVING: "이사",
  FUNERAL: "상조",
  COMMON: "공통",
} as const;

export type Department = typeof DEPARTMENTS[keyof typeof DEPARTMENTS];

// 사업부별 컬러 매핑
export const DEPARTMENT_COLORS = {
  [DEPARTMENTS.INTERNET]: "#3B82F6",  // blue-500
  [DEPARTMENTS.RENTAL]: "#10B981",    // emerald-500
  [DEPARTMENTS.MOBILE]: "#8B5CF6",    // violet-500
  [DEPARTMENTS.MOVING]: "#F59E0B",    // amber-500
  [DEPARTMENTS.FUNERAL]: "#6B7280",   // gray-500
  [DEPARTMENTS.COMMON]: "#EC4899",    // pink-500
} as const;

// 캠페인 상태
export const CAMPAIGN_STATUS = {
  PLANNED: "계획",
  IN_PROGRESS: "진행중",
  COMPLETED: "완료",
  CANCELLED: "취소",
} as const;

export type CampaignStatus = typeof CAMPAIGN_STATUS[keyof typeof CAMPAIGN_STATUS];
