// 사업부 정의
export const DEPARTMENTS = {
  INTERNET: "인터넷",
  RENTAL: "렌탈",
  MOBILE: "모바일",
  BUDGET_PHONE: "알뜰폰",
  FUNERAL: "상조",
  MOVING: "이사",
  CLEANING: "청소",
  CARD: "카드",
  REALESTATE: "부동산",
  INTERIOR: "인테리어",
} as const;

export type Department = typeof DEPARTMENTS[keyof typeof DEPARTMENTS];

// 사업부 목록 (배열)
export const BIZ_UNIT_LIST = Object.values(DEPARTMENTS);

// 사업부별 컬러 매핑
export const DEPARTMENT_COLORS: Record<string, string> = {
  [DEPARTMENTS.INTERNET]: "#3B82F6",    // blue-500
  [DEPARTMENTS.RENTAL]: "#10B981",      // emerald-500
  [DEPARTMENTS.MOBILE]: "#8B5CF6",      // violet-500
  [DEPARTMENTS.BUDGET_PHONE]: "#06B6D4", // cyan-500
  [DEPARTMENTS.FUNERAL]: "#6B7280",     // gray-500
  [DEPARTMENTS.MOVING]: "#F59E0B",      // amber-500
  [DEPARTMENTS.CLEANING]: "#14B8A6",    // teal-500
  [DEPARTMENTS.CARD]: "#EF4444",        // red-500
  [DEPARTMENTS.REALESTATE]: "#F97316",  // orange-500
  [DEPARTMENTS.INTERIOR]: "#A855F7",    // purple-500
} as const;

// 채널 정의
export const CHANNELS = {
  LMS: "LMS",
  MMS: "MMS",
  FRIEND_TALK: "친구톡",
  ALIM_TALK: "알림톡",
  BRAND_MSG: "브랜드메세지",
} as const;

export type Channel = typeof CHANNELS[keyof typeof CHANNELS];

// 채널 목록 (배열)
export const CHANNEL_LIST = Object.values(CHANNELS);

// 캠페인 상태
export const CAMPAIGN_STATUS = {
  PLANNED: "계획",
  IN_PROGRESS: "진행중",
  COMPLETED: "완료",
  CANCELLED: "취소",
} as const;

export type CampaignStatus = typeof CAMPAIGN_STATUS[keyof typeof CAMPAIGN_STATUS];
