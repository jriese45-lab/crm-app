import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, UserPlus, ArrowRight, Pencil, Trash2 } from 'lucide-react';
import { useLeadsStore } from '../../store/useLeadsStore';
import type { ActivityEvent } from '../../types';

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const EVENT_CONFIG: Record<ActivityEvent['type'], { icon: typeof UserPlus; color: string; bg: string; verb: string }> = {
  lead_created: { icon: UserPlus,   color: '#10b981', bg: '#ecfdf5', verb: 'Added' },
  lead_moved:   { icon: ArrowRight, color: '#3b82f6', bg: '#eff6ff', verb: 'Moved' },
  lead_edited:  { icon: Pencil,     color: '#f59e0b', bg: '#fffbeb', verb: 'Updated' },
  lead_deleted: { icon: Trash2,     color: '#ef4444', bg: '#fef2f2', verb: 'Deleted' },
  note_added:   { icon: Pencil,     color: '#8b5cf6', bg: '#f5f3ff', verb: 'Note on' },
};

function EventRow({ event }: { event: ActivityEvent }) {
  const cfg = EVENT_CONFIG[event.type];
  const Icon = cfg.icon;

  const text = event.type === 'lead_moved'
    ? `${event.leadName} → ${event.toColumn}`
    : event.leadName;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f8fafc' }}>
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          backgroundColor: cfg.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={13} color={cfg.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12.5, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <span style={{ fontWeight: 600 }}>{cfg.verb} </span>
          {text}
        </p>
      </div>
      <span style={{ fontSize: 11.5, color: '#94a3b8', flexShrink: 0 }}>
        {formatRelative(event.timestamp)}
      </span>
    </div>
  );
}

export function ActivityFeed({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });
  const activity = useLeadsStore((s) => s.activity);

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
        gridColumn: 'span 2',
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

      <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>
        Recent Activity
      </p>
      <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>
        Latest changes to your pipeline
      </p>

      <div style={{ maxHeight: 260, overflowY: 'auto' }}>
        {activity.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8', fontSize: 13 }}>
            No activity yet — add your first lead to get started.
          </div>
        ) : (
          activity.slice(0, 20).map((e) => <EventRow key={e.id} event={e} />)
        )}
      </div>
    </div>
  );
}
