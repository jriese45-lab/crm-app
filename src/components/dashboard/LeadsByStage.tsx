import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { useLeadsStore } from '../../store/useLeadsStore';

export function LeadsByStage({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });
  const columns = useLeadsStore((s) => s.columns);
  const leads   = useLeadsStore((s) => s.leads);

  const sorted = [...columns].sort((a, b) => a.order - b.order);
  const counts = sorted.map((c) => leads.filter((l) => l.columnId === c.id).length);
  const max    = Math.max(...counts, 1);
  const total  = counts.reduce((a, b) => a + b, 0);

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        background: 'var(--surface-1)',
        border: '1px solid var(--border-1)',
        borderRadius: 14,
        padding: '22px 24px',
        position: 'relative',
      }}
      className="group"
    >
      <div
        style={{ position: 'absolute', top: 14, right: 14, opacity: 0, cursor: 'grab', color: 'var(--text-3)', transition: 'opacity 0.15s' }}
        className="group-hover:!opacity-100"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={14} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 15,
          fontWeight: 600,
          color: 'var(--text-1)',
          letterSpacing: '-0.01em',
          marginBottom: 3,
        }}>
          Pipeline Stages
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
          {total} leads across {sorted.length} stages
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
        {sorted.map((col, i) => {
          const count = counts[i];
          const pct = Math.round((count / max) * 100);
          const share = total > 0 ? Math.round((count / total) * 100) : 0;

          return (
            <div key={col.id}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: col.color,
                    boxShadow: `0 0 6px ${col.color}80`,
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontSize: 12.5,
                    color: 'var(--text-2)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: 130,
                  }}>
                    {col.title}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 10.5, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
                    {share}%
                  </span>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--text-1)',
                    fontFamily: 'var(--font-mono)',
                    minWidth: 16,
                    textAlign: 'right',
                  }}>
                    {count}
                  </span>
                </div>
              </div>
              <div style={{ height: 4, background: 'var(--surface-3)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: col.color,
                  borderRadius: 99,
                  transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: `0 0 8px ${col.color}60`,
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
