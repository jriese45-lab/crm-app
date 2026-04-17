import { useState } from 'react';
import { Plus, Search, LayoutGrid } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { LeadForm } from '../components/leads/LeadForm';
import { LeadDrawer } from '../components/leads/LeadDrawer';
import { KanbanBoard } from '../components/leads/KanbanBoard';
import { useLeadsStore } from '../store/useLeadsStore';
import { useBrandStore } from '../store/useBrandStore';
import type { Lead } from '../types';

export function LeadsPage() {
  const [addingLead, setAddingLead] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [drawerLead, setDrawerLead] = useState<Lead | null>(null);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const { columns, leads, addColumn } = useLeadsStore();
  const { brand } = useBrandStore();
  const firstColumnId = [...columns].sort((a, b) => a.order - b.order)[0]?.id ?? '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Pipeline</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LayoutGrid size={13} color="#94a3b8" />
            <span style={{ fontSize: 13.5, color: '#64748b' }}>
              {leads.length} lead{leads.length !== 1 ? 's' : ''} across {columns.length} stage{columns.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={addColumn} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '10px 20px', borderRadius: 10,
            backgroundColor: '#fff', color: '#374151',
            fontWeight: 600, fontSize: 14, border: '1px solid #e2e8f0', cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)', fontFamily: 'inherit',
          }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#fff'; }}
          >
            <Plus size={16} strokeWidth={2.5} /> Add Stage
          </button>

          <button onClick={() => setAddingLead(true)} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '10px 20px', borderRadius: 10,
            backgroundColor: brand.primaryColor, color: '#fff',
            fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer',
            boxShadow: `0 4px 14px ${brand.primaryColor}40`, fontFamily: 'inherit',
          }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.9'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
          >
            <Plus size={17} strokeWidth={2.5} /> Add Lead
          </button>
        </div>
      </div>

      {/* Search + filter bar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 180 }}>
          <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads..."
            style={{
              width: '100%', padding: '8px 12px 8px 32px',
              borderRadius: 9, border: '1.5px solid #e2e8f0', background: '#fff',
              fontSize: 13.5, color: '#0f172a', outline: 'none', fontFamily: 'inherit',
            }}
          />
        </div>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} style={{
          padding: '8px 12px', borderRadius: 9, border: '1.5px solid #e2e8f0',
          background: '#fff', fontSize: 13, color: '#374151', cursor: 'pointer', fontFamily: 'inherit',
        }}>
          <option value="">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
      </div>

      {/* Board */}
      <KanbanBoard
        searchQuery={search}
        priorityFilter={priorityFilter}
        onCardClick={(lead) => setDrawerLead(lead)}
      />

      {addingLead && (
        <Modal title="Add New Lead" onClose={() => setAddingLead(false)} size="lg">
          <LeadForm defaultColumnId={firstColumnId} onClose={() => setAddingLead(false)} />
        </Modal>
      )}
      {editingLead && (
        <Modal title="Edit Lead" onClose={() => setEditingLead(null)} size="lg">
          <LeadForm lead={editingLead} defaultColumnId={editingLead.columnId} onClose={() => setEditingLead(null)} />
        </Modal>
      )}
      {drawerLead && (
        <LeadDrawer
          lead={drawerLead}
          onClose={() => setDrawerLead(null)}
          onEdit={(l) => { setDrawerLead(null); setEditingLead(l); }}
        />
      )}
    </div>
  );
}
