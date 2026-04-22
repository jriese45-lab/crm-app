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
        opacity: isDragging ? 0.4 : 1,
        background: 'var(--surface-1)',
        border: '1px solid var(--border-1)',
        borderRadius: 14,
        padding: '22px 24px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        overflow: 'hidden',
        cursor: 'default',
      }}
      className="group"
    >
      {/* Glow accent top-left */}
      <div style={{
        position: 'absolute',
        top: -30,
        left: -20,
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: `${color}12`,
        filter: 'blur(30px)',
        pointerEvents: 'none',
      }} />

      {/* Drag handle */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          opacity: 0,
          cursor: 'grab',
          color: 'var(--text-3)',
          transition: 'opacity 0.15s',
        }}
        className="group-hover:!opacity-100"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={14} />
      </div>

      {/* Icon + label row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: `${color}14`,
          border: `1px solid ${color}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color,
          flexShrink: 0,
        }}>
          <Icon size={16} strokeWidth={1.75} />
        </div>
        <span style={{
          fontSize: 12,
          fontWeight: 500,
          color: 'var(--text-2)',
          letterSpacing: '0.01em',
        }}>
          {label}
        </span>
      </div>

      {/* Value */}
      <div>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 40,
          fontWeight: 700,
          color: 'var(--text-1)',
          lineHeight: 1,
          letterSpacing: '-0.03em',
        }}>
          {value}
        </span>
        {subtitle && (
          <p style={{
            fontSize: 11.5,
            color: 'var(--text-3)',
            marginTop: 6,
            fontFamily: 'var(--font-body)',
          }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Bottom accent line */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: 2,
        background: `linear-gradient(90deg, ${color}60, transparent)`,
        borderRadius: '0 0 14px 14px',
      }} />
    </div>
  );
}
