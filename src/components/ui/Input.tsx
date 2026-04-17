import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export function Input({ label, hint, className = '', style, ...props }: InputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && (
        <label style={{ fontSize: 12.5, fontWeight: 600, color: '#374151' }}>{label}</label>
      )}
      <input
        className={className}
        style={{
          width: '100%',
          padding: '9px 12px',
          borderRadius: 8,
          border: '1.5px solid #e2e8f0',
          background: '#fff',
          color: '#0f172a',
          fontSize: 13.5,
          outline: 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          fontFamily: 'inherit',
          ...style,
        }}
        onFocus={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px var(--color-primary, #4F46E5)20';
        }}
        onBlur={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        }}
        {...props}
      />
      {hint && <p style={{ fontSize: 11.5, color: '#94a3b8' }}>{hint}</p>}
    </div>
  );
}
