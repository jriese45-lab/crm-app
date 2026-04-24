import { type CSSProperties, type ReactNode } from 'react';
import { MapPinned, Route, DollarSign, Truck, Timer, AlertTriangle, Sparkles, Gauge, CheckCircle2 } from 'lucide-react';

const KPI = [
  { label: 'Jobs Scheduled', value: '14', sub: 'Today', icon: Truck, color: 'var(--blue)' },
  { label: 'Projected Revenue', value: '$12,480', sub: 'This week', icon: DollarSign, color: 'var(--green)' },
  { label: 'Projected Profit', value: '$4,090', sub: '32.8% margin', icon: Gauge, color: 'var(--purple)' },
  { label: 'Route Efficiency', value: '91%', sub: 'Drive time optimized', icon: Route, color: 'var(--accent)' },
];

const ROUTES = [
  { tech: 'Mike R.', vehicle: 'Truck 04', stops: 5, distance: '33 mi', etaRisk: 'Low', fuel: '$22.14' },
  { tech: 'Jamie L.', vehicle: 'Van 11', stops: 6, distance: '28 mi', etaRisk: 'Medium', fuel: '$19.02' },
  { tech: 'Rosa P.', vehicle: 'Truck 02', stops: 4, distance: '41 mi', etaRisk: 'High', fuel: '$26.30' },
];

const COST_LINES = [
  { job: 'J-1082 · HVAC Replacement', labor: 1850, material: 2430, misc: 290, sell: 6995 },
  { job: 'J-1085 · Commercial Water Heater', labor: 1250, material: 890, misc: 120, sell: 3590 },
  { job: 'J-1088 · Electrical Panel Upgrade', labor: 980, material: 1200, misc: 90, sell: 2980 },
];

export function FieldOpsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 32, marginBottom: 6, fontFamily: 'var(--font-display)' }}>
            <MapPinned size={28} color="var(--accent)" /> Field Ops
          </h2>
          <p style={{ color: 'var(--text-2)' }}>Job costing, route planning, and live field performance in one workspace.</p>
        </div>
        <button style={primaryBtn}><Sparkles size={15} /> Optimize Routes</button>
      </div>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(160px, 1fr))', gap: 12 }}>
        {KPI.map((item) => (
          <article key={item.label} style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-2)', fontSize: 12 }}>{item.label}</span>
              <item.icon size={16} color={item.color} />
            </div>
            <p style={{ fontSize: 30, fontWeight: 700, marginTop: 8 }}>{item.value}</p>
            <p style={{ color: 'var(--text-2)', fontSize: 12 }}>{item.sub}</p>
          </article>
        ))}
      </section>

      <section style={{ ...card, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 14, borderBottom: '1px solid var(--border-1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 20, fontFamily: 'var(--font-display)' }}>Route Board</h3>
          <span style={{ color: 'var(--text-2)', fontSize: 12 }}>Live dispatch snapshot</span>
        </div>
        <div style={{ padding: 14, display: 'grid', gap: 8 }}>
          {ROUTES.map((route) => (
            <div key={route.tech} style={{ border: '1px solid var(--border-1)', borderRadius: 10, padding: '10px 12px', display: 'grid', gridTemplateColumns: '1.2fr repeat(5, 1fr)', gap: 8, alignItems: 'center', background: 'var(--surface-2)' }}>
              <div>
                <p style={{ fontWeight: 600 }}>{route.tech}</p>
                <p style={{ color: 'var(--text-2)', fontSize: 12 }}>{route.vehicle}</p>
              </div>
              <Stat label="Stops" value={String(route.stops)} />
              <Stat label="Distance" value={route.distance} />
              <Stat label="Fuel" value={route.fuel} />
              <Stat label="ETA Risk" value={route.etaRisk} warn={route.etaRisk === 'High'} />
              <button style={ghostBtn}>View Route</button>
            </div>
          ))}
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <section style={{ ...card, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: 14, borderBottom: '1px solid var(--border-1)' }}>
            <h3 style={{ fontSize: 20, fontFamily: 'var(--font-display)' }}>Job Costing + Profitability</h3>
          </div>
          <table style={{ width: '100%' }}>
            <thead>
              <tr style={{ background: 'var(--surface-2)' }}>
                {['Job', 'Labor', 'Material', 'Misc', 'Sell Price', 'Profit'].map((h) => (
                  <th key={h} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COST_LINES.map((line) => {
                const cost = line.labor + line.material + line.misc;
                const profit = line.sell - cost;
                const margin = Math.round((profit / line.sell) * 100);
                return (
                  <tr key={line.job}>
                    <td style={td}>{line.job}</td>
                    <td style={td}>${line.labor.toLocaleString()}</td>
                    <td style={td}>${line.material.toLocaleString()}</td>
                    <td style={td}>${line.misc.toLocaleString()}</td>
                    <td style={td}>${line.sell.toLocaleString()}</td>
                    <td style={{ ...td, color: margin < 25 ? 'var(--red)' : 'var(--green)', fontWeight: 600 }}>${profit.toLocaleString()} ({margin}%)</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section style={card}>
          <h3 style={{ fontSize: 20, fontFamily: 'var(--font-display)', marginBottom: 8 }}>Field Alerts</h3>
          <div style={{ display: 'grid', gap: 10 }}>
            <AlertCard icon={<AlertTriangle size={15} color="var(--red)" />} text="Route 2 has 18 minute delay risk." />
            <AlertCard icon={<Timer size={15} color="var(--purple)" />} text="2 jobs are nearing labor budget cap." />
            <AlertCard icon={<CheckCircle2 size={15} color="var(--green)" />} text="4 jobs completed and ready to invoice." />
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div>
      <p style={{ fontSize: 11, color: 'var(--text-2)' }}>{label}</p>
      <p style={{ color: warn ? 'var(--red)' : 'var(--text-1)', fontWeight: 600 }}>{value}</p>
    </div>
  );
}

function AlertCard({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div style={{ border: '1px solid var(--border-1)', borderRadius: 10, padding: '10px 12px', background: 'var(--surface-2)', display: 'flex', gap: 8, alignItems: 'center' }}>
      {icon}
      <span>{text}</span>
    </div>
  );
}

const card: CSSProperties = {
  background: 'var(--surface-1)',
  border: '1px solid var(--border-1)',
  borderRadius: 14,
  padding: 14,
};

const primaryBtn: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  border: 'none', borderRadius: 9, padding: '8px 12px',
  background: 'var(--accent)', color: '#000', fontWeight: 600, cursor: 'pointer',
};

const ghostBtn: CSSProperties = {
  border: '1px solid var(--border-2)', borderRadius: 8, padding: '6px 10px',
  background: 'var(--surface-1)', color: 'var(--text-1)', cursor: 'pointer',
};

const th: CSSProperties = {
  textAlign: 'left',
  fontSize: 11,
  color: 'var(--text-2)',
  fontFamily: 'var(--font-mono)',
  padding: '10px 12px',
};

const td: CSSProperties = {
  padding: '10px 12px',
  borderTop: '1px solid var(--border-1)',
};
