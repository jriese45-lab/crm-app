import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, UserPlus, ArrowRight, Pencil, Trash2 } from 'lucide-react';
import { useLeadsStore } from '../../store/useLeadsStore';
import type { ActivityEvent } from '../../types';

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

const EVENT_CONFIG: Record<ActivityEvent['type'], { icon: typeof UserPlus; color: string; verb: string }> = {
  lead_created: { icon: UserPlus,   color: 'var(--green)',  verb: 'Added'   },
  lead_moved:   { icon: ArrowRight, color: 'var(--blue)',   verb: 'Moved'   },
  lead_edited:  { icon: Pencil,     color: 'var(--accent)', verb: 'Updated' },
  lead_deleted: { icon: Trash2,     color: 'var(--red)',    verb: 'Deleted' },
  note_added:   { icon: Pencil,     color: 'var(--purple)', verb: 'Note'    },
};

function EventRow({ event }: { event: ActivityEvent }) {
  const cfg = EVENT_CONFIG[event.type];
  const Icon = cfg.icon;
  const text = event.type === 'lead_moved'
    ? `${event.leadName} → ${event.toColumn}`
    : event.leadName;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '9px 0',
      borderBottom: '1px solid var(--border-1)',
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: 7,
        background: `${cfg.color}22`,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Icon size={12} color={cfg.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 13,
          color: 'var(--text-1)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          <span style={{ color: cfg.color, fontWeight: 500, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            {cfg.verb}{' '}
          </span>
          {text}
        </p>
      </div>
      <span style={{
        fontSize: 11,
        color: 'var(--text-3)',
        flexShrink: 0,
        fontFamily: 'var(--font-mono)',
      }}>
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
        opacity: isDragging ? 0.4 : 1,
        background: 'var(--surface-1)',
        border: '1px solid var(--border-1)',
        borderRadius: 14,
        padding: '22px 24px',
        position: 'relative',
        gridColumn: 'span 2',
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

      <div style={{ marginBottom: 18 }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 15,
          fontWeight: 600,
          color: 'var(--text-1)',
          letterSpacing: '-0.01em',
          marginBottom: 3,
        }}>
          Activity
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
          Recent pipeline changes
        </p>
      </div>

      <div style={{ maxHeight: 260, overflowY: 'auto' }}>
        {activity.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '32px 0',
            color: 'var(--text-3)',
            fontSize: 13,
          }}>
            No activity yet — add your first lead.
          </div>
        ) : (
          activity.slice(0, 20).map((e) => <EventRow key={e.id} event={e} />)
        )}
      </div>
    </div>
  );
}
