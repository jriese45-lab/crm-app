import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';
import type { Lead, KanbanColumn, ActivityEvent, LeadId, ColumnId } from '../types';

const DEFAULT_COLUMNS: KanbanColumn[] = [
  { id: uuid(), title: 'New Lead', order: 0, color: '#6366f1' },
  { id: uuid(), title: 'Contacted', order: 1, color: '#f59e0b' },
  { id: uuid(), title: 'Qualified', order: 2, color: '#3b82f6' },
  { id: uuid(), title: 'Proposal Sent', order: 3, color: '#8b5cf6' },
  { id: uuid(), title: 'Closed Won', order: 4, color: '#10b981' },
  { id: uuid(), title: 'Closed Lost', order: 5, color: '#ef4444' },
];

interface LeadsStore {
  columns: KanbanColumn[];
  leads: Lead[];
  activity: ActivityEvent[];

  addColumn: () => void;
  renameColumn: (id: ColumnId, title: string) => void;
  setColumnColor: (id: ColumnId, color: string) => void;
  deleteColumn: (id: ColumnId) => void;
  reorderColumns: (orderedIds: ColumnId[]) => void;

  addLead: (data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLead: (id: LeadId, data: Partial<Lead>) => void;
  deleteLead: (id: LeadId) => void;
  moveLead: (leadId: LeadId, toColumnId: ColumnId) => void;
  reorderLeadsInColumn: (columnId: ColumnId, orderedIds: LeadId[]) => void;
  addNote: (leadId: LeadId, note: string) => void;

  getLeadsByColumn: (columnId: ColumnId) => Lead[];
}

const addActivity = (
  activity: ActivityEvent[],
  event: Omit<ActivityEvent, 'id' | 'timestamp'>
): ActivityEvent[] => {
  const newEvent: ActivityEvent = { ...event, id: uuid(), timestamp: new Date().toISOString() };
  return [newEvent, ...activity].slice(0, 100);
};

export const useLeadsStore = create<LeadsStore>()(
  persist(
    (set, get) => ({
      columns: DEFAULT_COLUMNS,
      leads: [],
      activity: [],

      addColumn: () =>
        set((state) => ({
          columns: [
            ...state.columns,
            { id: uuid(), title: 'New Stage', order: state.columns.length, color: '#64748b' },
          ],
        })),

      renameColumn: (id, title) =>
        set((state) => ({ columns: state.columns.map((c) => c.id === id ? { ...c, title } : c) })),

      setColumnColor: (id, color) =>
        set((state) => ({ columns: state.columns.map((c) => c.id === id ? { ...c, color } : c) })),

      deleteColumn: (id) =>
        set((state) => {
          const firstOtherId = state.columns.find((c) => c.id !== id)?.id;
          return {
            columns: state.columns.filter((c) => c.id !== id).map((c, i) => ({ ...c, order: i })),
            leads: state.leads.map((l) => l.columnId === id ? { ...l, columnId: firstOtherId ?? l.columnId } : l),
          };
        }),

      reorderColumns: (orderedIds) =>
        set((state) => ({
          columns: orderedIds.map((id, index) => {
            const col = state.columns.find((c) => c.id === id)!;
            return { ...col, order: index };
          }),
        })),

      addLead: (data) => {
        const now = new Date().toISOString();
        const newLead: Lead = { ...data, id: uuid(), createdAt: now, updatedAt: now };
        set((state) => {
          const colTitle = state.columns.find((c) => c.id === data.columnId)?.title ?? '';
          return {
            leads: [...state.leads, newLead],
            activity: addActivity(state.activity, {
              type: 'lead_created',
              leadId: newLead.id,
              leadName: data.name || data.businessName || 'Unnamed Lead',
              toColumn: colTitle,
            }),
          };
        });
      },

      updateLead: (id, data) =>
        set((state) => ({
          leads: state.leads.map((l) => l.id === id ? { ...l, ...data, updatedAt: new Date().toISOString() } : l),
          activity: addActivity(state.activity, {
            type: 'lead_edited',
            leadId: id,
            leadName: data.name || state.leads.find((l) => l.id === id)?.name || 'Unnamed Lead',
          }),
        })),

      deleteLead: (id) =>
        set((state) => {
          const lead = state.leads.find((l) => l.id === id);
          return {
            leads: state.leads.filter((l) => l.id !== id),
            activity: addActivity(state.activity, {
              type: 'lead_deleted',
              leadId: id,
              leadName: lead?.name || lead?.businessName || 'Unnamed Lead',
            }),
          };
        }),

      moveLead: (leadId, toColumnId) =>
        set((state) => {
          const lead = state.leads.find((l) => l.id === leadId);
          if (!lead || lead.columnId === toColumnId) return state;
          const fromColTitle = state.columns.find((c) => c.id === lead.columnId)?.title ?? '';
          const toColTitle = state.columns.find((c) => c.id === toColumnId)?.title ?? '';
          return {
            leads: state.leads.map((l) =>
              l.id === leadId ? { ...l, columnId: toColumnId, updatedAt: new Date().toISOString() } : l
            ),
            activity: addActivity(state.activity, {
              type: 'lead_moved',
              leadId,
              leadName: lead.name || lead.businessName || 'Unnamed Lead',
              fromColumn: fromColTitle,
              toColumn: toColTitle,
            }),
          };
        }),

      reorderLeadsInColumn: (columnId, orderedIds) =>
        set((state) => {
          const otherLeads = state.leads.filter((l) => l.columnId !== columnId);
          const reordered = orderedIds.map((id) => state.leads.find((l) => l.id === id)).filter(Boolean) as Lead[];
          return { leads: [...otherLeads, ...reordered] };
        }),

      addNote: (leadId, note) =>
        set((state) => {
          const lead = state.leads.find((l) => l.id === leadId);
          const existing = lead?.notes ?? '';
          const timestamp = new Date().toLocaleString();
          const updated = existing ? `${existing}\n\n[${timestamp}] ${note}` : `[${timestamp}] ${note}`;
          return {
            leads: state.leads.map((l) => l.id === leadId ? { ...l, notes: updated, updatedAt: new Date().toISOString() } : l),
            activity: addActivity(state.activity, {
              type: 'note_added',
              leadId,
              leadName: lead?.name || lead?.businessName || 'Unnamed Lead',
              note,
            }),
          };
        }),

      getLeadsByColumn: (columnId) => get().leads.filter((l) => l.columnId === columnId),
    }),
    { name: 'crm_leads' }
  )
);
