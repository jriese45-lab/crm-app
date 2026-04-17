import { useState, useEffect } from 'react';
import { X, Pencil, Mail, Phone, Globe, MapPin, Tag, Calendar, Star, Send, Trash2, ArrowRight, UserPlus, FileText } from 'lucide-react';
import type { Lead, LeadPriority } from '../../types';
import { useLeadsStore } from '../../store/useLeadsStore';
import { useBrandStore } from '../../store/useBrandStore';

interface LeadDrawerProps {
  lead: Lead;
  onClose: () => void;
  onEdit: (lead: Lead) => void;
}

const priorityConfig: Record<LeadPriority, { bg: string; color: string; label: string }> = {
  high:   { bg: '#fef2f2', color: '#ef4444', label: 'High' },
  medium: { bg: '#fffbeb', color: '#f59e0b', label: 'Medium' },
  low:    { bg: '#f0fdf4', color: '#10b981', label: 'Low' },
};

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function LeadDrawer({ lead, onClose, onEdit }: LeadDrawerProps) {
  const { columns, activity, addNote, deleteLead } = useLeadsStore();
  const { brand } = useBrandStore();
  const [noteText, setNoteText] = useState('');
  const [currentLead, setCurrentLead] = useState(lead);

  // Stay in sync if lead updates
  const storeLead = useLeadsStore((s) => s.leads.find((l) => l.id === lead.id));
  useEffect(() => { if (storeLead) setCurrentLead(storeLead); }, [storeLead]);

  const stage = columns.find((c) => c.id === currentLead.columnId);
  const prio = (currentLead.priority ?? 'medium') as LeadPriority;
  const pc = priorityConfig[prio];
  const displayName = currentLead.name || currentLead.businessName || 'Unnamed Lead';
  const initials = displayName.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

  const leadActivity = activity.filter((a) => a.leadId === currentLead.id);

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addNote(currentLead.id, noteText.trim());
    setNoteText('');
  };

  const handleDelete = () => {
    deleteLead(currentLead.id);
    onClose();
  };

  const activityIcons: Record<string, typeof UserPlus> = {
    lead_created: UserPlus,
    lead_moved: ArrowRight,
    lead_edited: Pencil,
    lead_deleted: Trash2,
    note_added: FileText,
  };

  const activityColors: Record<string, string> = {
    lead_created: '#10b981',
    lead_moved: '#3b82f6',
    lead_edited: '#f59e0b',
    lead_deleted: '#ef4444',
    note_added: '#8b5cf6',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.3)', zIndex: 400, backdropFilter: 'blur(2px)' }}
      />

      {/* Drawer panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 440,
        background: '#fff', zIndex: 401, display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.12)',
        animation: 'slideIn 0.2s ease-out',
      }}>
        <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              backgroundColor: brand.primaryColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 14, fontWeight: 700,
            }}>{initials}</div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {displayName}
              </p>
              {currentLead.businessName && currentLead.name && (
                <p style={{ fontSize: 12.5, color: '#94a3b8', marginTop: 1 }}>{currentLead.businessName}</p>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <button onClick={() => onEdit(currentLead)} title="Edit"
              style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: '#f1f5f9', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Pencil size={14} />
            </button>
            <button onClick={handleDelete} title="Delete"
              style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: '#fef2f2', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trash2 size={14} />
            </button>
            <button onClick={onClose}
              style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: '#f1f5f9', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Badges row */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {stage && (
              <span style={{ background: `${stage.color}18`, color: stage.color, borderRadius: 99, padding: '4px 12px', fontSize: 12.5, fontWeight: 600 }}>
                {stage.title}
              </span>
            )}
            <span style={{ background: pc.bg, color: pc.color, borderRadius: 99, padding: '4px 12px', fontSize: 12.5, fontWeight: 600, textTransform: 'capitalize' }}>
              {pc.label} Priority
            </span>
            {currentLead.businessSector && (
              <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: 99, padding: '4px 12px', fontSize: 12.5, fontWeight: 500 }}>
                {currentLead.businessSector}
              </span>
            )}
          </div>

          {/* Score */}
          <div style={{ background: '#f8fafc', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Star size={13} /> Lead Score
              </span>
              <span style={{ fontSize: 14, fontWeight: 700, color: (currentLead.score ?? 0) >= 70 ? '#10b981' : (currentLead.score ?? 0) >= 40 ? '#f59e0b' : '#ef4444' }}>
                {currentLead.score ?? 0}/100
              </span>
            </div>
            <div style={{ height: 6, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${currentLead.score ?? 0}%`,
                background: (currentLead.score ?? 0) >= 70 ? '#10b981' : (currentLead.score ?? 0) >= 40 ? '#f59e0b' : '#ef4444',
                borderRadius: 99, transition: 'width 0.4s ease',
              }} />
            </div>
          </div>

          {/* Contact details */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Contact Details</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: Mail, value: currentLead.email, href: `mailto:${currentLead.email}` },
                { icon: Phone, value: currentLead.phone, href: `tel:${currentLead.phone}` },
                { icon: Globe, value: currentLead.website, href: currentLead.website?.startsWith('http') ? currentLead.website : `https://${currentLead.website}` },
                { icon: MapPin, value: currentLead.address, href: undefined },
                { icon: Tag, value: currentLead.source ? `Source: ${currentLead.source}` : '', href: undefined },
                { icon: Calendar, value: currentLead.followUpDate ? `Follow-up: ${new Date(currentLead.followUpDate).toLocaleDateString()}` : '', href: undefined },
              ].filter((r) => r.value).map(({ icon: Icon, value, href }) => (
                <div key={value} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={13} color="#64748b" />
                  </div>
                  {href ? (
                    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                      style={{ fontSize: 13.5, color: brand.primaryColor, textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {value}
                    </a>
                  ) : (
                    <span style={{ fontSize: 13.5, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {currentLead.notes && (
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Notes</p>
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#374151', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {currentLead.notes}
              </div>
            </div>
          )}

          {/* Add note */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Add Note</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAddNote(); }}
                placeholder="Write a note... (Ctrl+Enter to save)"
                rows={2}
                style={{
                  flex: 1, padding: '9px 12px', borderRadius: 9, border: '1.5px solid #e2e8f0',
                  fontSize: 13, color: '#0f172a', resize: 'none', outline: 'none', fontFamily: 'inherit',
                }}
              />
              <button onClick={handleAddNote} disabled={!noteText.trim()}
                style={{
                  width: 38, height: 38, borderRadius: 9, border: 'none', alignSelf: 'flex-end',
                  backgroundColor: noteText.trim() ? brand.primaryColor : '#e2e8f0',
                  color: noteText.trim() ? '#fff' : '#94a3b8',
                  cursor: noteText.trim() ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                <Send size={15} />
              </button>
            </div>
          </div>

          {/* Activity timeline */}
          {leadActivity.length > 0 && (
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Activity</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {leadActivity.map((event, i) => {
                  const Icon = activityIcons[event.type] ?? FileText;
                  const color = activityColors[event.type] ?? '#64748b';
                  return (
                    <div key={event.id} style={{ display: 'flex', gap: 12, position: 'relative' }}>
                      {/* Timeline line */}
                      {i < leadActivity.length - 1 && (
                        <div style={{ position: 'absolute', left: 14, top: 30, bottom: 0, width: 1, background: '#f1f5f9' }} />
                      )}
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                        <Icon size={13} color={color} />
                      </div>
                      <div style={{ flex: 1, paddingBottom: 16 }}>
                        <p style={{ fontSize: 13, color: '#374151' }}>
                          {event.type === 'lead_moved' && `Moved to ${event.toColumn}`}
                          {event.type === 'lead_created' && `Created in ${event.toColumn}`}
                          {event.type === 'lead_edited' && 'Lead updated'}
                          {event.type === 'note_added' && (event.note ? `Note: "${event.note.slice(0, 60)}${event.note.length > 60 ? '…' : ''}"` : 'Note added')}
                          {event.type === 'lead_deleted' && 'Lead deleted'}
                        </p>
                        <p style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 2 }}>{formatRelative(event.timestamp)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Meta */}
          <div style={{ paddingTop: 4, borderTop: '1px solid #f1f5f9' }}>
            <p style={{ fontSize: 11.5, color: '#94a3b8' }}>
              Created {new Date(currentLead.createdAt).toLocaleDateString()} · Last updated {formatRelative(currentLead.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
