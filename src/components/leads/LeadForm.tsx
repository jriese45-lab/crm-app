import { useState } from 'react';
import type { Lead, ColumnId, LeadPriority } from '../../types';
import { Input } from '../ui/Input';
import { useLeadsStore } from '../../store/useLeadsStore';

interface LeadFormProps {
  lead?: Lead;
  defaultColumnId: ColumnId;
  onClose: () => void;
}

const SECTORS = [
  'Retail', 'Restaurant / Food Service', 'Healthcare', 'Automotive',
  'E-commerce', 'Professional Services', 'Hospitality', 'Non-profit',
  'Construction', 'Beauty / Salon', 'Education', 'Other',
];

const SOURCES = ['Cold Call', 'Referral', 'Walk-in', 'Online / Web', 'Trade Show', 'Social Media', 'Other'];

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: 8,
  border: '1.5px solid #e2e8f0',
  background: '#fff',
  color: '#0f172a',
  fontSize: 13.5,
  outline: 'none',
  fontFamily: 'inherit',
  cursor: 'pointer',
};

const labelStyle: React.CSSProperties = {
  fontSize: 12.5,
  fontWeight: 600,
  color: '#374151',
  marginBottom: 5,
  display: 'block',
};

export function LeadForm({ lead, defaultColumnId, onClose }: LeadFormProps) {
  const { addLead, updateLead, columns } = useLeadsStore();
  const [form, setForm] = useState({
    name: lead?.name ?? '',
    businessName: lead?.businessName ?? '',
    businessSector: lead?.businessSector ?? '',
    email: lead?.email ?? '',
    phone: lead?.phone ?? '',
    notes: lead?.notes ?? '',
    columnId: lead?.columnId ?? defaultColumnId,
    priority: (lead?.priority ?? 'medium') as LeadPriority,
    followUpDate: lead?.followUpDate ?? '',
    score: lead?.score ?? 50,
    address: lead?.address ?? '',
    website: lead?.website ?? '',
    source: lead?.source ?? '',
  });

  const set = (key: string, value: string | number) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lead) {
      updateLead(lead.id, form);
    } else {
      addLead(form);
    }
    onClose();
  };

  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

  const priorityColors: Record<LeadPriority, string> = {
    low: '#10b981', medium: '#f59e0b', high: '#ef4444',
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Contact info */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Contact Info</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Input label="Contact Name" placeholder="Jane Smith" value={form.name} onChange={(e) => set('name', e.target.value)} />
          <Input label="Business Name" placeholder="Acme LLC" value={form.businessName} onChange={(e) => set('businessName', e.target.value)} />
          <Input label="Email" type="email" placeholder="jane@acme.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
          <Input label="Phone" type="tel" placeholder="(555) 123-4567" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          <Input label="Website" placeholder="acme.com" value={form.website} onChange={(e) => set('website', e.target.value)} />
          <Input label="Address" placeholder="123 Main St, City" value={form.address} onChange={(e) => set('address', e.target.value)} />
        </div>
      </div>

      {/* Business info */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Business Details</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>Business Sector</label>
            <select value={form.businessSector} onChange={(e) => set('businessSector', e.target.value)} style={selectStyle}>
              <option value="">Select sector...</option>
              {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Lead Source</label>
            <select value={form.source} onChange={(e) => set('source', e.target.value)} style={selectStyle}>
              <option value="">Select source...</option>
              {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Pipeline */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Pipeline</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>Stage</label>
            <select value={form.columnId} onChange={(e) => set('columnId', e.target.value)} style={selectStyle}>
              {sortedColumns.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Priority</label>
            <select
              value={form.priority}
              onChange={(e) => set('priority', e.target.value)}
              style={{ ...selectStyle, color: priorityColors[form.priority as LeadPriority] }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <Input label="Follow-up Date" type="date" value={form.followUpDate} onChange={(e) => set('followUpDate', e.target.value)} />
        </div>

        {/* Lead score slider */}
        <div style={{ marginTop: 12 }}>
          <label style={{ ...labelStyle, display: 'flex', justifyContent: 'space-between' }}>
            <span>Lead Score</span>
            <span style={{ color: form.score >= 70 ? '#10b981' : form.score >= 40 ? '#f59e0b' : '#ef4444', fontWeight: 700 }}>
              {form.score}/100
            </span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={form.score}
            onChange={(e) => set('score', parseInt(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label style={labelStyle}>Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Any additional context..."
          rows={3}
          style={{
            width: '100%',
            padding: '9px 12px',
            borderRadius: 8,
            border: '1.5px solid #e2e8f0',
            background: '#fff',
            color: '#0f172a',
            fontSize: 13.5,
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'inherit',
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4, borderTop: '1px solid #f1f5f9' }}>
        <button type="button" onClick={onClose} style={{
          padding: '9px 18px', borderRadius: 9, background: '#f1f5f9', color: '#374151',
          fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
        }}>
          Cancel
        </button>
        <button type="submit" style={{
          padding: '9px 18px', borderRadius: 9, background: 'var(--color-primary)', color: '#fff',
          fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
          boxShadow: '0 4px 12px var(--color-primary, #4F46E5)30',
        }}>
          {lead ? 'Save Changes' : 'Add Lead'}
        </button>
      </div>
    </form>
  );
}
