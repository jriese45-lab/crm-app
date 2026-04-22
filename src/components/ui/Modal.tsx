import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ title, onClose, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const maxWidth = size === 'sm' ? 420 : size === 'lg' ? 680 : 540;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      animation: 'fadeIn 0.15s ease',
    }}>
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(6px)',
        }}
      />
      <div style={{
        position: 'relative',
        background: 'var(--surface-2)',
        border: '1px solid var(--border-2)',
        borderRadius: 16,
        boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)',
        width: '100%',
        maxWidth,
        maxHeight: '90vh',
        overflowY: 'auto',
        animation: 'fadeUp 0.2s ease',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 22px 16px',
          borderBottom: '1px solid var(--border-1)',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--text-1)',
            letterSpacing: '-0.01em',
          }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28,
              borderRadius: 7,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-3)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--surface-3)'; el.style.color = 'var(--text-1)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'none'; el.style.color = 'var(--text-3)'; }}
          >
            <X size={15} />
          </button>
        </div>
        <div style={{ padding: '22px' }}>{children}</div>
      </div>
    </div>
  );
}
