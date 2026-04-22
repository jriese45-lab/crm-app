import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  TrendingUp,
  BookUser,
  Swords,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  MapPinned,
  FileText,
  BriefcaseBusiness,
} from 'lucide-react';
import { useBrandStore } from '../../store/useBrandStore';

const NAV = [
  { to: '/',         icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/calendar', icon: CalendarDays,    label: 'Calendar'   },
  { to: '/leads',    icon: TrendingUp,      label: 'Pipeline'  },
  { to: '/jobs',     icon: BriefcaseBusiness, label: 'Jobs'    },
  { to: '/field-ops', icon: MapPinned,      label: 'Field Ops' },
  { to: '/contacts', icon: BookUser,        label: 'Contacts'  },
  { to: '/documents', icon: FileText,       label: 'Documents' },
  { to: '/settings', icon: Settings,        label: 'Settings'  },
];

const WAR_ROOM = { to: '/war-room', icon: Swords, label: 'War Room' };

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  width: number;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { brand } = useBrandStore();

  return (
    <aside style={{
      height: '100vh',
      background: 'var(--surface-1)',
      borderRight: '1px solid var(--border-1)',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      overflow: 'hidden',
      userSelect: 'none',
    }}>

      {/* Brand header */}
      <div style={{
        height: 60,
        display: 'flex',
        alignItems: 'center',
        padding: collapsed ? '0 12px' : '0 16px',
        justifyContent: collapsed ? 'center' : 'space-between',
        borderBottom: '1px solid var(--border-1)',
        flexShrink: 0,
        gap: 10,
      }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
            {brand.logoUrl ? (
              <img src={brand.logoUrl} alt="logo"
                style={{ width: 28, height: 28, borderRadius: 7, objectFit: 'cover', flexShrink: 0 }} />
            ) : (
              <div style={{
                width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                background: 'linear-gradient(135deg, var(--accent), #C47A10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <TrendingUp size={13} color="#000" strokeWidth={2.5} />
              </div>
            )}
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 15,
              fontWeight: 600,
              color: 'var(--text-1)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              letterSpacing: '-0.01em',
            }}>
              {brand.companyName}
            </span>
          </div>
        )}

        <button
          onClick={onToggle}
          title={collapsed ? 'Expand' : 'Collapse'}
          style={{
            width: 26, height: 26,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 6,
            color: 'var(--text-3)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'color 0.15s, background 0.15s',
          }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--text-1)'; el.style.background = 'var(--surface-3)'; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--text-3)'; el.style.background = 'transparent'; }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav label */}
      {!collapsed && (
        <div style={{ padding: '20px 16px 8px', flexShrink: 0 }}>
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-3)',
            fontFamily: 'var(--font-mono)',
          }}>Navigation</span>
        </div>
      )}

      {/* Nav */}
      <nav style={{
        flex: 1,
        padding: collapsed ? '16px 10px' : '4px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            title={collapsed ? label : undefined}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: collapsed ? 0 : 10,
              justifyContent: collapsed ? 'center' : 'flex-start',
              padding: collapsed ? '10px 0' : '8px 10px',
              borderRadius: 9,
              fontWeight: 500,
              fontSize: 13.5,
              textDecoration: 'none',
              width: collapsed ? 36 : '100%',
              height: collapsed ? 36 : 'auto',
              margin: collapsed ? '2px auto' : 0,
              background: isActive ? 'var(--accent-dim)' : 'transparent',
              color: isActive ? 'var(--accent)' : 'var(--text-2)',
              border: isActive ? '1px solid rgba(232,160,32,0.18)' : '1px solid transparent',
              transition: 'all 0.15s',
            })}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              if (el.getAttribute('aria-current') === 'page') return;
              el.style.background = 'var(--surface-3)';
              el.style.color = 'var(--text-1)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              if (el.getAttribute('aria-current') === 'page') return;
              el.style.background = 'transparent';
              el.style.color = 'var(--text-2)';
            }}
          >
            <Icon size={15} strokeWidth={1.75} />
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>

      {/* War Room CTA */}
      <div style={{ padding: collapsed ? '12px 10px' : '12px', borderTop: '1px solid var(--border-1)', flexShrink: 0 }}>
        {!collapsed && (
          <div style={{ marginBottom: 8, padding: '0 6px' }}>
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-3)',
              fontFamily: 'var(--font-mono)',
            }}>Training</span>
          </div>
        )}
        <NavLink
          to={WAR_ROOM.to}
          title={collapsed ? WAR_ROOM.label : undefined}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: collapsed ? 0 : 10,
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '10px 0' : '9px 12px',
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 13,
            textDecoration: 'none',
            width: collapsed ? 36 : '100%',
            height: collapsed ? 36 : 'auto',
            margin: collapsed ? '0 auto' : 0,
            background: isActive
              ? 'linear-gradient(135deg, rgba(167,139,250,0.25), rgba(139,92,246,0.15))'
              : 'linear-gradient(135deg, rgba(167,139,250,0.08), rgba(139,92,246,0.05))',
            color: 'var(--purple)',
            border: `1px solid ${isActive ? 'rgba(167,139,250,0.3)' : 'rgba(167,139,250,0.12)'}`,
            transition: 'all 0.15s',
          })}
        >
          <WAR_ROOM.icon size={14} strokeWidth={2} />
          {!collapsed && WAR_ROOM.label}
        </NavLink>
      </div>

      {!collapsed && (
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border-1)' }}>
          <span style={{ color: 'var(--text-3)', fontSize: 10.5, fontFamily: 'var(--font-mono)' }}>v1.0</span>
        </div>
      )}
    </aside>
  );
}
