import { useEffect, useState, useRef, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useBrandStore } from '../../store/useBrandStore';

const MIN_WIDTH = 64;
const MAX_WIDTH = 320;
const DEFAULT_WIDTH = 248;

export function Layout() {
  const { brand } = useBrandStore();
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(DEFAULT_WIDTH);

  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', brand.primaryColor);
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
    <div style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden', background: '#f4f6f9' }}>
      {/* Sidebar */}
      <div style={{ position: 'relative', display: 'flex', flexShrink: 0, width: effectiveWidth }}>
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} width={effectiveWidth} />
        {!collapsed && (
          <div
            onMouseDown={onMouseDown}
            style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 4, cursor: 'col-resize', zIndex: 10 }}
          />
        )}
      </div>

      {/* Main */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <TopBar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
        <main style={{ flex: 1, overflow: 'auto' }}>
          <div style={{ padding: '36px 40px', minHeight: '100%' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
