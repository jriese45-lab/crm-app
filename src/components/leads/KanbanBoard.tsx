import { useState } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCorners,
} from '@dnd-kit/core';
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useLeadsStore } from '../../store/useLeadsStore';
import { KanbanColumn } from './KanbanColumn';
import { LeadCard } from './LeadCard';
import type { Lead } from '../../types';

interface KanbanBoardProps {
  searchQuery?: string;
  priorityFilter?: string;
  onCardClick?: (lead: Lead) => void;
}

export function KanbanBoard({ searchQuery = '', priorityFilter = '', onCardClick }: KanbanBoardProps) {
  const { columns, leads, moveLead, reorderLeadsInColumn } = useLeadsStore();
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);
  const activeLead = leads.find((l) => l.id === activeLeadId) ?? null;

  const getLeadsForColumn = (colId: string) => {
    let result = leads.filter((l) => l.columnId === colId);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((l) =>
        l.name.toLowerCase().includes(q) ||
        l.businessName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.includes(q)
      );
    }
    if (priorityFilter) result = result.filter((l) => (l.priority ?? 'medium') === priorityFilter);
    return result;
  };

  const handleDragStart = (e: DragStartEvent) => {
    if (e.active.data.current?.type === 'lead') setActiveLeadId(e.active.id as string);
  };

  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over || active.data.current?.type !== 'lead') return;
    const activeLeadId = active.id as string;
    const activeLead = leads.find((l) => l.id === activeLeadId);
    if (!activeLead) return;

    let toColumnId: string | null = null;
    if (over.data.current?.type === 'column') toColumnId = over.data.current.columnId as string;
    else if (over.data.current?.type === 'lead') {
      const overLead = leads.find((l) => l.id === over.id);
      if (overLead) toColumnId = overLead.columnId;
    }
    if (toColumnId && toColumnId !== activeLead.columnId) moveLead(activeLeadId, toColumnId);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveLeadId(null);
    if (!over || active.data.current?.type !== 'lead') return;
    const activeLeadId = active.id as string;
    const activeLead = leads.find((l) => l.id === activeLeadId);
    if (!activeLead) return;
    if (over.data.current?.type === 'lead' && over.id !== activeLeadId) {
      const overLead = leads.find((l) => l.id === over.id);
      if (overLead && overLead.columnId === activeLead.columnId) {
        const colLeads = leads.filter((l) => l.columnId === activeLead.columnId);
        const ids = colLeads.map((l) => l.id);
        const from = ids.indexOf(activeLeadId);
        const to = ids.indexOf(over.id as string);
        if (from !== -1 && to !== -1) reorderLeadsInColumn(activeLead.columnId, arrayMove(ids, from, to));
      }
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <SortableContext items={sortedColumns.map((c) => c.id)} strategy={horizontalListSortingStrategy}>
        <div style={{ display: 'flex', gap: 16, paddingBottom: 16, overflowX: 'auto', flex: 1 }}>
          {sortedColumns.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              leads={getLeadsForColumn(col.id)}
              onCardClick={onCardClick}
            />
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeLead ? <div style={{ transform: 'rotate(2deg) scale(1.04)' }}><LeadCard lead={activeLead} /></div> : null}
      </DragOverlay>
    </DndContext>
  );
}
