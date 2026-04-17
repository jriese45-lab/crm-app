import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Settings, TrendingUp, Menu, BookUser, Swords } from 'lucide-react';
import { useBrandStore } from '../../store/useBrandStore';

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/leads', icon: TrendingUp, label: 'Pipeline' },
  { to: '/contacts', icon: BookUser, label: 'Contacts' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const WAR_ROOM = { to: '/war-room', icon: Swords, label: 'Sales War Room' };

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  width: number;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { brand } = useBrandStore();

  return (
    <aside style={{ height: '100vh', background: '#0f1117', display: 'flex', flexDirection: 'column', width: '100%', overflow: 'hidden', userSelect: 'none' }}>
      {/* Brand header */}
      <div style={{
        display: 'flex', alignItems: 'center', flexShrink: 0,
        padding: collapsed ? '18px 0' : '18px 14px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        gap: collapsed ? 0 : 10,
      }}>
        <button onClick={onToggle} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, color: 'rgba(255,255,255,0.45)', background: 'transparent', border: 'none', cursor: 'pointer', flexShrink: 0 }}
          onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.08)'; el.style.color = 'rgba(255,255,255,0.9)'; }}
          onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = 'rgba(255,255,255,0.45)'; }}
        >
          <Menu size={17} />
        </button>

        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
            {brand.logoUrl ? (
              <img src={brand.logoUrl} alt="logo" style={{ width: 26, height: 26, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
            ) : (
              <div style={{ width: 26, height: 26, borderRadius: 6, backgroundColor: brand.primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <TrendingUp size={13} color="#fff" />
              </div>
            )}
            <span style={{ color: 'rgba(255,255,255,0.92)', fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {brand.companyName}
            </span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: collapsed ? '12px 8px' : '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'} title={collapsed ? label : undefined}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center',
              gap: collapsed ? 0 : 10,
              justifyContent: collapsed ? 'center' : 'flex-start',
              padding: collapsed ? '10px 0' : '9px 12px',
              borderRadius: 9, fontWeight: 500, fontSize: 13.5,
              textDecoration: 'none',
              width: collapsed ? 40 : '100%',
              height: collapsed ? 40 : 'auto',
              margin: collapsed ? '0 auto' : 0,
              backgroundColor: isActive ? brand.primaryColor : 'transparent',
              color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
              transition: 'background 0.15s, color 0.15s',
            })}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              if (!el.style.backgroundColor.includes('rgb')) return;
              el.style.backgroundColor = 'rgba(255,255,255,0.07)';
              el.style.color = 'rgba(255,255,255,0.85)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              const isActive = el.getAttribute('aria-current') === 'page';
              if (!isActive) { el.style.backgroundColor = 'transparent'; el.style.color = 'rgba(255,255,255,0.5)'; }
            }}
          >
            <Icon size={16} />
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>

      {/* War Room CTA */}
      <div style={{ padding: collapsed ? '10px 8px' : '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <NavLink
          to={WAR_ROOM.to}
          title={collapsed ? WAR_ROOM.label : undefined}
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center',
            gap: collapsed ? 0 : 9,
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '10px 0' : '9px 12px',
            borderRadius: 10,
            fontWeight: 600, fontSize: 13,
            textDecoration: 'none',
            width: collapsed ? 40 : '100%',
            height: collapsed ? 40 : 'auto',
            margin: collapsed ? '0 auto' : 0,
            background: isActive
              ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
              : 'linear-gradient(135deg,rgba(99,102,241,0.18),rgba(139,92,246,0.18))',
            color: isActive ? '#fff' : 'rgba(167,139,250,0.95)',
            border: isActive ? 'none' : '1px solid rgba(99,102,241,0.3)',
            transition: 'all 0.15s',
          })}
        >
          <WAR_ROOM.icon size={15} />
          {!collapsed && WAR_ROOM.label}
        </NavLink>
      </div>

      {!collapsed && (
        <div style={{ padding: '10px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>v1.0 — White Label CRM</span>
        </div>
      )}
    </aside>
  );
}
