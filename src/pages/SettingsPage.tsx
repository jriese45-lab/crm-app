import { useState } from 'react';
import { Save, TrendingUp } from 'lucide-react';
import { useBrandStore } from '../store/useBrandStore';
import { Input } from '../components/ui/Input';

const PRESET_COLORS = [
  { label: 'Teal',    value: '#0FBCAE' },
  { label: 'Cyan',    value: '#06B6D4' },
  { label: 'Blue',    value: '#3B82F6' },
  { label: 'Indigo',  value: '#6366F1' },
  { label: 'Violet',  value: '#8B5CF6' },
  { label: 'Emerald', value: '#10B981' },
  { label: 'Rose',    value: '#F43F5E' },
  { label: 'Amber',   value: '#F59E0B' },
];

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--surface-1)',
      border: '1px solid var(--border-1)',
      borderRadius: 14,
      padding: '24px',
    }}>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--text-1)', letterSpacing: '-0.01em', marginBottom: subtitle ? 4 : 18 }}>{title}</p>
      {subtitle && <p style={{ fontSize: 12.5, color: 'var(--text-3)', marginBottom: 18 }}>{subtitle}</p>}
      {children}
    </div>
  );
}

export function SettingsPage() {
  const { brand, updateBrand } = useBrandStore();
  const [form, setForm] = useState({ ...brand });
  const [saved, setSaved] = useState(false);

  const set = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const hexAlpha = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${alpha})`;
  };

  const handleSave = () => {
    updateBrand(form);
    const root = document.documentElement;
    root.style.setProperty('--color-primary', form.primaryColor);
    root.style.setProperty('--accent', form.primaryColor);
    root.style.setProperty('--accent-dim',  hexAlpha(form.primaryColor, 0.12));
    root.style.setProperty('--accent-glow', hexAlpha(form.primaryColor, 0.22));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      {/* Page header — same structure as Dashboard */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, color: 'var(--text-1)', letterSpacing: '-0.03em', marginBottom: 4 }}>
            Settings
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>
            Customize your brand identity and accent color.
          </p>
        </div>
        <button
          onClick={handleSave}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '9px 18px', borderRadius: 9,
            background: 'var(--accent)', color: '#000',
            fontWeight: 600, fontSize: 13.5, border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 20px var(--accent-glow)', transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
        >
          <Save size={15} />
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card title="Brand Identity" subtitle="Your company name and logo">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Input
                label="Company Name"
                value={form.companyName}
                onChange={(e) => set('companyName', e.target.value)}
                placeholder="Your Company"
              />
              <Input
                label="Logo URL"
                value={form.logoUrl}
                onChange={(e) => set('logoUrl', e.target.value)}
                placeholder="https://example.com/logo.png"
                hint="Enter a URL to your logo. Leave blank to use the default icon."
              />
            </div>
          </Card>

          <Card title="Accent Color" subtitle="Used for buttons, active nav, highlights, and glows">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {PRESET_COLORS.map((c) => {
                  const isSelected = form.primaryColor === c.value;
                  return (
                    <button
                      key={c.value}
                      onClick={() => set('primaryColor', c.value)}
                      title={c.label}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        backgroundColor: c.value,
                        border: isSelected ? `2px solid ${c.value}` : '2px solid transparent',
                        boxShadow: isSelected ? `0 0 0 3px var(--surface-1), 0 0 0 5px ${c.value}` : 'none',
                        transition: 'box-shadow 0.15s',
                      }} />
                      <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{c.label}</span>
                    </button>
                  );
                })}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="color"
                  value={form.primaryColor}
                  onChange={(e) => set('primaryColor', e.target.value)}
                  style={{ width: 40, height: 40, borderRadius: 8, cursor: 'pointer', border: '1.5px solid #e2e8f0', padding: 2 }}
                />
                <div style={{ flex: 1 }}>
                  <Input
                    value={form.primaryColor}
                    onChange={(e) => set('primaryColor', e.target.value)}
                    placeholder="#4F46E5"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right column — live preview */}
        <Card title="Live Preview" subtitle="See how your branding looks">
          <div style={{
            borderRadius: 12,
            overflow: 'hidden',
            border: '1px solid #f1f5f9',
            display: 'flex',
            height: 220,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            {/* Mini sidebar */}
            <div style={{ width: 140, background: '#0f1117', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 12px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
                {form.logoUrl ? (
                  <img src={form.logoUrl} alt="logo" style={{ width: 22, height: 22, borderRadius: 5, objectFit: 'cover' }} />
                ) : (
                  <div style={{
                    width: 22, height: 22, borderRadius: 5,
                    backgroundColor: form.primaryColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <TrendingUp size={11} color="#fff" />
                  </div>
                )}
                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {form.companyName || 'Your CRM'}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '10px 8px' }}>
                {['Dashboard', 'Leads', 'Settings'].map((item, i) => (
                  <div key={item} style={{
                    padding: '7px 10px',
                    borderRadius: 7,
                    fontSize: 12,
                    fontWeight: 500,
                    backgroundColor: i === 0 ? form.primaryColor : 'transparent',
                    color: i === 0 ? '#fff' : 'rgba(255,255,255,0.4)',
                  }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Mini content */}
            <div style={{ flex: 1, background: '#f4f6f9', display: 'flex', flexDirection: 'column', padding: 16 }}>
              <div style={{
                background: '#fff',
                borderRadius: 8,
                padding: '10px 12px',
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#0f172a' }}>Dashboard</span>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  backgroundColor: form.primaryColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 9, fontWeight: 700,
                }}>
                  {form.companyName?.charAt(0)?.toUpperCase() || 'C'}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {['Total Leads', 'Closed Won'].map((label) => (
                  <div key={label} style={{
                    background: '#fff', borderRadius: 8, padding: '10px 12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  }}>
                    <p style={{ fontSize: 9, color: '#64748b', marginBottom: 4 }}>{label}</p>
                    <p style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>0</p>
                    <div style={{ height: 2, borderRadius: 99, backgroundColor: form.primaryColor, marginTop: 6, width: '60%' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
