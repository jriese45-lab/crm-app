import { useState } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { Users, TrendingDown, Award, Plus } from 'lucide-react';
import { useDashboardStore } from '../store/useDashboardStore';
import { useLeadsStore } from '../store/useLeadsStore';
import { StatCard } from '../components/dashboard/StatCard';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { LeadsByStage } from '../components/dashboard/LeadsByStage';
import { Modal } from '../components/ui/Modal';
import { LeadForm } from '../components/leads/LeadForm';
import type { WidgetId } from '../types';
import { useBrandStore } from '../store/useBrandStore';

export function DashboardPage() {
  const { widgets, reorderWidgets } = useDashboardStore();
  const { leads, columns } = useLeadsStore();
  const { brand } = useBrandStore();
  const [addingLead, setAddingLead] = useState(false);

  const firstColumnId = [...columns].sort((a, b) => a.order - b.order)[0]?.id ?? '';

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const sorted = [...widgets].sort((a, b) => a.order - b.order);
  const widgetIds = sorted.map((w) => w.id);

  const closedWonCol = columns.find((c) => c.title === 'Closed Won');
  const closedLostCol = columns.find((c) => c.title === 'Closed Lost');
  const closedWon = closedWonCol ? leads.filter((l) => l.columnId === closedWonCol.id).length : 0;
  const closedLost = closedLostCol ? leads.filter((l) => l.columnId === closedLostCol.id).length : 0;

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      const from = widgetIds.indexOf(active.id as WidgetId);
      const to = widgetIds.indexOf(over.id as WidgetId);
      reorderWidgets(arrayMove(widgetIds, from, to));
    }
  };

  const renderWidget = (id: WidgetId) => {
    switch (id) {
      case 'stat-total-leads':
        return <StatCard key={id} id={id} label="Total Leads" value={leads.length}
          icon={Users} color={brand.primaryColor} subtitle="Across all stages" />;
      case 'stat-closed-won':
        return <StatCard key={id} id={id} label="Closed Won" value={closedWon}
          icon={Award} color="#10b981" subtitle="Successfully converted" />;
      case 'stat-closed-lost':
        return <StatCard key={id} id={id} label="Closed Lost" value={closedLost}
          icon={TrendingDown} color="#ef4444" subtitle="Did not convert" />;
      case 'leads-by-stage':
        return <LeadsByStage key={id} id={id} />;
      case 'activity-feed':
        return <ActivityFeed key={id} id={id} />;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 26,
            fontWeight: 600,
            color: 'var(--text-1)',
            letterSpacing: '-0.03em',
            marginBottom: 5,
          }}>
            Welcome back
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>
            Here's what's happening with your pipeline today.
          </p>
        </div>
        <button
          onClick={() => setAddingLead(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: '9px 18px',
            borderRadius: 9,
            background: 'var(--accent)',
            color: '#000',
            fontWeight: 600,
            fontSize: 13.5,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 20px var(--accent-glow)',
            transition: 'opacity 0.15s, transform 0.1s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.88'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
        >
          <Plus size={15} strokeWidth={2.5} />
          Add Lead
        </button>
      </div>

      <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 16, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        Drag to rearrange
      </p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={widgetIds} strategy={rectSortingStrategy}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {sorted.map((w) => renderWidget(w.id))}
          </div>
        </SortableContext>
      </DndContext>

      {addingLead && (
        <Modal title="Add New Lead" onClose={() => setAddingLead(false)}>
          <LeadForm defaultColumnId={firstColumnId} onClose={() => setAddingLead(false)} />
        </Modal>
      )}
    </div>
  );
}
