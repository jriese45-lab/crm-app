import { useLocation } from 'react-router-dom';
import { useBrandStore } from '../../store/useBrandStore';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/leads': 'Pipeline',
  '/contacts': 'Contacts',
  '/settings': 'Settings',
  '/war-room': 'Sales War Room',
};

interface TopBarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function TopBar({ collapsed: _c, onToggle: _t }: TopBarProps) {
  const { pathname } = useLocation();
  const { brand } = useBrandStore();
  const title = PAGE_TITLES[pathname] ?? 'CRM';

  return (
    <header
      style={{
        height: 56,
        background: '#fff',
        borderBottom: '1px solid #eef0f4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        flexShrink: 0,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <span style={{ fontSize: 15, fontWeight: 600, color: '#1a1f2e' }}>{title}</span>
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          backgroundColor: brand.primaryColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 700,
          fontSize: 13,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        {brand.companyName.charAt(0).toUpperCase()}
      </div>
    </header>
  );
}
