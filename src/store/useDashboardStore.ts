import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DashboardWidget, WidgetId } from '../types';

const DEFAULT_WIDGETS: DashboardWidget[] = [
  { id: 'stat-total-leads', label: 'Total Leads', order: 0 },
  { id: 'stat-closed-won', label: 'Closed Won', order: 1 },
  { id: 'stat-closed-lost', label: 'Closed Lost', order: 2 },
  { id: 'leads-by-stage', label: 'Leads by Stage', order: 3 },
  { id: 'activity-feed', label: 'Recent Activity', order: 4 },
];

interface DashboardStore {
  widgets: DashboardWidget[];
  reorderWidgets: (orderedIds: WidgetId[]) => void;
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      widgets: DEFAULT_WIDGETS,
      reorderWidgets: (orderedIds) =>
        set((state) => ({
          widgets: orderedIds.map((id, index) => {
            const w = state.widgets.find((w) => w.id === id)!;
            return { ...w, order: index };
          }),
        })),
    }),
    { name: 'crm_dashboard' }
  )
);
