import { useState, useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, Check, X, Palette, Trash2 } from 'lucide-react';
import type { KanbanColumn as IColumn, Lead } from '../../types';
import { useLeadsStore } from '../../store/useLeadsStore';
import { LeadCard } from './LeadCard';
import { Modal } from '../ui/Modal';
import { LeadForm } from './LeadForm';

interface KanbanColumnProps {
  column: IColumn;
  leads: Lead[];
  onCardClick?: (lead: Lead) => void;
}

const PRESET_COLORS = [
  '#6366f1', '#3b82f6', '#0ea5e9', '#10b981', '#f59e0b',
  '#ef4444', '#8b5cf6', '#ec4899', '#64748b', '#14b8a6',
];

export function KanbanColumn({ column, leads, onCardClick }: KanbanColumnProps) {
  const { renameColumn, setColumnColor, deleteColumn } = useLeadsStore();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [addingLead, setAddingLead] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: 'column', columnId: column.id },
  });

  const leadIds = leads.map((l) => l.id);

  const commitRename = () => {
    if (title.trim()) renameColumn(column.id, title.trim());
    else setTitle(column.title);
    setEditing(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 280, flexShrink: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: '0 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          {/* Color dot */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <button
              onClick={() => setShowColorPicker((s) => !s)}
              style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: column.color, border: 'none', cursor: 'pointer', padding: 0 }}
            />
            {showColorPicker && (
              <div style={{
                position: 'absolute', top: 16, left: 0,
                background: '#fff', borderRadius: 12,
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: 14, zIndex: 100, width: 170,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10, color: '#94a3b8', fontSize: 11 }}>
                  <Palette size={11} /> Pick a color
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 10 }}>
                  {PRESET_COLORS.map((c) => (
                    <button key={c} onClick={(e) => { e.stopPropagation(); setColumnColor(column.id, c); setShowColorPicker(false); }}
                      style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: c, border: c === column.color ? '2.5px solid #0f172a' : '2.5px solid transparent', cursor: 'pointer', padding: 0 }}
                    />
                  ))}
                </div>
                <input type="color" value={column.color} onChange={(e) => setColumnColor(column.id, e.target.value)}
                  style={{ width: '100%', height: 26, borderRadius: 6, cursor: 'pointer', border: 'none' }}
                />
              </div>
            )}
          </div>

          {editing ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
              <input ref={inputRef} value={title} onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') { setTitle(column.title); setEditing(false); } }}
                onBlur={commitRename} autoFocus
                style={{ flex: 1, fontSize: 13, fontWeight: 600, padding: '3px 8px', border: '1.5px solid var(--color-primary)', borderRadius: 6, outline: 'none', color: '#0f172a', fontFamily: 'inherit' }}
              />
              <button onClick={commitRename} style={{ padding: 3, color: '#10b981', background: 'none', border: 'none', cursor: 'pointer' }}><Check size={12} /></button>
              <button onClick={() => { setTitle(column.title); setEditing(false); }} style={{ padding: 3, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}><X size={12} /></button>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} style={{ fontSize: 13, fontWeight: 600, color: '#374151', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {column.title}
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, marginLeft: 6 }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#94a3b8', backgroundColor: '#f1f5f9', borderRadius: 99, padding: '2px 8px' }}>
            {leads.length}
          </span>
          <button onClick={() => setAddingLead(true)}
            style={{ width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = '#f1f5f9'; el.style.color = '#374151'; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = 'none'; el.style.color = '#94a3b8'; }}
          >
            <Plus size={14} />
          </button>
          <button onClick={() => deleteColumn(column.id)}
            style={{ width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = '#fef2f2'; el.style.color = '#ef4444'; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = 'none'; el.style.color = '#94a3b8'; }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Drop zone */}
      <div ref={setNodeRef} style={{
        flex: 1, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 120,
        borderRadius: 14, padding: 8,
        backgroundColor: isOver ? `${column.color}12` : '#edf0f4',
        outline: isOver ? `2px solid ${column.color}50` : '2px solid transparent',
        transition: 'background 0.15s, outline 0.15s',
      }}>
        <SortableContext items={leadIds} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onClick={() => onCardClick?.(lead)} />
          ))}
        </SortableContext>
        {leads.length === 0 && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>
            <span style={{ fontSize: 12, color: '#b8bfcc' }}>Drop leads here</span>
          </div>
        )}
      </div>

      {addingLead && (
        <Modal title={`Add Lead — ${column.title}`} onClose={() => setAddingLead(false)} size="lg">
          <LeadForm defaultColumnId={column.id} onClose={() => setAddingLead(false)} />
        </Modal>
      )}
    </div>
  );
}
