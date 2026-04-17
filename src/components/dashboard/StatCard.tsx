import type { LucideIcon } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface StatCardProps {
  id: string;
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  subtitle?: string;
}

export function StatCard({ id, label, value, icon: Icon, color, subtitle }: StatCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.45 : 1,
        background: '#fff',
        borderRadius: 16,
        padding: '24px 24px 22px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        overflow: 'hidden',
      }}
      className="group"
    >
      {/* Accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: color,
          borderRadius: '16px 16px 0 0',
        }}
      />

      {/* Drag handle */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          opacity: 0,
          cursor: 'grab',
          color: '#94a3b8',
          transition: 'opacity 0.15s',
        }}
        className="group-hover:!opacity-100"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={15} />
      </div>

      {/* Icon + label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: `${color}14`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
            flexShrink: 0,
          }}
        >
          <Icon size={19} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#64748b' }}>{label}</span>
      </div>

      {/* Value */}
      <div>
        <span style={{ fontSize: 36, fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>
          {value}
        </span>
        {subtitle && (
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 5 }}>{subtitle}</p>
        )}
      </div>
    </div>
  );
}
