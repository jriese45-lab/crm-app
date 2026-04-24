import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { BriefcaseBusiness, Plus, Search, CalendarClock, UserRound, DollarSign } from 'lucide-react';

type JobStatus = 'scheduled' | 'in_progress' | 'completed';
type JobPriority = 'low' | 'medium' | 'high';

interface Job {
  id: string;
  title: string;
  customer: string;
  status: JobStatus;
  priority: JobPriority;
  value: number;
  crew: string;
  date: string;
  notes: string;
}

const INITIAL_JOBS: Job[] = [
  {
    id: 'JOB-2041',
    title: 'HVAC retrofit',
    customer: 'Northwind Properties',
    status: 'scheduled',
    priority: 'high',
    value: 6995,
    crew: 'Team Alpha',
    date: '2026-04-23',
    notes: 'Confirm crane window before dispatch.',
  },
  {
    id: 'JOB-2042',
    title: 'Electrical panel swap',
    customer: 'Harbor Dental',
    status: 'in_progress',
    priority: 'medium',
    value: 2980,
    crew: 'Team Bravo',
    date: '2026-04-22',
    notes: 'Permit approved. Replace feeders first.',
  },
  {
    id: 'JOB-2043',
    title: 'Water heater install',
    customer: 'Apex Plumbing',
    status: 'completed',
    priority: 'low',
    value: 3590,
    crew: 'Team Delta',
    date: '2026-04-21',
    notes: 'Ready for invoice and review request.',
  },
];

export function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [selectedId, setSelectedId] = useState(INITIAL_JOBS[0].id);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const filtered = useMemo(() => jobs.filter((job) => {
    if (search && !`${job.title} ${job.customer}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && job.status !== statusFilter) return false;
    if (priorityFilter && job.priority !== priorityFilter) return false;
    return true;
  }), [jobs, search, statusFilter, priorityFilter]);

  const selected = filtered.find((job) => job.id === selectedId) ?? filtered[0] ?? null;

  const addJob = () => {
    const idx = jobs.length + 1;
    const newJob: Job = {
      id: `JOB-${2040 + idx}`,
      title: 'New service call',
      customer: 'New client',
      status: 'scheduled',
      priority: 'medium',
      value: 1200,
      crew: 'Unassigned',
      date: '2026-04-25',
      notes: 'Add scope details and parts list.',
    };
    setJobs((curr) => [newJob, ...curr]);
    setSelectedId(newJob.id);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 32, marginBottom: 6, fontFamily: 'var(--font-display)' }}>Jobs</h2>
          <p style={{ color: 'var(--text-2)' }}>Manage and track all client jobs and work orders.</p>
        </div>
        <button style={primaryBtn} onClick={addJob}><Plus size={15} /> Create Job</button>
      </div>

      <div style={{ ...card, display: 'grid', gridTemplateColumns: '1fr 180px 180px', gap: 8 }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 11, top: 10, color: 'var(--text-3)' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by client or job type..." style={{ width: '100%', paddingLeft: 34 }} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.4fr', gap: 12 }}>
        <section style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <h3 style={{ fontSize: 20, fontFamily: 'var(--font-display)' }}>Jobs</h3>
            <span style={{ color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>{filtered.length}</span>
          </div>

          <div style={{ display: 'grid', gap: 8 }}>
            {filtered.length === 0 ? (
              <div style={{ border: '1px dashed var(--border-2)', borderRadius: 10, padding: 22, textAlign: 'center', color: 'var(--text-2)' }}>
                No jobs match your filters.
              </div>
            ) : filtered.map((job) => (
              <button key={job.id} onClick={() => setSelectedId(job.id)} style={{
                border: '1px solid var(--border-1)', borderRadius: 10, background: selected?.id === job.id ? 'var(--accent-dim)' : 'var(--surface-2)',
                padding: '10px 12px', textAlign: 'left', cursor: 'pointer', color: 'inherit',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <strong>{job.title}</strong>
                  <span style={{ fontSize: 11, color: 'var(--text-2)' }}>{job.id}</span>
                </div>
                <p style={{ color: 'var(--text-2)', fontSize: 12 }}>{job.customer}</p>
              </button>
            ))}
          </div>
        </section>

        <section style={card}>
          {selected ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: 24, fontFamily: 'var(--font-display)' }}>{selected.title}</h3>
                <span style={{ ...pill, background: selected.status === 'completed' ? 'var(--green-dim)' : selected.status === 'in_progress' ? 'var(--purple-dim)' : 'var(--blue-dim)', color: selected.status === 'completed' ? 'var(--green)' : selected.status === 'in_progress' ? 'var(--purple)' : 'var(--blue)' }}>
                  {selected.status.replace('_', ' ')}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <Meta icon={<BriefcaseBusiness size={14} />} label="Job ID" value={selected.id} />
                <Meta icon={<UserRound size={14} />} label="Customer" value={selected.customer} />
                <Meta icon={<CalendarClock size={14} />} label="Scheduled" value={selected.date} />
                <Meta icon={<DollarSign size={14} />} label="Job Value" value={`$${selected.value.toLocaleString()}`} />
              </div>

              <div style={{ border: '1px solid var(--border-1)', borderRadius: 10, padding: '10px 12px', marginBottom: 12, background: 'var(--surface-2)' }}>
                <p style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 5 }}>Crew Assignment</p>
                <p style={{ fontWeight: 600 }}>{selected.crew}</p>
              </div>

              <div style={{ border: '1px solid var(--border-1)', borderRadius: 10, padding: '10px 12px', background: 'var(--surface-2)' }}>
                <p style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 5 }}>Notes</p>
                <p>{selected.notes}</p>
              </div>
            </>
          ) : (
            <div style={{ color: 'var(--text-2)', textAlign: 'center', padding: '24px 0' }}>Select a job to view details.</div>
          )}
        </section>
      </div>
    </div>
  );
}

function Meta({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div style={{ border: '1px solid var(--border-1)', borderRadius: 10, padding: '10px 12px', background: 'var(--surface-2)' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-2)', fontSize: 12, marginBottom: 5 }}>{icon} {label}</div>
      <p style={{ fontWeight: 600 }}>{value}</p>
    </div>
  );
}

const card: CSSProperties = {
  background: 'var(--surface-1)',
  border: '1px solid var(--border-1)',
  borderRadius: 14,
  padding: 14,
};

const primaryBtn: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  border: 'none', borderRadius: 9, padding: '8px 12px',
  background: 'var(--accent)', color: '#000', fontWeight: 600, cursor: 'pointer',
};

const pill: CSSProperties = {
  padding: '4px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600, textTransform: 'capitalize',
};
