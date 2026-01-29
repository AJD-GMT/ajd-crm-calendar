import { Department, CampaignStatus } from "@/constants";

export interface Campaign {
  id: string;
  title: string;
  description?: string;
  department: Department;
  status: CampaignStatus;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

// Calendar Event Type (Schedule-X 호환)
export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  calendarId?: string;
  description?: string;
}
