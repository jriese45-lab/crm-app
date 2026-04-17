import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { useLeadsStore } from '../../store/useLeadsStore';

export function LeadsByStage({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });
  const columns = useLeadsStore((s) => s.columns);
  const leads = useLeadsStore((s) => s.leads);

  const sorted = [...columns].sort((a, b) => a.order - b.order);
  const counts = sorted.map((c) => leads.filter((l) => l.columnId === c.id).length);
  const max = Math.max(...counts, 1);

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.45 : 1,
        background: '#fff',
        borderRadius: 16,
        padding: '24px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
        position: 'relative',
      }}
      className="group"
    >
      <div
        style={{ position: 'absolute', top: 14, right: 14, opacity: 0, cursor: 'grab', color: '#94a3b8', transition: 'opacity 0.15s' }}
        className="group-hover:!opacity-100"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={15} />
      </div>

      <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 20 }}>
        Leads by Stage
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {sorted.map((col, i) => {
          const count = counts[i];
          const pct = Math.round((count / max) * 100);
          return (
            <div key={col.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: col.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 12.5, color: '#64748b', width: 110, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {col.title}
              </span>
              <div style={{ flex: 1, height: 6, backgroundColor: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${pct}%`,
                    backgroundColor: col.color,
                    borderRadius: 99,
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#374151', width: 16, textAlign: 'right', flexShrink: 0 }}>
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
