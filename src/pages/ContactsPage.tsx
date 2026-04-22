import { useState, useMemo } from 'react';
import { Plus, Search, ChevronUp, ChevronDown, Mail, Phone, ExternalLink, Trash2, Pencil } from 'lucide-react';
import { useLeadsStore } from '../store/useLeadsStore';
import { useBrandStore } from '../store/useBrandStore';
import { Modal } from '../components/ui/Modal';
import { LeadForm } from '../components/leads/LeadForm';
import { LeadDrawer } from '../components/leads/LeadDrawer';
import type { Lead, LeadPriority } from '../types';

type SortKey = 'name' | 'businessName' | 'businessSector' | 'source' | 'priority' | 'score' | 'followUpDate' | 'createdAt';

const PRIORITY_ORDER: Record<LeadPriority, number> = { high: 3, medium: 2, low: 1 };

const priorityBadge: Record<LeadPriority, { bg: string; color: string }> = {
  high:   { bg: 'rgba(239,68,68,0.12)',  color: '#EF4444' },
  medium: { bg: 'rgba(232,160,32,0.12)', color: '#E8A020' },
  low:    { bg: 'rgba(34,197,94,0.12)',  color: '#22C55E' },
};

export function ContactsPage() {
  const { leads, columns, deleteLead } = useLeadsStore();
  const { brand } = useBrandStore();
  const firstColumnId = [...columns].sort((a, b) => a.order - b.order)[0]?.id ?? '';

  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [addingLead, setAddingLead] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [drawerLead, setDrawerLead] = useState<Lead | null>(null);

  const sectors = [...new Set(leads.map((l) => l.businessSector).filter(Boolean))];
  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

  const filtered = useMemo(() => {
    let result = leads;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((l) =>
        l.name.toLowerCase().includes(q) ||
        l.businessName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.includes(q)
      );
    }
    if (sectorFilter) result = result.filter((l) => l.businessSector === sectorFilter);
    if (stageFilter) result = result.filter((l) => l.columnId === stageFilter);
    if (priorityFilter) result = result.filter((l) => l.priority === priorityFilter);

    return [...result].sort((a, b) => {
      let av: string | number = '';
      let bv: string | number = '';
      if (sortKey === 'priority') {
        av = PRIORITY_ORDER[a.priority ?? 'medium'];
        bv = PRIORITY_ORDER[b.priority ?? 'medium'];
      } else if (sortKey === 'score') {
        av = a.score ?? 0;
        bv = b.score ?? 0;
      } else {
        av = (a[sortKey] ?? '') as string;
        bv = (b[sortKey] ?? '') as string;
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [leads, search, sectorFilter, stageFilter, priorityFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k
      ? sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />
      : <ChevronDown size={13} style={{ opacity: 0.25 }} />;

  const thStyle: React.CSSProperties = {
    padding: '10px 14px',
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text-3)',
    textAlign: 'left',
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  };

  const tdStyle: React.CSSProperties = {
    padding: '12px 14px',
    fontSize: 13.5,
    color: 'var(--text-1)',
    borderTop: '1px solid var(--border-1)',
    verticalAlign: 'middle',
  };

  const getStageLabel = (columnId: string) =>
    columns.find((c) => c.id === columnId)?.title ?? '—';

  const getStageColor = (columnId: string) =>
    columns.find((c) => c.id === columnId)?.color ?? '#64748b';

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, color: 'var(--text-1)', letterSpacing: '-0.03em', marginBottom: 4 }}>Contacts</h2>
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>{leads.length} contacts in pipeline</p>
        </div>
        <button
          onClick={() => setAddingLead(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '9px 18px', borderRadius: 9,
            background: 'var(--accent)', color: '#000',
            fontWeight: 600, fontSize: 13.5, border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 20px var(--accent-glow)',
          }}
        >
          <Plus size={15} strokeWidth={2.5} /> Add Contact
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 200 }}>
          <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts..."
            style={{ width: '100%', padding: '9px 12px 9px 32px' }}
          />
        </div>
        <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} style={{ padding: '9px 12px', cursor: 'pointer' }}>
          <option value="">All Stages</option>
          {sortedColumns.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        <select value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)} style={{ padding: '9px 12px', cursor: 'pointer' }}>
          <option value="">All Sectors</option>
          {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} style={{ padding: '9px 12px', cursor: 'pointer' }}>
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-1)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface-2)' }}>
                {[
                  { label: 'Name', key: 'name' as SortKey },
                  { label: 'Business', key: 'businessName' as SortKey },
                  { label: 'Sector', key: 'businessSector' as SortKey },
                  { label: 'Stage', key: null },
                  { label: 'Priority', key: 'priority' as SortKey },
                  { label: 'Score', key: 'score' as SortKey },
                  { label: 'Follow-up', key: 'followUpDate' as SortKey },
                  { label: 'Contact', key: null },
                  { label: '', key: null },
                ].map(({ label, key }) => (
                  <th key={label} style={thStyle} onClick={key ? () => toggleSort(key) : undefined}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {label} {key && <SortIcon k={key} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ ...tdStyle, textAlign: 'center', color: '#94a3b8', padding: '48px 0' }}>
                    {leads.length === 0 ? 'No contacts yet. Add your first lead!' : 'No contacts match your filters.'}
                  </td>
                </tr>
              ) : filtered.map((lead) => {
                const prio = (lead.priority ?? 'medium') as LeadPriority;
                const badge = priorityBadge[prio];
                const stageColor = getStageColor(lead.columnId);
                const displayName = lead.name || lead.businessName || 'Unnamed';
                const initials = displayName.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
                const isOverdue = lead.followUpDate && new Date(lead.followUpDate) < new Date();

                return (
                  <tr
                    key={lead.id}
                    onClick={() => setDrawerLead(lead)}
                    style={{ cursor: 'pointer', transition: 'background 0.1s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}
                  >
                    {/* Name */}
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                          background: 'var(--accent-dim)',
                          border: '1px solid var(--accent-glow)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--accent)', fontSize: 11, fontWeight: 700,
                          fontFamily: 'var(--font-mono)',
                        }}>{initials}</div>
                        <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{displayName}</span>
                      </div>
                    </td>
                    {/* Business */}
                    <td style={{ ...tdStyle, color: 'var(--text-2)' }}>{lead.businessName || '—'}</td>
                    {/* Sector */}
                    <td style={tdStyle}>
                      {lead.businessSector
                        ? <span style={{ background: 'var(--surface-3)', color: 'var(--text-2)', borderRadius: 99, padding: '2px 9px', fontSize: 11.5, fontWeight: 500 }}>{lead.businessSector}</span>
                        : <span style={{ color: 'var(--text-3)' }}>—</span>}
                    </td>
                    {/* Stage */}
                    <td style={tdStyle}>
                      <span style={{ background: `${stageColor}18`, color: stageColor, borderRadius: 99, padding: '3px 10px', fontSize: 11.5, fontWeight: 600, whiteSpace: 'nowrap', border: `1px solid ${stageColor}30` }}>
                        {getStageLabel(lead.columnId)}
                      </span>
                    </td>
                    {/* Priority */}
                    <td style={tdStyle}>
                      <span style={{ background: badge.bg, color: badge.color, borderRadius: 99, padding: '3px 10px', fontSize: 11.5, fontWeight: 600, textTransform: 'capitalize' }}>
                        {prio}
                      </span>
                    </td>
                    {/* Score */}
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 48, height: 4, background: 'var(--surface-4)', borderRadius: 99, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${lead.score ?? 0}%`, background: (lead.score ?? 0) >= 70 ? 'var(--green)' : (lead.score ?? 0) >= 40 ? 'var(--accent)' : 'var(--red)', borderRadius: 99 }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>{lead.score ?? 0}</span>
                      </div>
                    </td>
                    {/* Follow-up */}
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                      {lead.followUpDate
                        ? <span style={{ color: isOverdue ? 'var(--red)' : 'var(--text-2)', fontWeight: isOverdue ? 600 : 400, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                            {isOverdue ? '⚠ ' : ''}{new Date(lead.followUpDate).toLocaleDateString()}
                          </span>
                        : <span style={{ color: 'var(--text-3)' }}>—</span>}
                    </td>
                    {/* Contact links */}
                    <td style={tdStyle} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {lead.email && (
                          <a href={`mailto:${lead.email}`} title={lead.email}
                            style={{ color: '#94a3b8', display: 'flex', alignItems: 'center' }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = brand.primaryColor; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#94a3b8'; }}
                          >
                            <Mail size={15} />
                          </a>
                        )}
                        {lead.phone && (
                          <a href={`tel:${lead.phone}`} title={lead.phone}
                            style={{ color: '#94a3b8', display: 'flex', alignItems: 'center' }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#10b981'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#94a3b8'; }}
                          >
                            <Phone size={15} />
                          </a>
                        )}
                        {lead.website && (
                          <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                            target="_blank" rel="noreferrer" title={lead.website}
                            style={{ color: '#94a3b8', display: 'flex', alignItems: 'center' }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#3b82f6'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#94a3b8'; }}
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </td>
                    {/* Actions */}
                    <td style={tdStyle} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: 4, opacity: 0 }} className="row-actions">
                        <button onClick={() => setEditingLead(lead)} style={{ padding: '4px 6px', borderRadius: 6, border: 'none', background: '#f1f5f9', color: '#64748b', cursor: 'pointer' }} title="Edit">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => deleteLead(lead.id)} style={{ padding: '4px 6px', borderRadius: 6, border: 'none', background: '#fef2f2', color: '#ef4444', cursor: 'pointer' }} title="Delete">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border-1)', fontSize: 11.5, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
            {filtered.length} of {leads.length} contacts
          </div>
        )}
      </div>

      {/* Row action hover styles */}
      <style>{`
        tr:hover .row-actions { opacity: 1 !important; }
      `}</style>

      {addingLead && (
        <Modal title="Add New Contact" onClose={() => setAddingLead(false)} size="lg">
          <LeadForm defaultColumnId={firstColumnId} onClose={() => setAddingLead(false)} />
        </Modal>
      )}
      {editingLead && (
        <Modal title="Edit Contact" onClose={() => setEditingLead(null)} size="lg">
          <LeadForm lead={editingLead} defaultColumnId={editingLead.columnId} onClose={() => setEditingLead(null)} />
        </Modal>
      )}
      {drawerLead && (
        <LeadDrawer lead={drawerLead} onClose={() => setDrawerLead(null)} onEdit={(l) => { setDrawerLead(null); setEditingLead(l); }} />
      )}
    </div>
  );
}
