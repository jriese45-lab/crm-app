export type LeadId = string;
export type ColumnId = string;
export type WidgetId =
  | 'stat-total-leads'
  | 'stat-closed-won'
  | 'stat-closed-lost'
  | 'stat-conversion'
  | 'leads-by-stage'
  | 'activity-feed';

export interface BrandConfig {
  companyName: string;
  logoUrl: string;
  primaryColor: string;
}

export type LeadPriority = 'low' | 'medium' | 'high';

export interface Lead {
  id: LeadId;
  name: string;
  businessName: string;
  businessSector: string;
  email: string;
  phone: string;
  columnId: ColumnId;
  createdAt: string;
  updatedAt: string;
  notes: string;
  priority: LeadPriority;
  followUpDate: string;   // ISO date string or ''
  score: number;          // 0-100
  address: string;
  website: string;
  source: string;         // 'cold call' | 'referral' | 'walk-in' | 'online' | 'other'
}

export interface KanbanColumn {
  id: ColumnId;
  title: string;
  order: number;
  color: string;
}

export type ActivityEventType =
  | 'lead_created'
  | 'lead_moved'
  | 'lead_edited'
  | 'lead_deleted'
  | 'note_added';

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  leadId: LeadId;
  leadName: string;
  fromColumn?: string;
  toColumn?: string;
  note?: string;
  timestamp: string;
}

export interface DashboardWidget {
  id: WidgetId;
  label: string;
  order: number;
}
