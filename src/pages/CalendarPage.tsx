import { useMemo, useState, type CSSProperties } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, List, CalendarRange, Plus, Sparkles, Clock3 } from 'lucide-react';

type EventType = 'activity' | 'project' | 'follow_up';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: EventType;
  time: string;
}

const EVENTS: CalendarEvent[] = [
  { id: 'evt-1', title: 'Discovery call · Northwind', date: '2026-04-07', type: 'activity', time: '09:30 AM' },
  { id: 'evt-2', title: 'Route planning sync', date: '2026-04-10', type: 'project', time: '08:00 AM' },
  { id: 'evt-3', title: 'Proposal follow-up · Apex Plumbing', date: '2026-04-22', type: 'follow_up', time: '11:00 AM' },
  { id: 'evt-4', title: 'Estimate review · Beacon Dental', date: '2026-04-24', type: 'activity', time: '02:00 PM' },
  { id: 'evt-5', title: 'Team huddle · Field ops', date: '2026-04-29', type: 'project', time: '07:45 AM' },
];

const TYPE_LABEL: Record<EventType, string> = {
  activity: 'Activity',
  project: 'Project',
  follow_up: 'Lead Follow-up',
};

const TYPE_COLOR: Record<EventType, string> = {
  activity: 'var(--blue)',
  project: 'var(--green)',
  follow_up: 'var(--purple)',
};

export function CalendarPage() {
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');
  const [activeType, setActiveType] = useState<'all' | EventType>('all');
  const [anchorDate, setAnchorDate] = useState(new Date('2026-04-01T12:00:00'));

  const days = useMemo(() => {
    const year = anchorDate.getFullYear();
    const month = anchorDate.getMonth();
    const first = new Date(year, month, 1);
    const gridStart = new Date(first);
    gridStart.setDate(first.getDate() - first.getDay());

    return Array.from({ length: 35 }, (_, i) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + i);
      return date;
    });
  }, [anchorDate]);

  const monthLabel = anchorDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const visibleEvents = EVENTS.filter((evt) => activeType === 'all' || evt.type === activeType);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 34, marginBottom: 6, fontFamily: 'var(--font-display)' }}>
            <CalendarDays size={30} color="var(--accent)" /> Calendar
          </h2>
          <p style={{ color: 'var(--text-2)' }}>Your schedule, projects, and follow-ups in one place.</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button style={primaryBtn}><Plus size={15} /> Quick Add</button>
            <button style={ghostBtn}><Sparkles size={15} /> AI Schedule</button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button style={ghostBtn}>Select</button>
          <button style={ghostBtn}>Today</button>
        </div>
      </div>

      <section style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => setAnchorDate(new Date(anchorDate.getFullYear(), anchorDate.getMonth() - 1, 1))} style={iconBtn}><ChevronLeft size={16} /></button>
            <h3 style={{ fontSize: 30, fontFamily: 'var(--font-display)' }}>{monthLabel}</h3>
            <button onClick={() => setAnchorDate(new Date(anchorDate.getFullYear(), anchorDate.getMonth() + 1, 1))} style={iconBtn}><ChevronRight size={16} /></button>
          </div>
          <div style={{ display: 'flex', background: 'var(--surface-2)', border: '1px solid var(--border-1)', borderRadius: 10, padding: 4 }}>
            <button onClick={() => setViewMode('month')} style={viewMode === 'month' ? primaryBtnSmall : tabBtn}><CalendarRange size={14} /> Month</button>
            <button onClick={() => setViewMode('list')} style={viewMode === 'list' ? primaryBtnSmall : tabBtn}><List size={14} /> List</button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <button onClick={() => setActiveType('all')} style={activeType === 'all' ? primaryBtnSmall : ghostBtnSmall}>All</button>
          <button onClick={() => setActiveType('activity')} style={activeType === 'activity' ? primaryBtnSmall : ghostBtnSmall}>Activity</button>
          <button onClick={() => setActiveType('project')} style={activeType === 'project' ? primaryBtnSmall : ghostBtnSmall}>Project</button>
          <button onClick={() => setActiveType('follow_up')} style={activeType === 'follow_up' ? primaryBtnSmall : ghostBtnSmall}>Lead Follow-up</button>
        </div>

        {viewMode === 'month' ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: 8 }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} style={{ padding: '6px 8px', color: 'var(--text-2)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{day}</div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
              {days.map((date) => {
                const iso = date.toISOString().slice(0, 10);
                const dayEvents = visibleEvents.filter((evt) => evt.date === iso);
                const inMonth = date.getMonth() === anchorDate.getMonth();

                return (
                  <div key={iso} style={{ border: '1px solid var(--border-1)', borderRadius: 10, minHeight: 108, padding: 8, background: inMonth ? 'var(--surface-2)' : 'rgba(255,255,255,0.02)' }}>
                    <p style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: inMonth ? 'var(--text-2)' : 'var(--text-3)', marginBottom: 6 }}>{date.getDate()}</p>
                    {dayEvents.slice(0, 2).map((evt) => (
                      <div key={evt.id} style={{ fontSize: 11, borderRadius: 8, padding: '4px 6px', background: 'var(--surface-1)', borderLeft: `3px solid ${TYPE_COLOR[evt.type]}`, marginBottom: 4 }}>
                        {evt.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {visibleEvents.map((evt) => (
              <div key={evt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-1)', borderRadius: 10, padding: '10px 12px', background: 'var(--surface-2)' }}>
                <div>
                  <p style={{ fontWeight: 600 }}>{evt.title}</p>
                  <p style={{ color: 'var(--text-2)', fontSize: 12 }}>{evt.date} · {TYPE_LABEL[evt.type]}</p>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-2)' }}><Clock3 size={14} /> {evt.time}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={card}>
        <h4 style={{ fontSize: 22, marginBottom: 8, fontFamily: 'var(--font-display)' }}>Upcoming Events</h4>
        <div style={{ display: 'grid', gap: 8 }}>
          {visibleEvents.slice(0, 4).map((evt) => (
            <div key={evt.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-1)', padding: '8px 0' }}>
              <span>{evt.title}</span>
              <span style={{ color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>{evt.date}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const card: CSSProperties = {
  background: 'var(--surface-1)',
  border: '1px solid var(--border-1)',
  borderRadius: 14,
  padding: 16,
};

const primaryBtn: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  border: 'none', borderRadius: 9, padding: '8px 12px',
  background: 'var(--accent)', color: '#000', fontWeight: 600, cursor: 'pointer',
};

const ghostBtn: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  border: '1px solid var(--border-2)', borderRadius: 9, padding: '8px 12px',
  background: 'var(--surface-2)', color: 'var(--text-1)', fontWeight: 600, cursor: 'pointer',
};

const iconBtn: CSSProperties = {
  width: 34, height: 34, borderRadius: 9, border: '1px solid var(--border-2)',
  background: 'var(--surface-2)', color: 'var(--text-1)', display: 'grid', placeItems: 'center', cursor: 'pointer',
};

const tabBtn: CSSProperties = {
  border: 'none', borderRadius: 8, padding: '6px 10px',
  background: 'transparent', color: 'var(--text-2)', display: 'inline-flex', gap: 6, alignItems: 'center', cursor: 'pointer',
};

const primaryBtnSmall: CSSProperties = {
  ...primaryBtn,
  padding: '6px 10px',
  fontSize: 12,
};

const ghostBtnSmall: CSSProperties = {
  ...ghostBtn,
  padding: '6px 10px',
  fontSize: 12,
};
