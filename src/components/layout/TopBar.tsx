import { useLocation } from 'react-router-dom';
import { useBrandStore } from '../../store/useBrandStore';

const PAGE_META: Record<string, { title: string; sub: string }> = {
  '/':          { title: 'Dashboard',       sub: 'Overview & pipeline health'      },
  '/calendar':  { title: 'Calendar',        sub: 'Scheduling & follow-ups'          },
  '/leads':     { title: 'Pipeline',        sub: 'Manage your lead stages'         },
  '/jobs':      { title: 'Jobs',            sub: 'Track active work orders'         },
  '/field-ops': { title: 'Field Ops',       sub: 'Route planning & job costing'     },
  '/contacts':  { title: 'Contacts',        sub: 'Full contact database'           },
  '/documents': { title: 'Documents',       sub: 'Proposals & invoices'             },
  '/settings':  { title: 'Settings',        sub: 'Brand & preferences'             },
  '/war-room':  { title: 'Sales War Room',  sub: 'NEPQ AI training'                },
};

export function TopBar() {
  const { pathname } = useLocation();
  const { brand } = useBrandStore();
  const meta = PAGE_META[pathname] ?? { title: 'CRM', sub: '' };
  const initial = brand.companyName.charAt(0).toUpperCase();
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <header style={{
      height: 60,
      background: 'var(--surface-1)',
      borderBottom: '1px solid var(--border-1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      flexShrink: 0,
    }}>
      {/* Left: page title */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 18,
          fontWeight: 600,
          color: 'var(--text-1)',
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}>
          {meta.title}
        </h1>
        <span style={{
          fontSize: 12,
          color: 'var(--text-3)',
          fontFamily: 'var(--font-body)',
          fontWeight: 400,
        }}>
          {meta.sub}
        </span>
      </div>

      {/* Right: clock + avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--text-1)',
            letterSpacing: '0.02em',
          }}>
            {timeStr}
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10.5,
            color: 'var(--text-3)',
            letterSpacing: '0.02em',
          }}>
            {dateStr}
          </div>
        </div>

        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, var(--accent), #C47A10)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#000',
          fontWeight: 700,
          fontSize: 12.5,
          fontFamily: 'var(--font-mono)',
          cursor: 'pointer',
          flexShrink: 0,
        }}>
          {initial}
        </div>
      </div>
    </header>
  );
}
