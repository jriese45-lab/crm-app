import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreVertical, Pencil, Trash2, Mail, Phone, Building2, AlertCircle } from 'lucide-react';
import type { Lead, LeadPriority } from '../../types';
import { useLeadsStore } from '../../store/useLeadsStore';
import { Modal } from '../ui/Modal';
import { LeadForm } from './LeadForm';

interface LeadCardProps {
  lead: Lead;
  onClick?: () => void;
}

const priorityDot: Record<LeadPriority, string> = {
  high: '#ef4444', medium: '#f59e0b', low: '#10b981',
};

export function LeadCard({ lead, onClick }: LeadCardProps) {
  const { deleteLead } = useLeadsStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lead.id,
    data: { type: 'lead', columnId: lead.columnId },
  });

  const displayName = lead.name || lead.businessName || 'Unnamed Lead';
  const initials = displayName.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const prio = (lead.priority ?? 'medium') as LeadPriority;
  const isOverdue = lead.followUpDate && new Date(lead.followUpDate) < new Date();

  return (
    <>
      <div
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          opacity: isDragging ? 0.35 : 1,
          zIndex: isDragging ? 999 : undefined,
          background: '#fff',
          borderRadius: 12,
          padding: '11px 13px',
          boxShadow: isDragging ? '0 12px 32px rgba(0,0,0,0.14)' : '0 1px 3px rgba(0,0,0,0.06)',
          cursor: 'grab',
          position: 'relative',
          borderLeft: `3px solid ${priorityDot[prio]}`,
        }}
        className="group"
        {...attributes}
        {...listeners}
        onClick={() => {
          if (menuOpen) return;
          onClick?.();
        }}
      >
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              backgroundColor: 'var(--color-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0,
            }}>{initials || '?'}</div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1f2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {displayName}
              </p>
              {lead.businessName && lead.name && (
                <p style={{ fontSize: 11.5, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 3, marginTop: 1 }}>
                  <Building2 size={9} /> {lead.businessName}
                </p>
              )}
            </div>
          </div>

          {/* Menu */}
          <div style={{ position: 'relative', flexShrink: 0 }} onPointerDown={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
              style={{ width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', opacity: 0, transition: 'opacity 0.15s' }}
              className="group-hover:!opacity-100"
            >
              <MoreVertical size={13} />
            </button>
            {menuOpen && (
              <div style={{ position: 'absolute', right: 0, top: 26, background: '#fff', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid #f1f5f9', padding: '4px 0', zIndex: 200, width: 130 }}>
                <button onClick={(e) => { e.stopPropagation(); setEditing(true); setMenuOpen(false); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', fontSize: 13, color: '#374151', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#f8fafc'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'none'; }}
                >
                  <Pencil size={12} /> Edit
                </button>
                <button onClick={(e) => { e.stopPropagation(); deleteLead(lead.id); setMenuOpen(false); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', fontSize: 13, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#fef2f2'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'none'; }}
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Meta */}
        <div style={{ marginTop: 9, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {lead.businessSector && (
            <span style={{ display: 'inline-flex', alignSelf: 'flex-start', fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 99, backgroundColor: '#f1f5f9', color: '#64748b' }}>
              {lead.businessSector}
            </span>
          )}
          {lead.email && (
            <span style={{ fontSize: 11.5, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 5, overflow: 'hidden' }}>
              <Mail size={10} style={{ flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.email}</span>
            </span>
          )}
          {lead.phone && (
            <span style={{ fontSize: 11.5, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Phone size={10} style={{ flexShrink: 0 }} />{lead.phone}
            </span>
          )}
        </div>

        {/* Footer row */}
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Score bar */}
          {lead.score !== undefined && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 36, height: 4, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${lead.score}%`, background: lead.score >= 70 ? '#10b981' : lead.score >= 40 ? '#f59e0b' : '#ef4444', borderRadius: 99 }} />
              </div>
              <span style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 500 }}>{lead.score}</span>
            </div>
          )}
          {isOverdue && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#ef4444', fontWeight: 600 }}>
              <AlertCircle size={11} /> Overdue
            </span>
          )}
        </div>
      </div>

      {editing && (
        <Modal title="Edit Lead" onClose={() => setEditing(false)} size="lg">
          <LeadForm lead={lead} defaultColumnId={lead.columnId} onClose={() => setEditing(false)} />
        </Modal>
      )}
    </>
  );
}
