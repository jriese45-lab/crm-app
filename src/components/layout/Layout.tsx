import { useEffect, useState, useRef, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useBrandStore } from '../../store/useBrandStore';

const MIN_WIDTH = 64;
const MAX_WIDTH = 320;
const DEFAULT_WIDTH = 220;

function hexAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function Layout() {
  const { brand } = useBrandStore();
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(DEFAULT_WIDTH);

  useEffect(() => {
    const c = brand.primaryColor;
    const root = document.documentElement;
    root.style.setProperty('--color-primary', c);
    root.style.setProperty('--accent', c);
    // Derive dim/glow by appending alpha to hex
    root.style.setProperty('--accent-dim',  hexAlpha(c, 0.12));
    root.style.setProperty('--accent-glow', hexAlpha(c, 0.22));
  }, [brand.primaryColor]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (collapsed) return;
    dragging.current = true;
    startX.current = e.clientX;
    startWidth.current = sidebarWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [collapsed, sidebarWidth]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const delta = e.clientX - startX.current;
      const next = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth.current + delta));
      setSidebarWidth(next);
    };
    const onMouseUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const effectiveWidth = collapsed ? MIN_WIDTH : sidebarWidth;

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100%',
      overflow: 'hidden',
      background: 'var(--bg)',
    }}>
      {/* Sidebar */}
      <div style={{ position: 'relative', display: 'flex', flexShrink: 0, width: effectiveWidth }}>
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} width={effectiveWidth} />
        {!collapsed && (
          <div
            onMouseDown={onMouseDown}
            style={{
              position: 'absolute', right: 0, top: 0, bottom: 0, width: 4,
              cursor: 'col-resize', zIndex: 10,
            }}
          />
        )}
      </div>

      {/* Main content area */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <TopBar />
        <main style={{ flex: 1, overflow: 'auto', background: 'var(--bg)' }}>
          <div style={{ padding: '32px 36px', minHeight: '100%' }} className="animate-fade-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
