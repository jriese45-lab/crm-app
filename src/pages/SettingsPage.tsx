import { useState } from 'react';
import { Save, TrendingUp } from 'lucide-react';
import { useBrandStore } from '../store/useBrandStore';
import { Input } from '../components/ui/Input';

const PRESET_COLORS = [
  { label: 'Indigo', value: '#4F46E5' },
  { label: 'Blue', value: '#2563EB' },
  { label: 'Emerald', value: '#059669' },
  { label: 'Violet', value: '#7C3AED' },
  { label: 'Rose', value: '#E11D48' },
  { label: 'Amber', value: '#D97706' },
  { label: 'Cyan', value: '#0891B2' },
  { label: 'Slate', value: '#475569' },
];

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: '24px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
    }}>
      <p style={{ fontSize: 13.5, fontWeight: 600, color: '#0f172a', marginBottom: subtitle ? 4 : 18 }}>{title}</p>
      {subtitle && <p style={{ fontSize: 12.5, color: '#94a3b8', marginBottom: 18 }}>{subtitle}</p>}
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

  const handleSave = () => {
    updateBrand(form);
    document.documentElement.style.setProperty('--color-primary', form.primaryColor);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      {/* Page header — same structure as Dashboard */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
            White Label Settings
          </h2>
          <p style={{ fontSize: 13.5, color: '#64748b' }}>
            Customize the CRM to match your brand identity.
          </p>
        </div>
        <button
          onClick={handleSave}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: '10px 20px',
            borderRadius: 10,
            backgroundColor: brand.primaryColor,
            color: '#fff',
            fontWeight: 600,
            fontSize: 14,
            border: 'none',
            cursor: 'pointer',
            boxShadow: `0 4px 14px ${brand.primaryColor}40`,
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.9'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
        >
          <Save size={16} />
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

          <Card title="Primary Color" subtitle="Used for buttons, highlights, and active states">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => set('primaryColor', c.value)}
                    title={c.label}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 5,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: c.value,
                      border: form.primaryColor === c.value ? '2.5px solid #0f172a' : '2.5px solid transparent',
                      boxShadow: form.primaryColor === c.value ? '0 0 0 2px #fff, 0 0 0 4px #0f172a' : 'none',
                      transition: 'transform 0.1s',
                    }} />
                    <span style={{ fontSize: 10.5, color: '#94a3b8' }}>{c.label}</span>
                  </button>
                ))}
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
